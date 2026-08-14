import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../AdminLayout'

const BookingNotConfirm = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('adminToken');
    };

    // Check if user is admin - handles both string and JSON
    const isAdmin = () => {
        const userData = localStorage.getItem('adminUser');
        if (!userData) return false;

        // Handle plain string case
        if (userData === 'admin' || userData === '"admin"') {
            return true;
        }

        // Try to parse as JSON
        try {
            const parsed = JSON.parse(userData);
            return parsed.is_staff === true || parsed.is_superuser === true || parsed.id !== null;
        } catch (e) {
            // If not JSON, check if it's just "admin"
            return userData === 'admin';
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            // Check if user is admin
            if (!isAdmin()) {
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminToken');
                navigate('/admin-login');
                throw new Error('Admin access required. Please login again.');
            }

            const token = getAuthToken();

            if (!token) {
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                navigate('/admin-login');
                throw new Error('Authentication token not found. Please login again.');
            }

            // Prepare headers with Bearer token
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            console.log('Fetching bookings with token:', token ? 'Token present' : 'No token');

            const response = await fetch('http://localhost:8000/api/v1/booking-not-confirmed/', {
                method: 'GET',
                headers: headers,
            });

            console.log('Response status:', response.status);

            if (response.status === 401 || response.status === 403) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminToken');
                navigate('/admin-login');
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.detail || errorMessage;
                } catch (e) {
                    // If response is not JSON
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);

            // Extract data from the nested response
            let bookingsData = [];
            if (responseData.data && Array.isArray(responseData.data)) {
                bookingsData = responseData.data;
            } else if (Array.isArray(responseData)) {
                bookingsData = responseData;
            } else {
                console.warn('Unexpected API response format:', responseData);
                setError('Unexpected data format received from server');
                setBookings([]);
                return;
            }

            // Transform data to ensure consistent field names
            const transformedBookings = bookingsData.map(booking => ({
                id: booking.id,
                event_name: booking.event_name || booking.event?.event_name || 'N/A',
                quantity: booking.quantity || 0,
                total_price: booking.total_price || 0,
                booking_date: booking.booking_date || booking.booking_date_formatted,
                is_booked: booking.is_booked || false,
                event: booking.event || null,
                user_id: booking.user_id,
                user_name: booking.user_name || 'User'
            }));

            setBookings(transformedBookings);

        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error.message || 'Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is admin
        if (!isAdmin()) {
            navigate('/admin-login');
            return;
        }
        fetchBookings();
    }, [navigate]);

    // Confirm booking
    const handleConfirm = async (bookingId) => {
        if (!window.confirm('Are you sure you want to confirm this booking?')) {
            return;
        }

        setActionLoading(bookingId);
        setError(null);
        setSuccessMessage(null);

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(`http://localhost:8000/api/v1/confirm-booking/${bookingId}/`, {
                method: 'POST',
                headers: headers,
            });

            const data = await response.json();

            if (response.ok) {
                // Update the booking status locally
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, is_booked: true }
                            : booking
                    )
                );
                setSuccessMessage('Booking confirmed successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                const errorMsg = data.message || data.detail || 'Failed to confirm booking';
                setError(errorMsg);
                setTimeout(() => setError(null), 5000);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            setError(error.message || 'Error confirming booking');
            setTimeout(() => setError(null), 5000);
        } finally {
            setActionLoading(null);
        }
    };

    // Cancel booking
    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setActionLoading(bookingId);
        setError(null);
        setSuccessMessage(null);

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(`http://localhost:8000/api/v1/cancel-booking/${bookingId}/`, {
                method: 'POST',
                headers: headers,
            });

            const data = await response.json();

            if (response.ok) {
                // Remove the booking from the list
                setBookings(prevBookings =>
                    prevBookings.filter(booking => booking.id !== bookingId)
                );
                setSuccessMessage('Booking cancelled successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                const errorMsg = data.message || data.detail || 'Failed to cancel booking';
                setError(errorMsg);
                setTimeout(() => setError(null), 5000);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError(error.message || 'Error cancelling booking');
            setTimeout(() => setError(null), 5000);
        } finally {
            setActionLoading(null);
        }
    };

    // Helper function to format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return { date: 'N/A', time: 'N/A' };
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return { date: 'Invalid Date', time: 'Invalid Time' };
            return {
                date: date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                time: date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (e) {
            return { date: 'N/A', time: 'N/A' };
        }
    };

    // Loading state
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading bookings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Booking Not Confirmed
                    </h1>
                    <button
                        onClick={fetchBookings}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{successMessage}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setSuccessMessage(null)}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError(null)}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-6 w-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">No unconfirmed bookings found.</p>
                        <p className="text-sm mt-1">All bookings have been confirmed.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            Total: {bookings.length} booking{bookings.length > 1 ? 's' : ''} found
                        </p>
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-100 dark:bg-zinc-700">
                                    <tr>
                                        {['ID', 'Event', 'Quantity', 'Total Price', 'Booking Date', 'Booking Time', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-stone-300 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                    {bookings.map((booking) => {
                                        const { date, time } = formatDateTime(booking.booking_date);
                                        const isProcessing = actionLoading === booking.id;

                                        return (
                                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                    #{booking.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                    {booking.event_name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                    {booking.quantity || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200 font-medium">
                                                    ${(booking.total_price || 0).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                    {date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                    {time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.is_booked
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                        }`}>
                                                        {booking.is_booked ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {!booking.is_booked && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                className={`text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={() => handleConfirm(booking.id)}
                                                                disabled={isProcessing}
                                                            >
                                                                {isProcessing ? 'Processing...' : 'Confirm'}
                                                            </button>
                                                            <button
                                                                className={`text-red-600 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={() => handleCancel(booking.id)}
                                                                disabled={isProcessing}
                                                            >
                                                                {isProcessing ? 'Processing...' : 'Cancel'}
                                                            </button>
                                                        </div>
                                                    )}
                                                    {booking.is_booked && (
                                                        <span className="text-gray-400 dark:text-stone-500 text-xs">Already confirmed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default BookingNotConfirm;