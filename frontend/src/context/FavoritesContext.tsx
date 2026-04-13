"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
    favorites: number[];
    loading: boolean;
    isFavorite: (shopId: number) => boolean;
    toggleFavorite: (shopId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    loading: true,
    isFavorite: () => false,
    toggleFavorite: async () => {},
});

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!user) { setFavorites([]); return; }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/favorites", {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setFavorites(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const isFavorite = (shopId: number) => favorites.includes(shopId);

    const toggleFavorite = async (shopId: number) => {
        if (!user) return;
        const alreadySaved = isFavorite(shopId);
        const method = alreadySaved ? "DELETE" : "POST";

        // Optimistic update
        setFavorites(prev =>
            alreadySaved ? prev.filter(id => id !== shopId) : [...prev, shopId]
        );

        try {
            const res = await fetch(`http://localhost:5000/api/favorites/${shopId}`, {
                method,
                credentials: "include",
            });
            if (res.ok) {
                const updated = await res.json();
                setFavorites(Array.isArray(updated) ? updated : []);
            } else {
                // Revert on failure
                fetchFavorites();
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
            fetchFavorites();
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
