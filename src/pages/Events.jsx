import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, Calendar, MapPin, Users, Ticket, ArrowRight,
    Sparkles, Heart, Sliders, X, Star
} from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PublicLayout from '../publiclayout/PublicLayout';
import SEO from '../components/SEO';
import RatingBadge from '../components/RatingBadge';
import Pagination from '../components/Pagination';
import { useFavorites } from '../context/FavoritesContext'; // ✅ Import favorites hook
import { API_BASE_URL, APP_URL, APP_NAME_CAPITALIZED } from '../utils/auth';

const EventPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);

    // --- Pagination state ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // adjust as needed

    // --- Favorites from context ---
    const { isFavorite, toggleFavorite } = useFavorites();

    // --- Derived: categories & price bounds ---
    const availableCategories = useMemo(() => {
        const cats = new Set();
        events.forEach(ev => {
            const cat = ev.category_name || ev.category;
            if (cat) cats.add(cat);
        });
        return Array.from(cats);
    }, [events]);

    const priceBounds = useMemo(() => {
        let min = Infinity, max = -Infinity;
        events.forEach(ev => {
            const price = Number(ev.event_price);
            if (!isNaN(price)) {
                if (price < min) min = price;
                if (price > max) max = price;
            }
        });
        if (min === Infinity) min = 0;
        if (max === -Infinity) max = 10000;
        return { min, max };
    }, [events]);

    // Update slider range when events change
    useEffect(() => {
        if (priceBounds.min !== undefined && priceBounds.max !== undefined) {
            setPriceRange([priceBounds.min, priceBounds.max]);
        }
    }, [priceBounds]);

    // --- Fetch events (search or all) ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchQuery(query);

        if (query) {
            fetchSearchResults(query);
        } else {
            fetchAllEvents();
        }
    }, [location.search]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/event-search/?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            const eventsList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setEvents(eventsList);
        } catch (err) {
            console.warn("API error, setting empty events:", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/view-events/`);
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();
            const eventsList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setEvents(eventsList);
        } catch (err) {
            console.warn("API error, setting empty events:", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/search');
        }
    };

    // --- Filtering logic ---
    const filteredEvents = useMemo(() => {
        let result = events;

        if (selectedCategory) {
            result = result.filter(ev => {
                const cat = ev.category_name || ev.category;
                return cat === selectedCategory;
            });
        }

        result = result.filter(ev => {
            const price = Number(ev.event_price);
            if (isNaN(price)) return true;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        return result;
    }, [events, selectedCategory, priceRange]);

    // --- Pagination slice ---
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredEvents.slice(start, end);
    }, [filteredEvents, currentPage, itemsPerPage]);

    // Reset page when filters or events change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, events]);

    // --- UI helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        const num = Number(price);
        if (isNaN(num) || num === 0) return 'Free';
        return `Nu. ${num.toLocaleString()}`;
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setPriceRange([priceBounds.min, priceBounds.max]);
    };

    const isFilterActive = selectedCategory !== '' ||
        priceRange[0] > priceBounds.min ||
        priceRange[1] < priceBounds.max;

    // --- Render ---
    return (
        <PublicLayout>
            <SEO
                title={selectedCategory ? `${selectedCategory} Events | ${APP_NAME_CAPITALIZED}` : `Explore Events in Bhutan | ${APP_NAME_CAPITALIZED}`}
                description={`Discover and book verified tickets for upcoming ${selectedCategory || 'cultural festivals, music concerts, workshops, and sports'} events across Bhutan on ${APP_NAME_CAPITALIZED}.`}
                canonical={`${APP_URL}/events`}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Events', item: '/events' },
                    ...(selectedCategory ? [{ name: selectedCategory, item: `/events?category=${selectedCategory}` }] : [])
                ]}
            />
            <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-10 font-inter">

                {/* Sticky Search Header Box */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="bg-white dark:bg-[#1C2B27] rounded-3xl p-6 sm:p-8 border border-[#E6E1D8] dark:border-[#2A3D38] shadow-xl shadow-teal-900/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F6] dark:bg-[#29BBA3]/10 text-[#29BBA3] text-xs font-poppins font-semibold uppercase tracking-wide mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Discover Events</span>
                                </div>
                                <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-[#1E352F] dark:text-[#E8F5F2]">
                                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore All Events in Bhutan'}
                                </h1>
                                <p className="text-[#4A5C57] dark:text-[#A8C4BE] text-sm mt-1">
                                    Find verified festival passes, cultural workshops, and community events across Bhutan.
                                </p>
                            </div>

                            {/* Search Bar Input */}
                            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 max-w-lg">
                                <div className="glass-card p-2 rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38] bg-slate-50/50 dark:bg-[#162019]/60 flex items-center gap-2">
                                    <div className="relative flex-1 flex items-center pl-3">
                                        <Search className="w-5 h-5 text-[#29BBA3] mr-2 flex-shrink-0" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by event, location, dzongkhag..."
                                            className="w-full py-2 bg-transparent text-[#1E352F] dark:text-[#E8F5F2] placeholder-slate-400 dark:placeholder-[#7AA49D] focus:outline-none text-sm font-inter"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-[#1E8B7A] hover:bg-[#1E352F] dark:hover:bg-[#29BBA3] text-white font-poppins font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                                    >
                                        <span>Search</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm font-medium text-[#4A5C57] dark:text-[#A8C4BE]">Searching Bhutanese events...</p>
                        </div>
                    ) : (
                        <>
                            {/* --- Filter Section --- */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1C2B27] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-xl text-sm font-poppins font-semibold text-[#1E352F] dark:text-[#E8F5F2] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] transition-colors"
                                        >
                                            <Sliders className="w-4 h-4" />
                                            <span>Filters</span>
                                            {isFilterActive && (
                                                <span className="ml-1 px-2 py-0.5 bg-[#29BBA3] text-white text-[10px] rounded-full">Active</span>
                                            )}
                                        </button>
                                        {isFilterActive && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-xs text-[#66756F] dark:text-[#A8C4BE] hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] flex items-center gap-1 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm font-poppins font-semibold text-[#1E352F] dark:text-[#E8F5F2]">
                                        Showing <span className="text-[#29BBA3] font-bold">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
                                    </p>
                                </div>

                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 p-6 bg-white dark:bg-[#1C2B27] rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-sm"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Category dropdown */}
                                            <div>
                                                <label htmlFor="category-select" className="block font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2] mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    id="category-select"
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-[#FDFDF7] dark:bg-[#0F1A17] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-xl text-sm text-[#1E352F] dark:text-[#E8F5F2] focus:outline-none focus:ring-2 focus:ring-[#29BBA3] transition-colors"
                                                >
                                                    <option value="" className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">All Categories</option>
                                                    {availableCategories.map(cat => (
                                                        <option key={cat} value={cat} className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Price range slider */}
                                            <div>
                                                <h4 className="font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2] mb-3">
                                                    Price Range: Nu. {priceRange[0].toLocaleString()} – Nu. {priceRange[1].toLocaleString()}
                                                </h4>
                                                <div className="px-2">
                                                    <Slider
                                                        range
                                                        min={priceBounds.min}
                                                        max={priceBounds.max}
                                                        value={priceRange}
                                                        onChange={(val) => setPriceRange(val)}
                                                        trackStyle={[{ backgroundColor: '#29BBA3' }]}
                                                        handleStyle={[
                                                            { borderColor: '#29BBA3', backgroundColor: '#29BBA3' },
                                                            { borderColor: '#29BBA3', backgroundColor: '#29BBA3' }
                                                        ]}
                                                        railStyle={{ backgroundColor: 'var(--color-border, #E6E1D8)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Event Cards Grid using paginatedEvents */}
                            {filteredEvents.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedEvents.map((event, idx) => {
                                            const isFav = isFavorite(event.id); // ✅ from context
                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                    className="group bg-white dark:bg-[#1C2B27] rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-md hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
                                                >
                                                    {/* Event Image */}
                                                    <div>
                                                        <div className="relative h-52 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-[#162019]">
                                                            <img
                                                                src={event.event_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'}
                                                                alt={event.event_name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                                                            {/* Category Badge */}
                                                            {(event.category_name || event.category) && (
                                                                <span className="absolute top-3 left-3 bg-white/95 dark:bg-[#1C2B27]/90 backdrop-blur-md text-[#1E352F] dark:text-[#E8F5F2] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm border border-black/5 dark:border-white/10">
                                                                    {event.category_name || event.category}
                                                                </span>
                                                            )}

                                                            {/* Favorite Button - uses context toggle */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavorite(event.id); // ✅ from context
                                                                }}
                                                                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFav
                                                                    ? 'bg-rose-500 text-white shadow-md'
                                                                    : 'bg-white/90 dark:bg-[#1C2B27]/80 text-slate-700 dark:text-[#A8C4BE] hover:bg-white dark:hover:bg-[#1C2B27] hover:text-rose-500 border border-black/5 dark:border-white/10'
                                                                    }`}
                                                                aria-label="Toggle favorite"
                                                            >
                                                                <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                                                            </button>

                                                            {/* Price Badge */}
                                                            <span className="absolute bottom-3 right-3 bg-[#1E8B7A] text-white text-xs font-poppins font-bold px-3 py-1 rounded-full shadow-md">
                                                                {formatPrice(event.event_price)}
                                                            </span>
                                                        </div>

                                                        {/* Event Body Content */}
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

                                                            <p className="text-xs text-[#4A5C57] dark:text-[#A8C4BE] font-inter line-clamp-2 leading-relaxed">
                                                                {event.event_description || 'Join us for this exciting cultural event in Bhutan.'}
                                                            </p>

                                                            <div className="space-y-1.5 pt-2 border-t border-[#E6E1D8]/60 dark:border-[#2A3D38] text-xs text-[#4A5C57] dark:text-[#A8C4BE] font-inter">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-3.5 h-3.5 text-[#29BBA3] flex-shrink-0" />
                                                                    <span className="text-[#4A5C57] dark:text-[#A8C4BE]">{formatDate(event.event_date)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <MapPin className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                    <span className="truncate text-[#4A5C57] dark:text-[#A8C4BE]">{event.event_location || 'Thimphu, Bhutan'}</span>
                                                                </div>
                                                                {event.event_quantity !== undefined && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Users className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                        <span className="text-[#4A5C57] dark:text-[#A8C4BE]">{event.event_quantity} Seats Available</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Actions */}
                                                    <div className="p-5 pt-0 flex gap-2">
                                                        <Link
                                                            to={`/event/${event.id}`}
                                                            className="flex-1 py-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#2A3D38] text-[#1E352F] dark:text-[#E8F5F2] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] text-center font-poppins font-semibold text-xs transition-colors"
                                                        >
                                                            Details
                                                        </Link>
                                                        <Link
                                                            to={`/event/${event.id}`}
                                                            className="flex-1 py-2.5 rounded-xl bg-[#1E8B7A] hover:bg-[#1E352F] dark:bg-[#29BBA3] dark:hover:bg-[#1E8B7A] text-white font-poppins font-semibold text-xs shadow-md shadow-teal-900/20 text-center transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <Ticket className="w-3.5 h-3.5" />
                                                            <span>Book Now</span>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {filteredEvents.length > itemsPerPage && (
                                        <div className="mt-10 flex justify-center">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalCount={filteredEvents.length}
                                                pageSize={itemsPerPage}
                                                onPageChange={(page) => setCurrentPage(page)}
                                                siblingCount={1}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Empty State */
                                <div className="text-center py-20 bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] p-8 max-w-lg mx-auto shadow-sm">
                                    <div className="w-16 h-16 rounded-full bg-[#E6F9F6] dark:bg-[#29BBA3]/10 text-[#29BBA3] flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-poppins font-bold text-xl text-[#1E352F] dark:text-[#E8F5F2] mb-2">No Events Found</h3>
                                    <p className="text-sm text-[#4A5C57] dark:text-[#A8C4BE] font-inter mb-6">
                                        Try adjusting your filters or search terms.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-[#1E8B7A] hover:bg-[#1E352F] dark:bg-[#29BBA3] dark:hover:bg-[#1E8B7A] text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default EventPage;