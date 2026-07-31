import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiSearch } from 'react-icons/hi';
import PublicLayout from '../publiclayout/PublicLayout';

const SearchPage = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get search query from URL
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

    // Fetch search results from API
    const fetchSearchResults = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/event-search/?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all events
    const fetchAllEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/view-events/');

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Format price in Bhutanese Ngultrum
    const formatPrice = (price) => {
        if (!price) return 'Free';
        return `Nu. ${parseFloat(price).toLocaleString()}`;
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-zinc-900">
                {/* Search Header */}
                <div className="bg-zinc-900 border-b border-stone-800 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <HiSearch className="text-purple-400" />
                                Search Results
                            </h1>
                            <form onSubmit={handleSearch} className="w-full sm:w-auto flex-1 max-w-xl">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search events in Thimphu..."
                                        className="w-full pl-10 pr-4 py-2 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading ? (
                        // Loading State
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    ) : error ? (
                        // Error State
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-semibold text-white mb-2">Something went wrong</h3>
                            <p className="text-stone-400">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Results Info */}
                            <div className="mb-6">
                                <p className="text-stone-400">
                                    {searchQuery ? (
                                        `Showing ${events.length} results for "${searchQuery}"`
                                    ) : (
                                        `Showing all ${events.length} events`
                                    )}
                                </p>
                            </div>

                            {/* Events Grid - Card Format */}
                            {events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group bg-zinc-800/50 border border-stone-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20 hover:scale-[1.02]"
                                        >
                                            {/* Event Image */}
                                            <Link to={`/event/${event.id}`} className="block">
                                                <div className="relative h-48 overflow-hidden">
                                                    {event.event_image ? (
                                                        <img
                                                            src={event.event_image}
                                                            alt={event.event_name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                                                            <span className="text-stone-400">No Image</span>
                                                        </div>
                                                    )}
                                                    {event.category && (
                                                        <div className="absolute top-3 right-3 bg-purple-600 px-3 py-1 rounded-full text-xs font-medium text-white">
                                                            {event.category_name || event.category}
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 to-transparent h-20"></div>
                                                </div>
                                            </Link>

                                            {/* Event Details */}
                                            <div className="p-5">
                                                <Link to={`/event/${event.id}`} className="block">
                                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                                                        {event.event_name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-stone-400 mb-3 line-clamp-2">
                                                    {event.event_description || 'No description available'}
                                                </p>

                                                {/* Event Meta Info */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-stone-400">
                                                        <HiCalendar className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                                                        <span>
                                                            {formatDate(event.event_date)} {event.event_time && `at ${event.event_time}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-stone-400">
                                                        <HiLocationMarker className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                                                        <span className="line-clamp-1">{event.event_location || 'Thimphu, Bhutan'}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-stone-400">
                                                        <HiUserGroup className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                                                        <span>{event.event_quantity || 0} attendees</span>
                                                    </div>
                                                </div>

                                                {/* Price and Actions */}
                                                <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between gap-2">
                                                    <span className="text-xl font-bold text-purple-400">
                                                        {formatPrice(event.event_price)}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/event/${event.id}`}
                                                            className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                                                        >
                                                            View Details
                                                        </Link>
                                                        <Link
                                                            to={`/booking/${event.id}`}
                                                            className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 ${event.is_event_available
                                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                                                                : 'bg-stone-600 cursor-not-allowed opacity-50'
                                                                }`}
                                                            onClick={(e) => {
                                                                if (!event.is_event_available) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            {event.is_event_available ? 'Book Now' : 'Completed'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // No Results State
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
                                    <p className="text-stone-400">
                                        {searchQuery ? (
                                            `We couldn't find any events matching "${searchQuery}". Try adjusting your search.`
                                        ) : (
                                            'No events available at the moment. Please check back later.'
                                        )}
                                    </p>
                                    <Link
                                        to="/"
                                        className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-200"
                                    >
                                        Browse All Events
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default SearchPage;