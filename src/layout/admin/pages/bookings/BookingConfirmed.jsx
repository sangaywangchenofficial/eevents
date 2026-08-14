import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../AdminLayout'

const BookingConfirmed = () => {
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
        } catch { return userData === 'admin'; }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!isAdmin()) { navigate('/admin-login'); return; }
            const token = getAuthToken();
            if (!token) { navigate('/admin-login'); return; }

            const response = await fetch('http://localhost:8000/api/v1/booking/confirmed/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 401 || response.status === 403) { navigate('/admin-login'); return; }
            if (!response.ok) throw new Error(`Failed to load confirmed bookings (HTTP ${response.status})`);

            const responseData = await response.json();
            const bookingsData = Array.isArray(responseData.data) ? responseData.data
                : Array.isArray(responseData) ? responseData : [];

            setBookings(bookingsData.map(b => ({
                id: b.id,
                event_name: b.event_name || b.event?.event_name || 'N/A',
                quantity: b.quantity || 0,
                total_price: b.total_price || 0,
                booking_date: b.booking_date || b.booking_date_formatted,
                user_name: b.user_name || 'User'
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: 'N/A', time: 'N/A' };
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return { date: 'Invalid', time: 'Invalid' };
            return {
                date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            };
        } catch { return { date: 'N/A', time: 'N/A' }; }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">Confirmed Bookings</h1>
                    <button onClick={fetchBookings} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-stone-300 px-4 py-10 rounded text-center">
                        <p className="font-medium">No confirmed bookings found.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 dark:text-stone-400 mb-4">
                            Total: {bookings.length} confirmed booking{bookings.length > 1 ? 's' : ''}
                        </p>
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-100 dark:bg-zinc-700">
                                    <tr>
                                        {['ID', 'User', 'Event', 'Quantity', 'Total Price', 'Date', 'Time', 'Status'].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-stone-300 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                    {bookings.map((b) => {
                                        const { date, time } = formatDateTime(b.booking_date);
                                        return (
                                            <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">#{b.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">{b.user_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">{b.event_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">{b.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200 font-medium">${(b.total_price || 0).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">{date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-stone-200">{time}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-semibold rounded-full">
                                                        Confirmed
                                                    </span>
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

export default BookingConfirmed;
