import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, MapPin, Users, Calendar, ArrowRight,
    Sparkles, Building2, Mail, Phone, Globe,
    Star, Heart, Sliders, X, Award, Clock, MessageCircle
} from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import SEO from '../components/SEO';
import RatingBadge from '../components/RatingBadge';
import Pagination from '../components/Pagination';
import { useFavorites } from '../context/FavoritesContext';
import { API_BASE_URL, APP_URL, APP_NAME_CAPITALIZED } from '../utils/auth';

const OrganizersPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // --- Pagination state ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // --- Favorites from context ---
    const { isFavorite, toggleFavorite } = useFavorites();

    // --- Derived: locations ---
    const availableLocations = useMemo(() => {
        const locations = new Set();
        organizers.forEach(org => {
            if (org.organizer_location) locations.add(org.organizer_location);
        });
        return Array.from(locations);
    }, [organizers]);

    // --- Fetch organizers ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchQuery(query);

        if (query) {
            fetchSearchResults(query);
        } else {
            fetchAllOrganizers();
        }
    }, [location.search]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/organizer-search/?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            const organizersList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setOrganizers(organizersList);
        } catch (err) {
            console.warn("API error, setting empty organizers:", err);
            setOrganizers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrganizers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/view-organizers/`);
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();
            const organizersList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setOrganizers(organizersList);
        } catch (err) {
            console.warn("API error, setting empty organizers:", err);
            setOrganizers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/organizers?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/organizers');
        }
    };

    // --- Filtering logic ---
    const filteredOrganizers = useMemo(() => {
        let result = organizers;

        if (selectedLocation) {
            result = result.filter(org => org.organizer_location === selectedLocation);
        }

        return result;
    }, [organizers, selectedLocation]);

    // --- Pagination slice ---
    const paginatedOrganizers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredOrganizers.slice(start, end);
    }, [filteredOrganizers, currentPage, itemsPerPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedLocation, organizers]);

    // --- UI helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return 'New Member';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return 'O';
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const clearFilters = () => {
        setSelectedLocation('');
    };

    const isFilterActive = selectedLocation !== '';

    // --- Render ---
    return (
        <PublicLayout>
            <SEO
                title={selectedLocation ? `${selectedLocation} Event Organizers | ${APP_NAME_CAPITALIZED}` : `Event Organizers in Bhutan | ${APP_NAME_CAPITALIZED}`}
                description={`Discover and connect with verified ${selectedLocation || 'event organizers, festival planners, and cultural hosts'} across Bhutan on ${APP_NAME_CAPITALIZED}.`}
                canonical={`${APP_URL}/organizers`}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Organizers', item: '/organizers' },
                    ...(selectedLocation ? [{ name: selectedLocation, item: `/organizers?location=${selectedLocation}` }] : [])
                ]}
            />
            <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-10 font-inter">

                {/* Sticky Search Header Box */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="bg-white dark:bg-[#1C2B27] rounded-3xl p-6 sm:p-8 border border-[#E6E1D8] dark:border-[#2A3D38] shadow-xl shadow-teal-900/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F6] dark:bg-[#29BBA3]/10 text-[#29BBA3] text-xs font-poppins font-semibold uppercase tracking-wide mb-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Event Organizers</span>
                                </div>
                                <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-[#1E352F] dark:text-[#E8F5F2]">
                                    {searchQuery ? `Organizers Matching "${searchQuery}"` : 'Bhutan\'s Event Organizers'}
                                </h1>
                                <p className="text-[#4A5C57] dark:text-[#A8C4BE] text-sm mt-1">
                                    Connect with verified festival organizers, cultural hosts, and event planners across Bhutan.
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
                                            placeholder="Search by organizer name, location..."
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
                            <p className="mt-4 text-sm font-medium text-[#4A5C57] dark:text-[#A8C4BE]">Loading organizers...</p>
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
                                        Showing <span className="text-[#29BBA3] font-bold">{filteredOrganizers.length}</span> {filteredOrganizers.length === 1 ? 'organizer' : 'organizers'}
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
                                            {/* Location dropdown */}
                                            <div>
                                                <label htmlFor="location-select" className="block font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2] mb-2">
                                                    Location
                                                </label>
                                                <select
                                                    id="location-select"
                                                    value={selectedLocation}
                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-[#FDFDF7] dark:bg-[#0F1A17] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-xl text-sm text-[#1E352F] dark:text-[#E8F5F2] focus:outline-none focus:ring-2 focus:ring-[#29BBA3] transition-colors"
                                                >
                                                    <option value="" className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">All Locations</option>
                                                    {availableLocations.map(location => (
                                                        <option key={location} value={location} className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">{location}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Additional Filter: Sort By (optional) */}
                                            <div>
                                                <label htmlFor="sort-select" className="block font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2] mb-2">
                                                    Sort By
                                                </label>
                                                <select
                                                    id="sort-select"
                                                    className="w-full px-4 py-2.5 bg-[#FDFDF7] dark:bg-[#0F1A17] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-xl text-sm text-[#1E352F] dark:text-[#E8F5F2] focus:outline-none focus:ring-2 focus:ring-[#29BBA3] transition-colors"
                                                >
                                                    <option value="newest" className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">Newest First</option>
                                                    <option value="popular" className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">Most Popular</option>
                                                    <option value="name" className="bg-white dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2]">Alphabetical</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Organizer Cards Grid */}
                            {filteredOrganizers.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedOrganizers.map((organizer, idx) => {
                                            const isFav = isFavorite(organizer.id);
                                            return (
                                                <motion.div
                                                    key={organizer.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                    className="group bg-white dark:bg-[#1C2B27] rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-md hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
                                                >
                                                    {/* Organizer Header with Image/Avatar */}
                                                    <div>
                                                        <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#1E8B7A]/20 to-[#29BBA3]/10 dark:from-[#1E8B7A]/30 dark:to-[#29BBA3]/20">
                                                            {organizer.organizer_image ? (
                                                                <img
                                                                    src={organizer.organizer_image}
                                                                    alt={organizer.organizer_name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <div className="w-24 h-24 rounded-full bg-[#29BBA3]/20 dark:bg-[#29BBA3]/10 flex items-center justify-center text-4xl font-poppins font-bold text-[#1E8B7A] dark:text-[#29BBA3]">
                                                                        {getInitials(organizer.organizer_name)}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Gradient Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                                                            {/* Verified Badge */}
                                                            {organizer.is_verified && (
                                                                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-poppins font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                                                    <Award className="w-3 h-3" />
                                                                    Verified
                                                                </span>
                                                            )}

                                                            {/* Location Badge */}
                                                            {organizer.organizer_location && (
                                                                <span className="absolute top-3 right-3 bg-white/95 dark:bg-[#1C2B27]/90 backdrop-blur-md text-[#1E352F] dark:text-[#E8F5F2] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm border border-black/5 dark:border-white/10 flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3 text-[#29BBA3]" />
                                                                    {organizer.organizer_location}
                                                                </span>
                                                            )}

                                                            {/* Favorite Button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavorite(organizer.id);
                                                                }}
                                                                className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFav
                                                                    ? 'bg-rose-500 text-white shadow-md'
                                                                    : 'bg-white/90 dark:bg-[#1C2B27]/80 text-slate-700 dark:text-[#A8C4BE] hover:bg-white dark:hover:bg-[#1C2B27] hover:text-rose-500 border border-black/5 dark:border-white/10'
                                                                    }`}
                                                                aria-label="Toggle favorite"
                                                            >
                                                                <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                                                            </button>
                                                        </div>

                                                        {/* Organizer Body Content */}
                                                        <div className="p-5 space-y-3">
                                                            <Link to={`/organizer/${organizer.id}`}>
                                                                <h3 className="font-poppins font-bold text-lg text-[#1E352F] dark:text-[#E8F5F2] line-clamp-1 group-hover:text-[#29BBA3] transition-colors">
                                                                    {organizer.organizer_name}
                                                                </h3>
                                                            </Link>

                                                            {/* Rating Badge */}
                                                            {organizer.average_rating && (
                                                                <RatingBadge
                                                                    averageRating={organizer.average_rating}
                                                                    totalReviews={organizer.total_reviews}
                                                                    distribution={organizer.rating_distribution}
                                                                />
                                                            )}

                                                            {/* Description */}
                                                            <p className="text-xs text-[#4A5C57] dark:text-[#A8C4BE] font-inter line-clamp-2 leading-relaxed">
                                                                {organizer.organizer_description || 'Professional event organizer based in Bhutan.'}
                                                            </p>

                                                            {/* Contact & Stats */}
                                                            <div className="space-y-1.5 pt-2 border-t border-[#E6E1D8]/60 dark:border-[#2A3D38] text-xs text-[#4A5C57] dark:text-[#A8C4BE] font-inter">
                                                                {organizer.organizer_email && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Mail className="w-3.5 h-3.5 text-[#29BBA3] flex-shrink-0" />
                                                                        <span className="text-[#4A5C57] dark:text-[#A8C4BE] truncate">{organizer.organizer_email}</span>
                                                                    </div>
                                                                )}
                                                                {organizer.organizer_phone && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                        <span className="text-[#4A5C57] dark:text-[#A8C4BE]">{organizer.organizer_phone}</span>
                                                                    </div>
                                                                )}
                                                                {organizer.organizer_website && (
                                                                    <div className="flex items-center gap-2 truncate">
                                                                        <Globe className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                        <a
                                                                            href={organizer.organizer_website}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="truncate text-[#1E8B7A] dark:text-[#29BBA3] hover:underline"
                                                                        >
                                                                            {organizer.organizer_website.replace(/^https?:\/\//, '')}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {/* Stats: Events Count */}
                                                                {organizer.total_events !== undefined && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                        <span className="text-[#4A5C57] dark:text-[#A8C4BE]">{organizer.total_events} Events Organized</span>
                                                                    </div>
                                                                )}
                                                                {organizer.member_since && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-3.5 h-3.5 text-[#1E8B7A] dark:text-[#29BBA3] flex-shrink-0" />
                                                                        <span className="text-[#4A5C57] dark:text-[#A8C4BE]">Member since {formatDate(organizer.member_since)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Actions */}
                                                    <div className="p-5 pt-0 flex gap-2">
                                                        <Link
                                                            to={`/organizer/${organizer.id}`}
                                                            className="flex-1 py-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#2A3D38] text-[#1E352F] dark:text-[#E8F5F2] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] text-center font-poppins font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            <span>Profile</span>
                                                        </Link>
                                                        <Link
                                                            to={`/organizer/${organizer.id}`}
                                                            className="flex-1 py-2.5 rounded-xl bg-[#1E8B7A] hover:bg-[#1E352F] dark:bg-[#29BBA3] dark:hover:bg-[#1E8B7A] text-white font-poppins font-semibold text-xs shadow-md shadow-teal-900/20 text-center transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>Contact</span>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {filteredOrganizers.length > itemsPerPage && (
                                        <div className="mt-10 flex justify-center">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalCount={filteredOrganizers.length}
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
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-poppins font-bold text-xl text-[#1E352F] dark:text-[#E8F5F2] mb-2">No Organizers Found</h3>
                                    <p className="text-sm text-[#4A5C57] dark:text-[#A8C4BE] font-inter mb-6">
                                        {searchQuery ? `No organizers match "${searchQuery}"` : 'Try adjusting your filters or search terms.'}
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

export default OrganizersPage;