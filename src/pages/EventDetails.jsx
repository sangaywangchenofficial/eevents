import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    HiCalendar,
    HiLocationMarker,
    HiUserGroup,
    HiArrowLeft,
    HiTag,
    HiTicket,
    HiCheckCircle,
    HiXCircle
} from 'react-icons/hi';
import PublicLayout from '../publiclayout/PublicLayout';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchEventDetail();
    }, [id]);

    const fetchEventDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/event-detail/${id}/`);

            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }

            const data = await response.json();
            setEvent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= event?.event_quantity) {
            setQuantity(value);
        }
    };

    const handleBookNow = () => {
        // Navigate to booking page with event details
        navigate(`/booking/${id}`, { state: { event, quantity } });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatPrice = (price) => {
        if (!price) return 'Free';
        return `Nu. ${parseFloat(price).toLocaleString()}`;
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
                </div>
            </PublicLayout>
        );
    }

    if (error || !event) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">Event Not Found</h3>
                        <p className="text-stone-400">{error || 'The event you are looking for does not exist.'}</p>
                        <Link
                            to="/"
                            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-200"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-zinc-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-stone-400 hover:text-white transition-colors duration-200 mb-6 group"
                    >
                        <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>

                    {/* Event Details Card */}
                    <div className="bg-zinc-800/50 border border-stone-800 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Image */}
                            <div className="relative h-64 lg:h-full min-h-[400px]">
                                {event.event_image ? (
                                    <img
                                        src={event.event_image}
                                        alt={event.event_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                                        <span className="text-stone-400 text-lg">No Image Available</span>
                                    </div>
                                )}
                                {event.category && (
                                    <div className="absolute top-4 left-4 bg-purple-600 px-4 py-2 rounded-full text-sm font-medium text-white">
                                        {event.category_name || event.category}
                                    </div>
                                )}
                                {event.is_event_available ? (
                                    <div className="absolute top-4 right-4 bg-emerald-500 px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-1">
                                        <HiCheckCircle className="w-4 h-4" />
                                        <span>Available</span>
                                    </div>
                                ) : (
                                    <div className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-1">
                                        <HiXCircle className="w-4 h-4" />
                                        <span>Completed</span>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Details */}
                            <div className="p-6 lg:p-8">
                                <h1 className="text-3xl font-bold text-white mb-4">
                                    {event.event_name}
                                </h1>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start space-x-3 text-stone-300">
                                        <HiCalendar className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{formatDate(event.event_date)}</p>
                                            {event.event_time && (
                                                <p className="text-sm text-stone-400">{event.event_time}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 text-stone-300">
                                        <HiLocationMarker className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                        <p>{event.event_location || 'Thimphu, Bhutan'}</p>
                                    </div>

                                    <div className="flex items-start space-x-3 text-stone-300">
                                        <HiUserGroup className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                        <p>{event.event_quantity || 0} tickets available</p>
                                    </div>

                                    <div className="flex items-start space-x-3 text-stone-300">
                                        <HiTag className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                        <p className="text-2xl font-bold text-purple-400">
                                            {formatPrice(event.event_price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="border-t border-stone-800 pt-6 mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-3">About this event</h3>
                                    <p className="text-stone-300 leading-relaxed">
                                        {event.event_description || 'No description available for this event.'}
                                    </p>
                                </div>

                                {/* Booking Section */}
                                <div className="border-t border-stone-800 pt-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Book Your Tickets</h3>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="flex items-center space-x-3">
                                            <label className="text-stone-300 font-medium">Quantity:</label>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        if (quantity > 1) {
                                                            setQuantity(quantity - 1);
                                                        }
                                                    }}
                                                    className="w-10 h-10 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-lg font-bold transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={event.event_quantity || 1}
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    className="w-16 text-center py-2 bg-stone-950/40 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (quantity < (event.event_quantity || 1)) {
                                                            setQuantity(quantity + 1);
                                                        }
                                                    }}
                                                    className="w-10 h-10 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-lg font-bold transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                                            <div className="text-stone-300">
                                                <span className="text-sm">Total:</span>
                                                <span className="text-xl font-bold text-purple-400 ml-2">
                                                    {formatPrice(event.event_price * quantity)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={handleBookNow}
                                                disabled={!event.is_event_available || event.event_quantity === 0}
                                                className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-950/40 flex items-center justify-center space-x-2 ${(!event.is_event_available || event.event_quantity === 0) && 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <HiTicket className="w-5 h-5" />
                                                <span>
                                                    {!event.is_event_available || event.event_quantity === 0
                                                        ? 'Sold Out'
                                                        : 'Book Now'
                                                    }
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Events Section (Optional) */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-white mb-6">You might also like</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* You can add related events here */}
                            <p className="text-stone-400 col-span-3 text-center py-8">
                                More events coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default EventDetail;