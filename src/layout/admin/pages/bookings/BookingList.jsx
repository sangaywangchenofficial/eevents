import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../AdminLayout'

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAuthToken = () =>
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('adminToken');

    const isAdmin = () => {
        const userData = localStorage.getItem('adminUser');
        if (!userData) return false;
        if (userData === 'admin' || userData === '"admin"') return true;
        try {
            const parsed = JSON.parse(userData);
            return parsed.is_staff === true || parsed.is_superuser === true || parsed.id !== null;
        } catch (e) {
            return userData === 'admin';
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isAdmin()) {
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                navigate('/admin-login');
                return;
            }

            const token = getAuthToken();
            if (!token) { navigate('/admin-login'); return; }

            const response = await fetch('http://localhost:8000/api/v1/booking/list/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 401 || response.status === 403) {
                navigate('/admin-login');
                return;
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const responseData = await response.json();
            const bookingsData = Array.isArray(responseData.data) ? responseData.data
                : Array.isArray(responseData) ? responseData : [];

            setBookings(bookingsData.map(b => ({
                id: b.id,
                event_name: b.event_name || b.event?.event_name || 'N/A',
                quantity: b.quantity || 0,
                total_price: b.total_price || 0,
                booking_date: b.booking_date || b.booking_date_formatted,
                is_booked: b.is_booked || false,
<<<<<<< HEAD
                user_name: b.user_name || 'User'
=======
                user_name: b.user_name || 'User',
                // Additional fields for detailed view
                event_id: b.event_id || b.event?.id,
                user_id: b.user_id || b.user?.id,
                user_email: b.user_email || b.user?.email || 'N/A',
                user_phone: b.user_phone || b.user?.phone || 'N/A',
                event_date: b.event_date || b.event?.event_date || 'N/A',
                event_location: b.event_location || b.event?.location || 'N/A',
                event_description: b.event_description || b.event?.description || 'N/A',
                booking_reference: b.booking_reference || b.reference || `BK-${b.id}`,
                payment_status: b.payment_status || 'N/A',
                payment_method: b.payment_method || 'N/A'
>>>>>>> feature/homepage
            })));
        } catch (err) {
            setError(err.message || 'Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin()) { navigate('/admin-login'); return; }
        fetchBookings();
    }, [navigate]);

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: 'N/A', time: 'N/A' };
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return { date: 'Invalid Date', time: 'Invalid Time' };
            return {
                date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
        } catch { return { date: 'N/A', time: 'N/A' }; }
    };

<<<<<<< HEAD
=======
    const handleViewDetails = (bookingId) => {
        // Navigate to the booking details page with the booking ID
        navigate(`/admin/bookings/${bookingId}`);
    };

>>>>>>> feature/homepage
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 dark:text-stone-400 mt-4">Loading bookings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-stone-100">
                        All Bookings
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

                {error && (
                    <div className="mb-4 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
                        <span>{error}</span>
                        <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-stone-300 px-4 py-10 rounded text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">No bookings found.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 dark:text-stone-400 mb-4">
                            Total: {bookings.length} booking{bookings.length > 1 ? 's' : ''} found
                        </p>
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-100 dark:bg-zinc-700">
                                    <tr>
<<<<<<< HEAD
                                        {['ID', 'User', 'Event', 'Quantity', 'Total Price', 'Booking Date', 'Time', 'Status'].map(h => (
=======
                                        {['ID', 'User', 'Event', 'Quantity', 'Total Price', 'Booking Date', 'Time', 'Status', 'Actions'].map(h => (
>>>>>>> feature/homepage
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-stone-300 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                    {bookings.map((booking) => {
                                        const { date, time } = formatDateTime(booking.booking_date);
                                        return (
                                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">#{booking.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">{booking.user_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">{booking.event_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">{booking.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200 font-medium">${(booking.total_price || 0).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">{date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">{time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.is_booked
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                                        {booking.is_booked ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </td>
<<<<<<< HEAD
=======
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleViewDetails(booking.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View Details
                                                    </button>
                                                </td>
>>>>>>> feature/homepage
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

<<<<<<< HEAD
export default BookingList;
=======
export default BookingList;
>>>>>>> feature/homepage
