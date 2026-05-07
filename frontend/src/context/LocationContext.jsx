import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState('Select Location');
    const [loading, setLoading] = useState(false);

    // Helper: Reverse Geocoding using Google Maps API (if key available)
    const getAddressFromCoords = async (lat, lng) => {
        try {
            // We'll call our backend to proxy this to avoid exposing API key on frontend
            const res = await fetch(`/api/shops/reverse-geocode?lat=${lat}&lng=${lng}`);
            if (res.ok) {
                const data = await res.json();
                return data.address;
            }
        } catch (err) {
            console.error("Geocoding error:", err);
        }
        return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    };

    const useCurrentLocation = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setLocation(coords);
                    const name = await getAddressFromCoords(coords.lat, coords.lng);
                    setLocationName(name);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    };

    const updateLocationManually = (name, coords) => {
        setLocationName(name);
        setLocation(coords);
    };

    return (
        <LocationContext.Provider value={{ 
            location, 
            locationName, 
            useCurrentLocation, 
            updateLocationManually,
            loading 
        }}>
            {children}
        </LocationContext.Provider>
    );
}

export const useLocation = () => useContext(LocationContext);
