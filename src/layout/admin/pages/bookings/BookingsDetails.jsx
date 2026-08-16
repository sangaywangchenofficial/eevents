import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';

const BookingsDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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

    const fetchBookingDetails = async () => {
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

            const response = await fetch(`http://localhost:8000/api/v1/booking-details/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401 || response.status === 403) {
                navigate('/admin-login');
                return;
            }
            if (response.status === 404) {
                navigate('/admin/bookings');
                return;
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const responseData = await response.json();
            const b = responseData.data || responseData;

            setBooking({
                id: b.id,
                event_name: b.event_name || b.event?.event_name || 'N/A',
                quantity: b.quantity || 0,
                total_price: b.total_price || 0,
                booking_date: b.booking_date || b.booking_date_formatted,
                is_booked: b.is_booked || false,
                status: b.status || (b.is_booked ? 'confirmed' : 'pending'),
                user_name: b.user_name || 'User',
                event_id: b.event_id || b.event?.id,
                user_id: b.user_id || b.user?.id,
                user_email: b.user_email || b.user?.email || 'N/A',
                user_phone: b.user_phone || b.user?.phone || 'N/A',
                event_date: b.event_date || b.event?.event_date || 'N/A',
                event_location: b.event_location || b.event?.location || 'N/A',
                event_description: b.event_description || b.event?.description || 'N/A',
                booking_reference: b.booking_reference || b.reference || `BK-${b.id}`,
                payment_status: b.payment_status || 'N/A',
                payment_method: b.payment_method || 'N/A',
                created_at: b.created_at || b.booking_date,
                updated_at: b.updated_at || b.booking_date
            });

            // Fetch status history
            await fetchStatusHistory(token);
        } catch (err) {
            setError(err.message || 'Failed to load booking details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusHistory = async (token) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/booking-status-history/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                const historyData = data.data || data;
                setStatusHistory(Array.isArray(historyData) ? historyData : []);
            }
        } catch (err) {
            console.error('Failed to fetch status history:', err);
            setStatusHistory([]);
        }
    };

    const updateBookingStatus = async () => {
        if (!selectedStatus) {
            setError('Please select a status');
            return;
        }

        try {
            setUpdatingStatus(true);
            setError(null);

            const token = getAuthToken();
            if (!token) { navigate('/admin-login'); return; }

            const response = await fetch(`http://localhost:8000/api/v1/booking-update-status/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: selectedStatus,
                    note: statusNote || 'Status updated by admin'
                }),
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
            const updatedBooking = responseData.data || responseData;

            // Determine is_booked based on status
            const bookedStatuses = ['confirmed', 'completed'];
            const newIsBooked = typeof updatedBooking.is_booked === 'boolean'
                ? updatedBooking.is_booked
                : bookedStatuses.includes(selectedStatus.toLowerCase());

            // Update booking state with new status immediately
            setBooking(prev => ({
                ...prev,
                status: updatedBooking.status || selectedStatus,
                is_booked: newIsBooked,
                updated_at: updatedBooking.updated_at || new Date().toISOString()
            }));

            // Refresh status history
            await fetchStatusHistory(token);

            setShowStatusModal(false);
            setSelectedStatus('');
            setStatusNote('');

            // Show inline success toast
            setSuccessMessage(`Status updated to "${selectedStatus}" successfully!`);
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            setError(err.message || 'Failed to update booking status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        if (!isAdmin()) { navigate('/admin-login'); return; }
        fetchBookingDetails();
    }, [id, navigate]);

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

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'not-confirmed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
            'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
        };
        return statusMap[status?.toLowerCase()] || statusMap.pending;
    };

    const getStatusLabel = (status) => {
        const labelMap = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'not-confirmed': 'Not Confirmed',
            'cancelled': 'Cancelled',
            'completed': 'Completed'
        };
        return labelMap[status?.toLowerCase()] || status || 'Pending';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 dark:text-stone-400 mt-4">Loading booking details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="p-4">
                    <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
                        <span>{error}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError(null)}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!booking) {
        return (
            <AdminLayout>
                <div className="p-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
                        Booking not found.
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const { date, time } = formatDateTime(booking.booking_date);
    const createdDate = formatDateTime(booking.created_at);

    return (
        <AdminLayout>
            <div className="p-4 max-w-7xl mx-auto">
                {/* Success Toast */}
                {successMessage && (
                    <div className="mb-4 bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded flex items-center justify-between">
                        <span>✅ {successMessage}</span>
                        <button onClick={() => setSuccessMessage('')} className="ml-4 text-green-700 dark:text-green-300 hover:opacity-70">✕</button>
                    </div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/admin/bookings')}
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mb-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Bookings
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-stone-100">
                            Booking Details
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                        </span>
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update Status
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Booking Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-700 border-b border-gray-200 dark:border-zinc-600">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-stone-100">
                                    Booking #{booking.id}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-stone-400">
                                    Reference: {booking.booking_reference}
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* User Information */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-stone-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-700 pb-2">
                                            User Information
                                        </h3>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Name</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200 font-medium">{booking.user_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Email</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200">{booking.user_email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Phone</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200">{booking.user_phone}</p>
                                        </div>
                                    </div>

                                    {/* Event Information */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-stone-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-700 pb-2">
                                            Event Information
                                        </h3>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Event Name</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200 font-medium">{booking.event_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Date</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200">{booking.event_date}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Location</label>
                                            <p className="text-sm text-gray-900 dark:text-stone-200">{booking.event_location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Quantity</label>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-stone-200">{booking.quantity}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Total Price</label>
                                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">${(booking.total_price || 0).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Booking Date</label>
                                        <p className="text-sm text-gray-900 dark:text-stone-200">{date}</p>
                                        <p className="text-xs text-gray-500 dark:text-stone-400">{time}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Payment Status</label>
                                        <p className="text-sm text-gray-900 dark:text-stone-200">{booking.payment_status}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Payment Method</label>
                                        <p className="text-sm text-gray-900 dark:text-stone-200">{booking.payment_method}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Created At</label>
                                        <p className="text-sm text-gray-900 dark:text-stone-200">{createdDate.date}</p>
                                        <p className="text-xs text-gray-500 dark:text-stone-400">{createdDate.time}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-stone-400">Last Updated</label>
                                        <p className="text-sm text-gray-900 dark:text-stone-200">{formatDateTime(booking.updated_at).date}</p>
                                        <p className="text-xs text-gray-500 dark:text-stone-400">{formatDateTime(booking.updated_at).time}</p>
                                    </div>
                                </div>

                                {booking.event_description && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                                            Event Description
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-stone-300">{booking.event_description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status History Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden sticky top-4">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-700 border-b border-gray-200 dark:border-zinc-600">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-stone-100 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tracking History
                                </h3>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {statusHistory.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500 dark:text-stone-400">No status history available</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-zinc-600"></div>

                                        {statusHistory.map((item, index) => (
                                            <div key={index} className="relative pl-10 pb-6 last:pb-0">
                                                {/* Timeline dot */}
                                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${getStatusBadgeClass(item.status)}`}>
                                                    <div className="w-2 h-2 rounded-full bg-current opacity-25 mx-auto mt-0.5"></div>
                                                </div>

                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${getStatusBadgeClass(item.status)} px-2 py-0.5 rounded inline-block`}>
                                                            {getStatusLabel(item.status)}
                                                        </p>
                                                        {item.note && (
                                                            <p className="text-xs text-gray-600 dark:text-stone-400 mt-1">{item.note}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right ml-2 flex-shrink-0">
                                                        <p className="text-xs text-gray-500 dark:text-stone-400">
                                                            {formatDateTime(item.created_at || item.timestamp).date}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-stone-400">
                                                            {formatDateTime(item.created_at || item.timestamp).time}
                                                        </p>
                                                    </div>
                                                </div>
                                                {item.admin_name && (
                                                    <p className="text-xs text-gray-400 dark:text-stone-500 mt-1">
                                                        By: {item.admin_name}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-black opacity-75" onClick={() => setShowStatusModal(false)}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative z-10 inline-block align-bottom bg-white dark:bg-zinc-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-6 pt-5 pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100">
                                        Update Booking Status
                                    </h3>
                                    <button
                                        onClick={() => setShowStatusModal(false)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-stone-300"
                                        disabled={updatingStatus}
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                            Current Status: <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                            Select New Status
                                        </label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-stone-200"
                                            disabled={updatingStatus}
                                        >
                                            <option value="">Select status...</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="not-confirmed">Not Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                            Note (Optional)
                                        </label>
                                        <textarea
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-stone-200"
                                            placeholder="Add a note about this status change..."
                                            disabled={updatingStatus}
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-3 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    onClick={updateBookingStatus}
                                    disabled={updatingStatus || !selectedStatus}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 ${updatingStatus || !selectedStatus
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        }`}
                                >
                                    {updatingStatus ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Status'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-zinc-600 shadow-sm px-4 py-2 bg-white dark:bg-zinc-700 text-base font-medium text-gray-700 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    disabled={updatingStatus}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BookingsDetails;