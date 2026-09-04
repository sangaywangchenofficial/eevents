// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Users, Ticket, Heart, Search, ArrowRight, Star
} from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useFavorites } from '../context/FavoritesContext';
import RatingBadge from '../components/RatingBadge';
import { getUser, getUserId, getToken, API_BASE_URL, BACKEND_ORIGIN } from '../utils/auth';

const FavoritesPage = () => {
    const user = getUser();
    const userId = getUserId();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all favorited events from your backend
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const res = await fetch(
                    `${API_BASE_URL}/favourite/get/${userId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error('Failed to fetch favorites');
                const json = await res.json();
                // Response: { message, data: [ { id, user, event: { ... } } ] }
                const events = json.data.map((fav) => fav.event);
                setFavoriteEvents(events);
            } catch (err) {
                console.warn('Error fetching favorites:', err);
                setFavoriteEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    const getImageUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop';
        if (img.startsWith('http')) return img;
        return `${BACKEND_ORIGIN}${img}`;
    };

    // Helpers (same as EventPage)
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatPrice = (price) => {
        const num = Number(price);
        if (isNaN(num) || num === 0) return 'Free';
        return `Nu. ${num.toLocaleString()}`;
    };

    // Handle remove from favorites (optimistic update)
    const handleRemove = async (eventId, e) => {
        e.stopPropagation();
        // Remove from UI immediately for better UX
        setFavoriteEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        // Actually remove via API (through context)
        await toggleFavorite(eventId);
        // If the API call fails, you could refetch to restore consistency,
        // but we'll trust it succeeds (or you can handle errors separately)
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-10 font-inter">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-poppins font-semibold uppercase tracking-wide mb-2">
                            <Heart className="w-3.5 h-3.5 fill-rose-500" />
                            <span>Your Collection</span>
                        </div>
                        <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-[#1E352F] dark:text-[#E8F5F2]">
                            My Favorite Events
                        </h1>
                        <p className="text-[#475569] text-sm mt-1">
                            {favoriteEvents.length} event{favoriteEvents.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#6B21A8] border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm font-medium text-[#475569]">Loading your favorites...</p>
                        </div>
                    ) : favoriteEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteEvents.map((event, idx) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-white dark:bg-[#1C2B27] rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1"
                                >
                                    {/* Event Image */}
                                    <div>
                                        <div className="relative h-52 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-[#162019]">
                                            <img
                                                src={getImageUrl(event.event_image)}
                                                alt={event.event_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>                                            {/* Category Badge */}
                                            {(event.category_name || event.category) && (
                                                <span className="absolute top-3 left-3 bg-white dark:bg-[#1C2B27]/90 backdrop-blur-md text-[#1E352F] dark:text-[#E8F5F2] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm">
                                                    {event.category_name || event.category}
                                                </span>
                                            )}

                                            {/* Remove from favorites button */}
                                            <button
                                                onClick={(e) => handleRemove(event.id, e)}
                                                className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-rose-500 text-white shadow-md transition-all hover:bg-rose-600"
                                                aria-label="Remove from favorites"
                                            >
                                                <Heart className="w-4 h-4 fill-white" />
                                            </button>

                                            {/* Price Badge */}
                                            <span className="absolute bottom-3 right-3 bg-[#1E8B7A] text-white text-xs font-poppins font-bold px-3 py-1 rounded-full shadow-md">
                                                {formatPrice(event.event_price)}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <div className="p-5 space-y-3">
                                            <Link to={`/event/${event.id}`}>
                                                <h3 className="font-poppins font-bold text-lg text-[#1E352F] dark:text-[#E8F5F2] line-clamp-1 group-hover:text-[#29BBA3] transition-colors">
                                                    {event.event_name}
                                                </h3>
                                            </Link>

                                            <RatingBadge 
                                                averageRating={event.average_rating} 
                                                totalReviews={event.total_reviews} 
                                                distribution={event.rating_distribution} 
                                            />

                                            <p className="text-xs text-[#475569] font-inter line-clamp-2 leading-relaxed">
                                                {event.event_description ||
                                                    'Join us for this exciting cultural event in Bhutan.'}
                                            </p>

                                            <div className="space-y-1.5 pt-2 border-t border-[#FDFDF7] text-xs text-slate-600 dark:text-[#7AA49D] font-inter">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-[#29BBA3]" />
                                                    <span>{formatDate(event.event_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-[#1E8B7A] flex-shrink-0" />
                                                    <span className="truncate">
                                                        {event.event_location || 'Thimphu, Bhutan'}
                                                    </span>
                                                </div>
                                                {event.event_quantity !== undefined && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>{event.event_quantity} Seats Available</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-5 pt-0 flex gap-2">
                                        <Link
                                            to={`/event/${event.id}`}
                                            className="flex-1 py-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#2A3D38] text-[#1E352F] dark:text-[#E8F5F2] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] text-center font-poppins font-semibold text-xs transition-colors"
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            to={`/event/${event.id}`}
                                            className="flex-1 py-2.5 rounded-xl bg-[#1E8B7A] hover:bg-[#1E352F] text-white font-poppins font-semibold text-xs shadow-md shadow-teal-900/20 text-center transition-all flex items-center justify-center gap-1"
                                        >
                                            <Ticket className="w-3.5 h-3.5" />
                                            <span>Book Now</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="text-center py-20 bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] p-8 max-w-lg mx-auto shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-poppins font-bold text-xl text-[#1E352F] dark:text-[#E8F5F2] mb-2">
                                No Favorites Yet
                            </h3>
                            <p className="text-sm text-[#475569] font-inter mb-6">
                                Start hearting events you love – they’ll appear right here.
                            </p>
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E8B7A] hover:bg-[#1E352F] text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all"
                            >
                                <span>Explore Events</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default FavoritesPage;