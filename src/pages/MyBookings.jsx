import { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, TicketIcon, ClockIcon, CurrencyDollarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { isAuthenticated, getUserId } from '../utils/auth';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const userId = getUserId();
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await api.get(`/my-bookings/${userId}/`);

                if (data.data) {
                    setMyBookings(data.data);
                } else {
                    setMyBookings(data);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching my bookings:', error);
                setError(error.message || 'Failed to load bookings');
                setLoading(false);
            }
        };

        if (userId) {
            fetchMyBookings();
        }
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const formatPrice = (price) => {
        if (!price) return '0.00';
        return parseFloat(price).toFixed(2);
    };

    const handleViewDetails = (bookingId) => {
        navigate(`/my-booking-details/${bookingId}`);
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.post(`/cancel-booking/${bookingId}/`);
                toast.success('Booking cancelled successfully');
                const data = await api.get(`/my-bookings/${userId}/`);
                setMyBookings(data.data || data);
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error(error.message || 'Failed to cancel booking');
            }
        }
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-600 font-medium">Loading your bookings...</p>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (error) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border-l-4 border-red-500">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 rounded-full p-3">
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Bookings</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="relative mb-12">
                        <div className="text-center">
                            <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                                <TicketIcon className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Your Bookings
                                </span>
                            </h1>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                                Manage all your event tickets and bookings in one place
                            </p>
                            <div className="mt-4 flex justify-center">
                                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {myBookings.length > 0 ? (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 backdrop-blur-sm bg-white/90">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                                        <p className="text-3xl font-bold text-blue-600 mt-1">{myBookings.length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 font-medium">Upcoming Events</p>
                                        <p className="text-3xl font-bold text-green-600 mt-1">
                                            {myBookings.filter(b => new Date(b.event?.event_date) > new Date()).length}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 font-medium">Past Events</p>
                                        <p className="text-3xl font-bold text-gray-600 mt-1">
                                            {myBookings.filter(b => new Date(b.event?.event_date) < new Date()).length}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                                        <p className="text-3xl font-bold text-purple-600 mt-1">
                                            ${formatPrice(myBookings.reduce((sum, b) => sum + (b.total_price || (b.event?.event_price * b.quantity)), 0))}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {myBookings.map((booking, index) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 backdrop-blur-sm bg-white/95"
                                    >
                                        <div className="md:flex">
                                            <div className="md:w-48 h-48 md:h-auto relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500">
                                                {booking.event?.event_image ? (
                                                    <img
                                                        src={booking.event.event_image}
                                                        alt={booking.event.event_name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <TicketIcon className="h-16 w-16 text-white/50" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${booking.is_booked
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-yellow-500 text-white'
                                                        }`}>
                                                        {booking.is_booked ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6">
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1">
                                                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                                            {booking.event?.event_name || 'Event Name Unavailable'}
                                                        </h2>

                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                            {booking.event?.event_description || 'No description available'}
                                                        </p>

                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <CalendarIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                                <span>{booking.event?.event_date ? formatDate(booking.event.event_date) : 'Date not set'}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <ClockIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                                <span>{booking.event?.event_time || 'Time not set'}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <MapPinIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                                <span>{booking.event?.event_location || 'Online Event'}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <TicketIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                                <span>{booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-sm text-gray-500 mb-3">
                                                            Booked on: {booking.booking_date_formatted || formatDate(booking.booking_date)}
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-gray-200 pt-4 mt-2">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                            <div className="flex items-baseline space-x-2">
                                                                <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                                                                <span className="text-2xl font-bold text-blue-600">
                                                                    ${formatPrice(booking.total_price || (booking.event?.event_price * booking.quantity))}
                                                                </span>
                                                                <span className="text-sm text-gray-500">total</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                                                <button
                                                                    onClick={() => handleViewDetails(booking.id)}
                                                                    className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                                >
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelBooking(booking.id)}
                                                                    className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-500 transition-all duration-200 text-sm font-medium"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-100">
                            <div className="flex justify-center mb-6">
                                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6">
                                    <TicketIcon className="h-20 w-20 text-blue-500" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Bookings Found</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                You haven't made any bookings yet. Explore our events and book your first ticket today!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/events')}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium inline-flex items-center justify-center"
                                >
                                    Browse Events
                                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default MyBookings;
