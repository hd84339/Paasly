require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./models/Shop');

const seedShops = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing shops
        await Shop.deleteMany({});
        console.log('🗑️  Cleared existing shops.');

        // Sample shops near Borivali, Mumbai (approx 19.2307, 72.8567)
        const shops = [
            {
                name: "Paasly Premium Kirana",
                category: "Grocery",
                rating: 4.9,
                reviews: 150,
                isPartner: true,
                address: "Station Road, Borivali West",
                imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400&h=400",
                location: {
                    type: "Point",
                    coordinates: [72.8567, 19.2307] // [lng, lat]
                }
            },
            {
                name: "Modern Salon & Spa",
                category: "Salon",
                rating: 4.8,
                reviews: 230,
                isPartner: true,
                address: "SV Road, Borivali West",
                imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400&h=400",
                location: {
                    type: "Point",
                    coordinates: [72.8580, 19.2320]
                }
            },
            {
                name: "Quick Fix Mobiles",
                category: "Mobile Repair",
                rating: 4.7,
                reviews: 85,
                isPartner: true,
                address: "Shimpoli Road, Borivali",
                imageUrl: "https://images.unsplash.com/photo-1597872250084-3c5861461e69?auto=format&fit=crop&q=80&w=400&h=400",
                location: {
                    type: "Point",
                    coordinates: [72.8540, 19.2290]
                }
            }
        ];

        await Shop.insertMany(shops);
        console.log('✨ Seeded 3 Partner Shops near Borivali!');
        
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedShops();
