// BookingReport.jsx - Booking Report Page
import React, { useState } from 'react';
import {
    FaFileAlt,
    FaCalendarAlt,
    FaFilter,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaChartBar,
    FaFilePdf,
    FaFileExcel,
    FaFileCsv,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaSpinner,
    FaDownload,
    FaPrint,
} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { AdminLayout } from '../../AdminLayout';

const API_BASE = 'http://localhost:8000/api/v1';

const getAuthToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('adminToken');

const BookingReport = () => {
    const [formData, setFormData] = useState({ from_date: '', to_date: '', status: 'all' });
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.from_date || !formData.to_date) {
            setError('Please select both From and To dates.');
            return;
        }
        if (formData.from_date > formData.to_date) {
            setError('From date cannot be later than To date.');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setError('Authentication token not found. Please login again.');
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                from_date: formData.from_date,
                to_date: formData.to_date,
                status: formData.status,
            });

            const response = await fetch(`${API_BASE}/booking-report/?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();
            setBookings(data.data || []);
            setStats({
                total: data.stats?.total || 0,
                confirmed: data.stats?.confirmed || 0,
                pending: data.stats?.pending || 0,
                cancelled: data.stats?.cancelled || 0,
                totalRevenue: data.stats?.total_revenue || 0,
            });
            setIsReportGenerated(true);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || 'Failed to generate report.');
        } finally {
            setLoading(false);
        }
    };

    const resetReport = () => {
        setBookings([]);
        setIsReportGenerated(false);
        setStats({ total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 });
        setFormData({ from_date: '', to_date: '', status: 'all' });
        setError(null);
        setCurrentPage(1);
    };

    // Status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                        <FaCheckCircle className="text-[10px]" /> Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                        <FaClock className="text-[10px]" /> Pending
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-700">
                        <FaTimesCircle className="text-[10px]" /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-stone-300">
                        {status}
                    </span>
                );
        }
    };

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = bookings.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    // CSV export
    const exportCSV = () => {
        if (!bookings.length) return;
        const headers = ['ID', 'Event', 'User', 'Email', 'Phone', 'Booking Date', 'Event Date', 'Qty', 'Unit Price', 'Total Price', 'Status', 'Payment Method'];
        const rows = bookings.map(b => [
            b.id, b.event_name, b.user_name, b.email, b.phone,
            b.booking_date, b.event_date, b.quantity,
            b.unit_price, b.total_price, b.status, b.payment_method
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-report-${formData.from_date}-to-${formData.to_date}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-stone-100">
                            Booking <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Report</span>
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-stone-400 mt-0.5">Generate reports by date range and status filter</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-stone-200 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm border border-gray-200 dark:border-zinc-600 transition-colors"
                        >
                            <FaPrint /> Print
                        </button>
                        <button
                            onClick={resetReport}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-stone-200 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm border border-gray-200 dark:border-zinc-600 transition-colors"
                        >
                            <MdRefresh /> Reset
                        </button>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* From Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-stone-300 mb-1.5">
                                    <FaCalendarAlt className="inline mr-1 text-purple-500" />
                                    From Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="from_date"
                                    value={formData.from_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-stone-100 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-stone-300 mb-1.5">
                                    <FaCalendarAlt className="inline mr-1 text-purple-500" />
                                    To Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="to_date"
                                    value={formData.to_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-stone-100 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-stone-300 mb-1.5">
                                    <FaFilter className="inline mr-1 text-purple-500" />
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-stone-100 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                                >
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><FaSpinner className="animate-spin" /> Generating...</>
                                    ) : (
                                        <><FaSearch /> Generate Report</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Report Results */}
                {isReportGenerated && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                            {[
                                { label: 'Total Bookings', value: stats.total, color: 'text-gray-800 dark:text-stone-100', border: 'border-gray-200 dark:border-zinc-700' },
                                { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-700' },
                                { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700' },
                                { label: 'Cancelled', value: stats.cancelled, color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-700' },
                                { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-700' },
                            ].map(({ label, value, color, border }) => (
                                <div key={label} className={`bg-white dark:bg-zinc-800 border ${border} rounded-xl p-4 shadow-sm`}>
                                    <p className={`text-xs ${color.replace('text-', 'text-').replace('800', '500').replace('600', '500').replace('400', '400')} mb-1`}>{label}</p>
                                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Export Buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={exportCSV}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm font-medium border border-blue-200 dark:border-blue-700 transition-colors"
                            >
                                <FaFileCsv /> Export CSV
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-sm font-medium border border-red-200 dark:border-red-700 transition-colors"
                            >
                                <FaFilePdf /> Print / PDF
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-zinc-700 border-b border-gray-200 dark:border-zinc-600">
                                            {['#', 'Event', 'User', 'Booking Date', 'Event Date', 'Qty', 'Total', 'Status', 'Payment'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-stone-300 uppercase tracking-wider whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="px-4 py-10 text-center text-gray-500 dark:text-stone-400">
                                                    No bookings found for the selected filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentItems.map((booking, index) => (
                                                <tr
                                                    key={booking.id}
                                                    className="border-b border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-stone-400">{indexOfFirst + index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900 dark:text-stone-100 whitespace-nowrap">{booking.event_name}</p>
                                                        <p className="text-xs text-gray-400 dark:text-stone-500">{booking.category_name}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900 dark:text-stone-100">{booking.user_name}</p>
                                                        <p className="text-xs text-gray-400 dark:text-stone-500">{booking.email}</p>
                                                        <p className="text-xs text-gray-400 dark:text-stone-500">{booking.phone}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-stone-300 whitespace-nowrap">{booking.booking_date}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-stone-300 whitespace-nowrap">{booking.event_date}</td>
                                                    <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-stone-300">{booking.quantity}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                                                        ${(booking.total_price || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-stone-400 whitespace-nowrap">{booking.payment_method}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-700/50 border-t border-gray-200 dark:border-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <p className="text-xs text-gray-500 dark:text-stone-400">
                                        Showing {indexOfFirst + 1}–{Math.min(indexOfLast, bookings.length)} of {bookings.length} entries
                                    </p>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-600 transition-colors"
                                        >
                                            <FaChevronLeft className="text-xs" />
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${currentPage === i + 1
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                                                    : 'text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-zinc-600 border border-gray-200 dark:border-zinc-600'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-600 transition-colors"
                                        >
                                            <FaChevronRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!isReportGenerated && !loading && (
                    <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-stone-100 mb-2">No Report Generated</h3>
                        <p className="text-sm text-gray-500 dark:text-stone-400 max-w-md mx-auto">
                            Select a date range and status filter, then click "Generate Report" to view real booking data.
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-gray-400 dark:text-stone-500">
                            <span className="flex items-center gap-1.5"><FaFileAlt className="text-purple-400" /> View bookings</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600"></span>
                            <span className="flex items-center gap-1.5"><FaChartBar className="text-purple-400" /> Track stats</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600"></span>
                            <span className="flex items-center gap-1.5"><FaDownload className="text-purple-400" /> Export CSV</span>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BookingReport;