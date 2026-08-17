import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../AdminLayout';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiUsers,
    FiBookOpen,
    FiXCircle,
    FiDollarSign,
    FiStar,
    FiHeart,
    FiTrendingUp,
    FiTrendingDown,
    FiRefreshCw,
    FiArrowRight,
    FiClock,
    FiGrid,
    FiUser,
    FiActivity,
    FiBarChart2,
    FiAward,
    FiUserPlus,
} from 'react-icons/fi';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart
} from 'recharts';

const AdminDashboard = () => {
    // Parse admin user from localStorage
    const adminUserString = localStorage.getItem('adminUser');
    const adminUser = adminUserString ? JSON.parse(adminUserString) : null;

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [metrics, setMetrics] = useState({
        total_bookings: 0,
        new_bookings: 0,
        confirmed_bookings: 0,
        cancelled_bookings: 0,
        total_users: 0,
        total_categories: 0,
        total_services: 0,
        today_sales: 0,
        weekly_sales: 0,
        monthly_sales: 0,
        yearly_sales: 0,
        total_reviews: 0,
        total_favourites: 0,
        average_rating: 0,
        pending_bookings: 0,
        completed_bookings: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);

    // Top Bookings Events Data
    const [topEvents, setTopEvents] = useState([]);

    const [salesData, setSalesData] = useState([]);

    // New Registered Users Weekly Data
    const [newUsersData, setNewUsersData] = useState([]);

    const [bookingStats, setBookingStats] = useState([]);

    const [categoryData, setCategoryData] = useState([]);

    const [userName, setUserName] = useState('');

    // Check authentication and set user name
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }

        if (adminUser.username) {
            setUserName(adminUser.username);
        } else if (adminUser.email) {
            setUserName(adminUser.email);
        } else {
            setUserName('Admin');
        }

        fetchDashboardData();

    }, []);

    const fetchDashboardData = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await Promise.allSettled([
                fetchMetrics(),
                fetchRecentActivities(),
                fetchSalesData(),
                fetchNewUsersData(),
                fetchBookingStats(),
                fetchCategoryData(),
                fetchTopEvents()
            ]);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load some dashboard data");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/dashboard-metrics/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            setMetrics({
                total_bookings: data.total_bookings || 0,
                new_bookings: data.new_bookings || 0,
                confirmed_bookings: data.confirmed_bookings || 0,
                cancelled_bookings: data.cancelled_bookings || 0,
                total_users: data.total_users || 0,
                total_categories: data.total_categories || 0,
                total_services: data.total_services || 0,
                today_sales: data.today_sales || 0,
                weekly_sales: data.weekly_sales || 0,
                monthly_sales: data.monthly_sales || 0,
                yearly_sales: data.yearly_sales || 0,
                total_reviews: data.total_reviews || 0,
                total_favourites: data.total_favourites || 0,
                average_rating: data.average_rating || 0,
                pending_bookings: data.pending_bookings || 0,
                completed_bookings: data.completed_bookings || 0
            });
        } catch (error) {
            console.error("Error fetching metrics:", error);
            toast.warning("Using cached metrics data");
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/recent-activities/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const activities = data.results || data || [];
            if (activities.length > 0) setRecentActivities(activities);
        } catch (error) {
            console.error("Error fetching recent activities:", error);
            toast.warning("Using cached activities data");
        }
    };

    const fetchSalesData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/sales-data/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) setSalesData(data);
        } catch (error) {
            console.error("Error fetching sales data:", error);
            toast.warning("Using cached sales data");
        }
    };

    const fetchNewUsersData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/new-users-weekly/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) setNewUsersData(data);
        } catch (error) {
            console.error("Error fetching new users data:", error);
            toast.warning("Using cached new users data");
        }
    };

    const fetchBookingStats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/booking-stats/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) setBookingStats(data);
        } catch (error) {
            console.error("Error fetching booking stats:", error);
            toast.warning("Using cached booking stats");
        }
    };

    const fetchCategoryData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/category-performance/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const categoriesArray = Array.isArray(data) ? data : (data.data || data.results || []);
            if (categoriesArray.length > 0) {
                const formattedData = categoriesArray.slice(0, 5).map(cat => ({
                    name: cat.name || cat.category_name || 'Category',
                    bookings: cat.bookings || 0
                }));
                setCategoryData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.warning("Using cached category data");
        }
    };

    const fetchTopEvents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/top-events/', {
                headers: {
                    'Authorization': `Bearer ${adminUser?.token || ''}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) setTopEvents(data);
        } catch (error) {
            console.error("Error fetching top events:", error);
            toast.warning("Using cached top events data");
        }
    };

    const handleRefresh = () => {
        if (!isLoading) {
            fetchDashboardData();
            toast.info("Refreshing dashboard data...");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    // Get rank medal - FIXED: Using only available icons
    const getRankMedal = (index) => {
        switch (index) {
            case 0: return <FiStar className="w-5 h-5 text-yellow-500" />;
            case 1: return <FiAward className="w-5 h-5 text-gray-400" />;
            case 2: return <FiAward className="w-5 h-5 text-amber-600" />;
            default: return <span className="text-sm font-medium text-gray-500 dark:text-stone-400">#{index + 1}</span>;
        }
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const getActivityIcon = (icon) => {
        switch (icon) {
            case 'book': return <FiBookOpen className="w-4 h-4" />;
            case 'star': return <FiStar className="w-4 h-4" />;
            case 'cancel': return <FiXCircle className="w-4 h-4" />;
            case 'user': return <FiUser className="w-4 h-4" />;
            case 'heart': return <FiHeart className="w-4 h-4" />;
            default: return <FiActivity className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[600px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-stone-400 font-medium">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                            Welcome back, <strong className="text-blue-600 dark:text-blue-400">{userName}</strong>!
                            {adminUser?.is_superuser && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Super Admin
                                </span>
                            )}
                            {adminUser?.is_staff && !adminUser?.is_superuser && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Staff
                                </span>
                            )}
                        </p>
                        {adminUser?.email && (
                            <p className="text-xs text-gray-400 dark:text-stone-500 mt-1">
                                <FiUser className="inline mr-1 w-3 h-3" />
                                {adminUser.email}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Loading...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-stone-400">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics.total_bookings}
                                </p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                <FiTrendingUp className="w-3 h-3 mr-1" />
                                +12.5%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-stone-400">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-stone-400">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics.total_users}
                                </p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                <FiTrendingUp className="w-3 h-3 mr-1" />
                                +8.3%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-stone-400">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-stone-400">Monthly Sales</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(metrics.monthly_sales)}
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                <FiTrendingUp className="w-3 h-3 mr-1" />
                                +18.7%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-stone-400">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-stone-400">Average Rating</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {metrics.average_rating}
                                    <span className="text-sm text-gray-500 dark:text-stone-400 ml-1">/ 5</span>
                                </p>
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                                <FiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                <FiTrendingUp className="w-3 h-3 mr-1" />
                                +0.3
                            </span>
                            <span className="text-xs text-gray-500 dark:text-stone-400">vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">New Bookings</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{metrics.new_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">Confirmed</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{metrics.confirmed_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">Pending</p>
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{metrics.pending_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">Completed</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{metrics.completed_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">Cancelled</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">{metrics.cancelled_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">Services</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{metrics.total_services}</p>
                    </div>
                </div>

                {/* Weekly Sales Bar Chart */}
                <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                <FiBarChart2 className="inline mr-2" />
                                Weekly Sales Performance
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                                Total weekly sales: {formatCurrency(metrics.weekly_sales)}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                <span className="text-xs text-gray-600 dark:text-stone-400">Sales</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-600 rounded"></div>
                                <span className="text-xs text-gray-600 dark:text-stone-400">Bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-red-400"></div>
                                <span className="text-xs text-gray-600 dark:text-stone-400">Target</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                    formatter={(value, name) => {
                                        if (name === 'Sales') return [`$${value.toLocaleString()}`, name];
                                        if (name === 'Target') return [`$${value.toLocaleString()}`, name];
                                        return [value, name];
                                    }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Sales" />
                                <Bar yAxisId="right" dataKey="bookings" fill="#10B981" radius={[4, 4, 0, 0]} name="Bookings" />
                                <Line yAxisId="left" type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} name="Target" dot={{ fill: '#EF4444', r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-stone-700">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-stone-400">Best Day</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {salesData.length > 0 ? salesData.reduce((max, day) => day.sales > max.sales ? day : max, salesData[0]).day : '-'}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                {salesData.length > 0 ? formatCurrency(salesData.reduce((max, day) => day.sales > max.sales ? day : max, salesData[0]).sales) : formatCurrency(0)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-stone-400">Worst Day</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {salesData.length > 0 ? salesData.reduce((min, day) => day.sales < min.sales ? day : min, salesData[0]).day : '-'}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {salesData.length > 0 ? formatCurrency(salesData.reduce((min, day) => day.sales < min.sales ? day : min, salesData[0]).sales) : formatCurrency(0)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-stone-400">Avg Daily Sales</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {salesData.length > 0 ? formatCurrency(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.length) : formatCurrency(0)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-stone-400">Total Bookings</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {salesData.length > 0 ? salesData.reduce((sum, day) => sum + day.bookings, 0) : 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend Chart */}
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                <FiTrendingUp className="inline mr-2" />
                                Sales Trend
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-stone-400">Last 7 days</span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="day" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="url(#salesGradient)" name="Sales" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* New Registered Users Weekly Line Chart */}
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                    <FiUserPlus className="inline mr-2" />
                                    New Registered Users (Weekly)
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                                    Total: {newUsersData[newUsersData.length - 1]?.totalUsers || 0} users
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                    <span className="text-xs text-gray-600 dark:text-stone-400">New Users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-0.5 bg-blue-600"></div>
                                    <span className="text-xs text-gray-600 dark:text-stone-400">Cumulative</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={newUsersData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="day" stroke="#9CA3AF" />
                                    <YAxis yAxisId="left" stroke="#9CA3AF" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="newUsers" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="New Users" />
                                    <Line yAxisId="right" type="monotone" dataKey="totalUsers" stroke="#3B82F6" strokeWidth={2} name="Total Users" dot={{ fill: '#3B82F6', r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-stone-700">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-stone-400">Avg Daily</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {(newUsersData.reduce((sum, day) => sum + day.newUsers, 0) / newUsersData.length).toFixed(0)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-stone-400">Best Day</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {Math.max(...newUsersData.map(day => day.newUsers))}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-stone-400">Weekly Total</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {newUsersData.reduce((sum, day) => sum + day.newUsers, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Bookings Events Table */}
                <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 dark:border-stone-700">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                <FiAward className="inline mr-2" />
                                Top Bookings Events
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                                Ranking by total bookings
                            </p>
                        </div>
                        <Link to="/manage-events" className="text-xs text-blue-600 hover:text-blue-700 flex items-center mt-2 sm:mt-0">
                            View All Events <FiArrowRight className="ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-stone-800/50 border-b border-gray-200 dark:border-stone-700 text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase">
                                    <th className="px-4 py-3 text-center w-16">Rank</th>
                                    <th className="px-4 py-3">Event Name</th>
                                    <th className="px-4 py-3 text-center">Bookings</th>
                                    <th className="px-4 py-3 text-center hidden sm:table-cell">Revenue</th>
                                    <th className="px-4 py-3 text-center hidden md:table-cell">Status</th>
                                    <th className="px-4 py-3 text-center hidden lg:table-cell">Growth</th>
                                    <th className="px-4 py-3 text-center w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm">
                                {topEvents.map((event, index) => (
                                    <tr key={event.id || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center">
                                                {getRankMedal(index)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-stone-100">
                                            <div className="flex items-center gap-2">
                                                {event.event}
                                                {index < 3 && (
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                        index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                                                            'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                                        }`}>
                                                        {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                                            {event.bookings}
                                        </td>
                                        <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600 dark:text-stone-300">
                                            {formatCurrency(event.revenue)}
                                        </td>
                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center hidden lg:table-cell">
                                            {event.growth !== 0 ? (
                                                <span className={`text-xs font-medium flex items-center justify-center gap-1 ${event.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {event.growth > 0 ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                                                    {Math.abs(event.growth)}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-stone-400">New</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link to={`/event/${event.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                                <FiArrowRight className="w-4 h-4 mx-auto" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-stone-700 flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-stone-400">
                            Showing top {topEvents.length} events
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-stone-400">Total Bookings:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {topEvents.reduce((sum, event) => sum + event.bookings, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Category Performance & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Category Performance */}
                    <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                <FiGrid className="inline mr-2" />
                                Category Performance
                            </h3>
                            <Link to="/manage-category" className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                                View All <FiArrowRight className="ml-1" />
                            </Link>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300">
                                <FiClock className="inline mr-2" />
                                Recent Activities
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-stone-400">Live</span>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <div key={activity.id || Math.random()} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-lg transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            {getActivityIcon(activity.icon)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {activity.user}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-stone-400 truncate">
                                                {activity.action}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-stone-500 whitespace-nowrap">
                                            {activity.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500 dark:text-stone-400 text-sm">
                                    No recent activities
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-stone-300 mb-4">
                        <FiActivity className="inline mr-2" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <Link to="/manage-users" className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center">
                            <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-700 dark:text-stone-300">View Users</span>
                        </Link>
                        <Link to="/manage-users" className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center">
                            <FiUser className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-700 dark:text-stone-300">Add User</span>
                        </Link>
                        <Link to="/add-category" className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center">
                            <FiGrid className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-700 dark:text-stone-300">Add Category</span>
                        </Link>
                        <Link to="/admin/bookings" className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-center">
                            <FiBookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-700 dark:text-stone-300">View Bookings</span>
                        </Link>
                        <Link to="/manage-reviews" className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-center">
                            <FiStar className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-700 dark:text-stone-300">View Reviews</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;