import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { isAuthenticated, getUserId } from '../utils/auth';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        if (!isAuthenticated()) {
            setCartCount(0);
            return;
        }

        const userId = getUserId();
        if (!userId) return;

        try {
            const response = await api.get(`/book/${userId}/`);
            const responseData = response.data;
            const items = responseData && responseData.data ? responseData.data : (Array.isArray(responseData) ? responseData : []);
            
            setCartCount(items.length);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    useEffect(() => {
        fetchCartCount();

        // Listen for auth changes to re-fetch
        const handleAuthChange = () => fetchCartCount();
        window.addEventListener('auth:change', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth:change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
