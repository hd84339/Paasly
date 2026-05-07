const express = require('express');
const axios = require('axios');
const Shop = require('../models/Shop');
const router = express.Router();

// Helper to calculate distance between two points (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
};

// @route   POST /api/shops/nearby
// @desc    Get nearby shops (Partners first, then others from Google)
// @access  Public
router.post('/nearby', async (req, res) => {
    const { lat, lng, type } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Location (lat, lng) is required' });
    }

    try {
        // 1. Fetch Partner Shops from our Database
        const partnerShops = await Shop.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat] // [lng, lat]
                    },
                    $maxDistance: 5000 // 5km radius
                }
            },
            ...(type ? { category: new RegExp(type, 'i') } : {})
        }).lean();

        // Map internal shops to a common format
        const internalResults = partnerShops.map(shop => ({
            id: shop._id,
            name: shop.name,
            category: shop.category,
            rating: shop.rating,
            reviews: shop.reviews,
            distance: calculateDistance(lat, lng, shop.location.coordinates[1], shop.location.coordinates[0]),
            isOpen: true, // Simplified
            imageUrl: shop.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300&h=300',
            isPartner: shop.isPartner,
            source: 'internal'
        }));

        // 2. Fetch Non-Partner Shops from Google Places API (if API Key exists)
        let externalResults = [];
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (apiKey) {
            try {
                const googleResponse = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&keyword=${type || ''}&key=${apiKey}`
                );

                if (googleResponse.data.results) {
                    externalResults = googleResponse.data.results.map(place => ({
                        id: place.place_id,
                        name: place.name,
                        category: type || 'Store',
                        rating: place.rating || 0,
                        reviews: place.user_ratings_total || 0,
                        distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
                        isOpen: place.opening_hours ? place.opening_hours.open_now : true,
                        imageUrl: place.photos 
                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
                            : 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300&h=300',
                        isPartner: false,
                        source: 'external'
                    }));
                }
            } catch (googleError) {
                console.error('Google Places API Error:', googleError.message);
            }
        }

        // 3. Combine and Sort (Partners first, then by distance)
        const allShops = [...internalResults, ...externalResults];
        
        // Remove duplicates if any (e.g. if a partner shop also shows up in Google)
        const uniqueShops = allShops.filter((shop, index, self) =>
            index === self.findIndex((s) => s.name === shop.name)
        );

        uniqueShops.sort((a, b) => {
            // Partner first
            if (a.isPartner && !b.isPartner) return -1;
            if (!a.isPartner && b.isPartner) return 1;
            // Then distance
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        res.json(uniqueShops);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching shops' });
    }
});

// @route   GET /api/shops/reverse-geocode
// @desc    Get address from lat/lng using Google Maps API
// @access  Public
router.get('/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return res.json({ address: 'Mumbai, Maharashtra' }); // Fallback
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (response.data.results && response.data.results.length > 0) {
            // Get a clean short address (e.g. "Borivali West, Mumbai")
            const addressComponents = response.data.results[0].address_components;
            const sublocality = addressComponents.find(c => c.types.includes('sublocality'))?.long_name;
            const locality = addressComponents.find(c => c.types.includes('locality'))?.long_name;
            
            const result = sublocality ? `${sublocality}, ${locality}` : locality;
            return res.json({ address: result || response.data.results[0].formatted_address });
        }
        res.json({ address: 'Unknown Location' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Geocoding error' });
    }
});

module.exports = router;
