import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserId, getUser } from '../utils/auth';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const userId = getUserId();
    const user = getUser();
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // --- Get all favorites (for this user) ---
    const fetchFavorites = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/favourite/get/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const json = await res.json();
                // Expecting { message, data: [ { id, event: { id, ... } } ] }
                const favoriteEventIds = json.data.map((fav) => fav.event.id);
                setFavorites(new Set(favoriteEventIds));
            } else {
                console.warn('Failed to fetch favorites:', await res.text());
            }
        } catch (err) {
            console.warn('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when user changes or on mount
    useEffect(() => {
        fetchFavorites();
    }, [userId]);

    // --- Add to favorites ---
    const addFavorite = async (eventId) => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/favourite/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: eventId,
                }),
            });
            const json = await res.json();
            if (res.ok) {
                setFavorites((prev) => new Set(prev).add(eventId));
            } else {
                console.warn('Add favorite error:', json.message);
                // Optionally handle "already in favorites" – it's ok
            }
        } catch (err) {
            console.warn('Add favorite request failed:', err);
        }
    };

    // --- Remove from favorites ---
    const removeFavorite = async (eventId) => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/favourite/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: eventId,
                }),
            });
            const json = await res.json();
            if (res.ok) {
                setFavorites((prev) => {
                    const next = new Set(prev);
                    next.delete(eventId);
                    return next;
                });
            } else {
                console.warn('Remove favorite error:', json.message);
            }
        } catch (err) {
            console.warn('Remove favorite request failed:', err);
        }
    };

    // --- Toggle wrapper (optimistic update) ---
    const toggleFavorite = async (eventId) => {
        // If we want to be optimistic, we can update UI immediately and then sync.
        // But to keep it simple, we call the proper API and let the state update on success.
        if (favorites.has(eventId)) {
            await removeFavorite(eventId);
        } else {
            await addFavorite(eventId);
        }
    };

    const isFavorite = (eventId) => favorites.has(eventId);

    const value = {
        favorites,
        toggleFavorite,
        isFavorite,
        loading,
        refreshFavorites: fetchFavorites, // expose if needed
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};