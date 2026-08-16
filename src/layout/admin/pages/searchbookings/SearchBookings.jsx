import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';

const SearchBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [bookingNumber, setBookingNumber] = useState('');
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

    const fetchAllBookings = async () => {
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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

            const formattedBookings = bookingsData.map(b => ({
                id: b.id,
                event_name: b.event_name || b.event?.event_name || 'N/A',
                quantity: b.quantity || 0,
                total_price: b.total_price || 0,
                booking_date: b.booking_date || b.booking_date_formatted,
                is_booked: b.is_booked || false,
                status: b.status || (b.is_booked ? 'confirmed' : 'pending'),
                user_name: b.user_name || 'User',
                user_email: b.user_email || b.user?.email || 'N/A',
                user_phone: b.user_phone || b.user?.phone_number || 'N/A',
                event_date: b.event_date || b.event?.event_date || 'N/A',
                event_location: b.event_location || b.event?.event_location || 'N/A',
                booking_reference: b.booking_reference || b.booked_number || `BK-${b.id}`,
                payment_status: b.payment_status || 'N/A',
                payment_method: b.payment_method || 'N/A',
                created_at: b.created_at || b.booking_date
            }));

            setBookings(formattedBookings);
        } catch (err) {
            setError(err.message || 'Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin()) { navigate('/admin-login'); return; }
        fetchAllBookings();
    }, [navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchPerformed(true);
        setLoading(true);
        setError(null);

        try {
            const searchTerm = bookingNumber.trim();

            if (!searchTerm) {
                setError('Please enter a booking number, name, or email to search.');
                setLoading(false);
                setSearchResults([]);
                return;
            }

            const q = searchTerm.toLowerCase();

            const results = bookings.filter(booking => {
                return (
                    booking.id.toString() === searchTerm ||
                    booking.id.toString().includes(searchTerm) ||
                    (booking.booking_reference || '').toLowerCase().includes(q) ||
                    (booking.user_name || '').toLowerCase().includes(q) ||
                    (booking.user_email || '').toLowerCase().includes(q) ||
                    (booking.event_name || '').toLowerCase().includes(q)
                );
            });

            setSearchResults(results);

            if (results.length === 0) {
                setError(`No booking found matching: ${searchTerm}`);
            }
        } catch (err) {
            setError('Error searching for booking: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setBookingNumber('');
        setSearchResults([]);
        setSearchPerformed(false);
        setError(null);
    };

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

    const viewBookingDetails = (bookingId) => {
        navigate(`/admin/bookings/${bookingId}`);
    };

    const viewSingleBooking = (bookingId) => {
        navigate(`/admin/bookings/${bookingId}`);
    };

    if (loading && bookings.length === 0) {
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

    const displayBookings = searchPerformed ? searchResults : [];

    return (
        <AdminLayout>
            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-stone-100">
                        Search Bookings by Number
                    </h1>
                    <button
                        onClick={fetchAllBookings}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className={`mb-4 border px-4 py-3 rounded relative ${error.includes('No booking found')
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300'
                        }`}>
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
                )}

                {/* Search Form - Fixed Alignment */}
                <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 mb-6">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Input Field - Takes remaining space */}
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1.5">
                                    Enter Booking Number
                                </label>
                                <input
                                    type="text"
                                    value={bookingNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setBookingNumber(value);
                                        if (searchPerformed) {
                                            setSearchPerformed(false);
                                            setSearchResults([]);
                                        }
                                    }}
                                    placeholder="Enter booking ID or reference (e.g., 12345 or BK-2023)"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-stone-200 text-lg"
                                    autoFocus
                                />
                                <div className="mt-2 flex flex-wrap gap-2 items-center">
                                    <span className="text-xs text-gray-500 dark:text-stone-400">
                                        Examples:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBookingNumber('BK-2023');
                                            if (searchPerformed) {
                                                setSearchPerformed(false);
                                                setSearchResults([]);
                                            }
                                        }}
                                        className="text-xs bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-stone-300 px-2 py-1 rounded transition-colors duration-200"
                                    >
                                        BK-2023
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBookingNumber('bk-2023');
                                            if (searchPerformed) {
                                                setSearchPerformed(false);
                                                setSearchResults([]);
                                            }
                                        }}
                                        className="text-xs bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-stone-300 px-2 py-1 rounded transition-colors duration-200"
                                    >
                                        bk-2023
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBookingNumber('12345');
                                            if (searchPerformed) {
                                                setSearchPerformed(false);
                                                setSearchResults([]);
                                            }
                                        }}
                                        className="text-xs bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-stone-300 px-2 py-1 rounded transition-colors duration-200"
                                    >
                                        12345
                                    </button>
                                    <span className="text-xs text-gray-400 dark:text-stone-500 ml-1">
                                        (case-insensitive)
                                    </span>
                                </div>
                            </div>

                            {/* Buttons - Fixed width and aligned properly */}
                            <div className="flex gap-3 items-end w-full md:w-auto md:flex-shrink-0">
                                <button
                                    type="submit"
                                    disabled={loading || !bookingNumber.trim()}
                                    className={`flex-1 md:flex-none px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 min-w-[100px] ${loading || !bookingNumber.trim()
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Search
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetSearch}
                                    className="flex-1 md:flex-none bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 min-w-[100px]"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Stats */}
                    {searchPerformed && displayBookings.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 dark:text-stone-300">Found:</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{displayBookings.length}</span>
                                    <span className="text-gray-500 dark:text-stone-400">booking{displayBookings.length !== 1 ? 's' : ''}</span>
                                </div>
                                {displayBookings.length === 1 && (
                                    <button
                                        onClick={() => viewSingleBooking(displayBookings[0].id)}
                                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                    >
                                        View Booking Details →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Table */}
                {searchPerformed && (
                    <>
                        {displayBookings.length === 0 ? (
                            <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-stone-300 px-4 py-12 rounded text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-lg font-medium">No bookings found</p>
                                <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                                    No booking matches the number: <strong>{bookingNumber}</strong>
                                </p>
                                <div className="mt-4 text-sm text-gray-500 dark:text-stone-400">
                                    <p>Try searching with:</p>
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                        <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-xs">BK-2023</span>
                                        <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-xs">bk-2023</span>
                                        <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-xs">12345</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 dark:text-stone-500">
                                        Search is case-insensitive (BK-2023 = bk-2023)
                                    </p>
                                </div>
                                <button
                                    onClick={resetSearch}
                                    className="mt-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                >
                                    Try a different booking number
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto shadow-md rounded-lg">
                                <table className="min-w-full bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                    <thead className="bg-gray-100 dark:bg-zinc-700">
                                        <tr>
                                            {['ID', 'Reference', 'User', 'Event', 'Qty', 'Total', 'Date', 'Status', 'Payment', 'Actions'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-stone-300 uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                        {displayBookings.map((booking) => {
                                            const { date } = formatDateTime(booking.booking_date);
                                            return (
                                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-150">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200 font-medium">
                                                        #{booking.id}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        <span className="font-mono bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-gray-700 dark:text-stone-300">
                                                            {booking.booking_reference}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                        <div className="font-medium">{booking.user_name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-stone-400">{booking.user_email}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                        {booking.event_name}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200 text-center">
                                                        {booking.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200 font-medium">
                                                        ${(booking.total_price || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-stone-200">
                                                        {date}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                            {getStatusLabel(booking.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.payment_status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                                            booking.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                                                            }`}>
                                                            {booking.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => viewBookingDetails(booking.id)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default SearchBookings;