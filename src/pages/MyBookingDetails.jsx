import React, { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CalendarIcon,
    MapPinIcon,
    TicketIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    QrCodeIcon,
    IdentificationIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { isAuthenticated, getUserId, getToken } from '../utils/auth';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

const MyBookingDetails = () => {
    const userId = getUserId();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/booking-details/${bookingId}/`);
                // Backend returns: { message: "...", data: { ...bookingData } }
                // Axios wraps this in response.data, so we need response.data.data
                const bookingData = response.data?.data || response.data || response;
                setBooking(bookingData);
                calculateTotalPrice(bookingData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking details:', error);
                setError(error.message || 'Failed to load booking details');
                setLoading(false);
            }
        };

        if (bookingId && userId) {
            fetchBookingDetails();
        }
    }, [bookingId, userId]);

    const calculateTotalPrice = (bookingData) => {
        if (bookingData) {
            if (bookingData.total_price) {
                setTotalPrice(parseFloat(bookingData.total_price));
            } else if (bookingData.event?.event_price && bookingData.quantity) {
                const calculatedTotal = parseFloat(bookingData.event.event_price) * parseInt(bookingData.quantity);
                setTotalPrice(calculatedTotal);
            } else {
                setTotalPrice(0);
            }
        }
    };

    useEffect(() => {
        if (booking) {
            calculateTotalPrice(booking);
        }
    }, [booking]);

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
        if (!price && price !== 0) return '0.00';
        return parseFloat(price).toFixed(2);
    };

    const handleDownloadTicket = async () => {
        try {
            setDownloading('ticket');
            const token = getToken();
            const response = await fetch(`http://127.0.0.1:8000/api/v1/ticket/${bookingId}/`, {
                method: 'GET',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ticket_${booking.booked_number || booking.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to download ticket');
            }
        } catch (error) {
            console.error('Error downloading ticket:', error);
            toast.error('Error downloading ticket');
        } finally {
            setDownloading(null);
        }
    };

    const handleCancelBooking = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.post(`/cancel-booking/${bookingId}/`);
                toast.success('Booking cancelled successfully');
                navigate('/my-bookings');
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error(error.message || 'Failed to cancel booking');
            }
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            setDownloading('invoice');
            const token = getToken();
            const response = await fetch(`http://127.0.0.1:8000/api/v1/invoice/${bookingId}/`, {
                method: 'GET',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice_${booking.booked_number || booking.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to download invoice');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Error downloading invoice');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-600 font-medium">Loading booking details...</p>
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
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border-l-4 border-red-500">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 rounded-full p-3">
                                    <XCircleIcon className="w-12 h-12 text-red-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Booking</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <p className="text-sm text-gray-500 mb-6">
                                Make sure Django server is running on port 8000
                            </p>
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

    if (!booking) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
                            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                            >
                                Back to My Bookings
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
                <div className="max-w-4xl mx-auto">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/my-bookings')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 mb-6 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to My Bookings</span>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        <div className="relative">
                            <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
                                {booking.event?.event_image ? (
                                    <>
                                        <img
                                            src={booking.event.event_image}
                                            alt={booking.event.event_name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                        <TicketIcon className="h-24 w-24 text-white/30" />
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                                                    <TicketIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Booking Details</h1>
                                            </div>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-mono">
                                                    #{booking.booked_number || booking.id}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${booking.is_booked
                                                ? 'bg-green-500 text-white'
                                                : 'bg-yellow-500 text-white'
                                                }`}>
                                                {booking.is_booked ? (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                                                        Confirmed
                                                    </>
                                                ) : (
                                                    'Pending'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                                        <UserIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">Booked By</h2>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <span className="text-3xl font-bold text-white">
                                                {booking.user?.first_name?.charAt(0)}{booking.user?.last_name?.charAt(0)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <UserIcon className="h-3 w-3" />
                                                Full Name
                                            </p>
                                            <p className="text-base font-bold text-gray-900">
                                                {booking.user?.first_name} {booking.user?.last_name}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <EnvelopeIcon className="h-3 w-3" />
                                                Email Address
                                            </p>
                                            <p className="text-base text-gray-700 font-medium break-all">
                                                {booking.user?.email}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <PhoneIcon className="h-3 w-3" />
                                                Phone Number
                                            </p>
                                            <p className="text-base text-gray-700 font-medium">
                                                {booking.user?.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-purple-50/50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                                        <CalendarIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">Event Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Event Name</p>
                                        <p className="text-lg font-bold text-gray-900">{booking.event?.event_name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                                        <p className="text-gray-700 font-medium">
                                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                                {booking.event?.category?.category_name || 'N/A'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</p>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <CalendarIcon className="h-4 w-4 text-purple-500" />
                                                <span className="font-medium">{formatDate(booking.event?.event_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <ClockIcon className="h-4 w-4 text-purple-500" />
                                                <span className="font-medium">{booking.event?.event_time || 'Time not set'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPinIcon className="h-4 w-4 text-purple-500" />
                                            <span className="font-medium">{booking.event?.event_location || 'Online Event'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</p>
                                        <div className="flex items-center gap-2">
                                            <TicketIcon className="h-4 w-4 text-purple-500" />
                                            <span className="text-lg font-bold text-gray-900">{booking.quantity}</span>
                                            <span className="text-gray-600">{booking.quantity === 1 ? 'ticket' : 'tickets'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-green-50/50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-xl">
                                        <IdentificationIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">Booking Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking Date</p>
                                        <p className="text-gray-700 font-medium">{formatDate(booking.booking_date)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking Number</p>
                                        <p className="text-gray-700 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">{booking.booked_number || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Unit Price</p>
                                        <p className="text-gray-700 font-bold">${formatPrice(booking.event?.event_price)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Price</p>
                                        <div>
                                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                                ${formatPrice(totalPrice)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {booking.quantity} × ${formatPrice(booking.event?.event_price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${booking.is_booked
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.is_booked ? (
                                                <>
                                                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                                                    Confirmed
                                                </>
                                            ) : (
                                                'Pending'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-yellow-50/50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-xl">
                                            <QrCodeIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">Digital Ticket</h2>
                                            <p className="text-sm text-gray-500">Scan to verify your ticket</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                                            <QrCodeIcon className="h-16 w-16 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleDownloadTicket}
                                    disabled={downloading !== null}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium transform hover:-translate-y-0.5 disabled:opacity-60"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                    {downloading === 'ticket' ? 'Downloading...' : 'Download Ticket'}
                                </button>
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={downloading !== null}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium transform hover:-translate-y-0.5 disabled:opacity-60"
                                >
                                    <DocumentArrowDownIcon className="h-5 w-5" />
                                    {downloading === 'invoice' ? 'Downloading...' : 'Download Invoice'}
                                </button>

                                <button
                                    onClick={handleCancelBooking}
                                    disabled={downloading !== null}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-500 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-60"
                                >
                                    <XCircleIcon className="h-5 w-5" />
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default MyBookingDetails;
