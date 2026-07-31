import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaTicketAlt,
    FaBookmark,
    FaRegBookmark
} from 'react-icons/fa';

const FeaturedEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookedEvents, setBookedEvents] = useState(new Set());

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/random-events/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleBookEvent = (eventId) => {
        setBookedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">Loading amazing events...</p>
                    <div className="mt-2 flex justify-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 px-4 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-lg">
                    <div className="text-5xl mb-4">😅</div>
                    <p className="text-red-600 font-medium mb-4">Oops! Something went wrong</p>
                    <p className="text-gray-600 text-sm mb-6">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Featured Events
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg flex items-center justify-center md:justify-start gap-2">
                                <span className="inline-block w-8 h-0.5 bg-blue-500"></span>
                                Discover exciting events happening around you
                                <span className="inline-block w-8 h-0.5 bg-blue-500"></span>
                            </p>
                        </div>
                        {events.length > 0 && (
                            <div className="mt-4 md:mt-0">
                                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                    <FaTicketAlt />
                                    {events.length} Events Available
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🎪</div>
                        <p className="text-gray-500 text-lg">No featured events available at the moment.</p>
                        <p className="text-gray-400 text-sm mt-2">Check back later for exciting events!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100"
                                >
                                    {/* Card Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        {event.event_image ? (
                                            <img
                                                src={event.event_image}
                                                alt={event.event_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                                                <span className="text-6xl animate-pulse">🎉</span>
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Featured Badge */}
                                        {event.isFeatured && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                <FaStar className="text-white" />
                                                Featured
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        {event.category_name && (
                                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                                                {event.category_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {event.event_name}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                                            {event.event_description || 'No description available'}
                                        </p>

                                        {/* Event Details */}
                                        <div className="space-y-2.5 border-t border-gray-100 pt-3 mb-4">
                                            {event.event_location && (
                                                <div className="flex items-center text-sm text-gray-700 group/item hover:text-blue-600 transition-colors">
                                                    <FaMapMarkerAlt className="mr-2.5 text-blue-500 text-xs flex-shrink-0" />
                                                    <span className="truncate">{event.event_location}</span>
                                                </div>
                                            )}

                                            {event.event_date && (
                                                <div className="flex items-center text-sm text-gray-700 group/item hover:text-blue-600 transition-colors">
                                                    <FaCalendarAlt className="mr-2.5 text-purple-500 text-xs flex-shrink-0" />
                                                    <span>
                                                        {new Date(event.event_date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {event.event_price !== undefined && event.event_price !== null && (
                                                <div className="flex items-center text-sm">
                                                    <FaMoneyBillWave className="mr-2.5 text-green-500 text-xs flex-shrink-0" />
                                                    <span className={Number(event.event_price) === 0 ? 'text-green-600 font-bold' : 'text-gray-700 font-medium'}>
                                                        {Number(event.event_price) === 0 ? '🎫 Free' : `$${event.event_price}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Actions */}
                                        <div className="flex gap-2 mt-auto">
                                            <Link
                                                to={`/events/${event.id}`}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                View Details →
                                            </Link>
                                            <button
                                                onClick={() => handleBookEvent(event.id)}
                                                className={`px-4 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${bookedEvents.has(event.id)
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                                    }`}
                                            >
                                                {bookedEvents.has(event.id) ? (
                                                    <>
                                                        <FaBookmark className="text-xs" />
                                                        Booked
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRegBookmark className="text-xs" />
                                                        Book
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="mt-12 text-center">
                            <Link
                                to="/events"
                                className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-xl hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-medium shadow-sm hover:shadow-lg group"
                            >
                                <span>View All Events</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {events.length}+
                                </span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <div className="h-8"></div>
        </div>
    );
};

export default FeaturedEvents;