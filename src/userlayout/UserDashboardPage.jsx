import React, { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    UserCircleIcon,
    TicketIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    HeartIcon,
    Cog6ToothIcon,
    ShoppingCartIcon,
    ArrowLeftOnRectangleIcon,
    QrCodeIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { getUserId, getUser, clearAuth } from '../utils/auth';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';

import StatCard from './components/StatCard';
import OverviewTab from './sections/OverviewTab';
import BookingsTab from './sections/BookingsTab';
import TicketsTab from './sections/TicketsTab';
import CartTab from './sections/CartTab';
import FavouritesTab from './sections/FavouritesTab';
import ProfileTab from './sections/ProfileTab';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Cog6ToothIcon },
    { id: 'bookings', label: 'Bookings', icon: TicketIcon },
    { id: 'tickets', label: 'Tickets', icon: QrCodeIcon },
    { id: 'cart', label: 'Cart', icon: ShoppingCartIcon },
    { id: 'favourites', label: 'Favourites', icon: HeartIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
];

const Dashboard = () => {
    const userId = getUserId();
    const navigate = useNavigate();
    const { fetchCartCount } = useCart();
    const { tab } = useParams();
    const activeTab = TABS.some(t => t.id === tab) ? tab : 'overview';
    const setActiveTab = (newTab) => navigate(`/userdashboard/${newTab}`);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingEvents: 0,
        pastEvents: 0,
        totalSpent: 0,
        favouritesCount: 0,
        cartItems: 0
    });
    const [bookings, setBookings] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [user, setUser] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    // Profile edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ first_name: '', last_name: '' });

    // Change password state
    const [pwdData, setPwdData] = useState({
        old_password: '', new_password: '', confirm_password: ''
    });
    const [showOldPwd, setShowOldPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            toast.error('Please login to view your dashboard');
            navigate('/login', { replace: true });
            return;
        }
        loadAll();
    }, [userId, navigate]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [userRes, bookingsRes, cartRes, favRes] = await Promise.allSettled([
                api.get(`/users/${userId}/`),
                api.get(`/my-bookings/${userId}/`),
                api.get(`/book/${userId}/`),
                api.get(`/favourites/${userId}/`)
            ]);

            if (userRes.status === 'fulfilled' && userRes.value) {
                const u = userRes.value.data?.data || userRes.value.data;
                setUser(u);
                setEditData({
                    first_name: u.first_name || '',
                    last_name: u.last_name || ''
                });
            }

            const bookingsData = bookingsRes.status === 'fulfilled'
                ? (bookingsRes.value.data?.data || bookingsRes.value.data || [])
                : [];
            setBookings(bookingsData);

            const cartDataRaw = cartRes.status === 'fulfilled' ? cartRes.value.data : null;
            const cartData = cartDataRaw ? (cartDataRaw.data ? cartDataRaw.data : (Array.isArray(cartDataRaw) ? cartDataRaw : [])) : [];
            setCartItems(cartData);

            const favData = favRes.status === 'fulfilled'
                ? (favRes.value.data?.data || favRes.value.data || [])
                : [];
            setFavourites(favData);

            // Compute stats
            const now = new Date();
            const upcoming = bookingsData.filter(b => new Date(b.event?.event_date) > now);
            const past = bookingsData.filter(b => new Date(b.event?.event_date) <= now);
            const totalSpent = bookingsData.reduce(
                (sum, b) => sum + (b.total_price || (b.event?.event_price * b.quantity) || 0), 0
            );

            setStats({
                totalBookings: bookingsData.length,
                upcomingEvents: upcoming.length,
                pastEvents: past.length,
                totalSpent,
                favouritesCount: favData.length,
                cartItems: cartData.length
            });
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
        } catch { return dateString; }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return dateString; }
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        return parseFloat(price).toFixed(2);
    };

    const getInitials = () => {
        if (!user) return 'U';
        const first = user.first_name?.charAt(0) || '';
        const last = user.last_name?.charAt(0) || '';
        return (first + last).toUpperCase() || 'U';
    };

    const handleLogout = () => {
        clearAuth();
        toast.success('Logged out successfully');
        navigate('/login', { replace: true });
    };

    // Cart handlers
    const updateCartQty = async (id, qty, item) => {
        if (qty < 1 || updatingItemId === id) return;
        if (item.event && qty > item.event.event_quantity) {
            toast.warning(`Only ${item.event.event_quantity} tickets available`);
            return;
        }
        setUpdatingItemId(id);
        try {
            await api.put('/book/update-quantity/', { booking_id: id, quantity: qty });
            await loadAll();
            fetchCartCount();
            toast.success('Cart updated');
        } catch (err) {
            toast.error(err?.message || 'Failed to update');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const removeCartItem = async (id) => {
        if (!window.confirm('Remove this item from cart?')) return;
        try {
            await api.delete(`/book/remove/${id}/`);
            await loadAll();
            fetchCartCount();
            toast.success('Removed from cart');
        } catch (err) {
            toast.error(err?.message || 'Failed to remove');
        }
    };

    const cartTotal = cartItems.reduce(
        (sum, it) => sum + (parseFloat(it.event?.event_price) || 0) * (parseInt(it.quantity) || 0), 0
    );

    // Favourites handler
    const removeFavourite = async (eventId) => {
        try {
            await api.post('/favourites/toggle/', { user_id: userId, event_id: eventId });
            await loadAll();
            toast.success('Removed from favourites');
        } catch (err) {
            toast.error(err?.message || 'Failed to remove');
        }
    };

    // Profile handlers
    const handleEditChange = (e) => {
        setEditData(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/update/${userId}/`, editData);
            setUser(p => ({ ...p, ...editData }));
            setIsEditing(false);
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err?.message || 'Failed to update profile');
        }
    };

    // Change password
    const handlePwdChange = (e) => {
        setPwdData(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        if (!pwdData.old_password || !pwdData.new_password || !pwdData.confirm_password) {
            toast.error('All password fields are required');
            return;
        }
        if (pwdData.new_password.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (pwdData.new_password !== pwdData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }
        setPwdLoading(true);
        try {
            await api.post('/change-password/', pwdData);
            setPwdData({ old_password: '', new_password: '', confirm_password: '' });
            toast.success('Password changed successfully');
        } catch (err) {
            toast.error(err?.message || 'Failed to change password');
        } finally {
            setPwdLoading(false);
        }
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#29BBA3]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 bg-[#29BBA3] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="mt-6 text-[#4A5C57] dark:text-[#A8C4BE] font-medium">Loading your dashboard...</p>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:w-1/4 flex-shrink-0">
                        <div className="bg-white dark:bg-[#1C2B27] rounded-3xl shadow-sm border border-[#E6E1D8] dark:border-[#2A3D38] p-6 sticky top-24">
                            {/* User Info */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-teal-900/10 mb-4 ring-4 ring-[#E6F9F6]">
                                    {getInitials()}
                                </div>
                                <h2 className="text-xl font-bold text-[#1E352F] dark:text-[#E8F5F2]">{user?.first_name || 'User'} {user?.last_name || ''}</h2>
                                <p className="text-sm text-[#66756F] dark:text-[#7AA49D] mt-1 flex items-center justify-center gap-1">
                                    <CalendarIcon className="h-4 w-4" /> Member since {formatDate(user?.register_date)}
                                </p>
                            </div>

                            {/* Nav Links */}
                            <nav className="space-y-2">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive
                                                ? 'bg-[#E6F9F6] dark:bg-[#1C2B27] text-[#1E8B7A] translate-x-1'
                                                : 'text-[#66756F] dark:text-[#7AA49D] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] dark:bg-[#162019] dark:hover:bg-[#162019] dark:bg-[#162019] hover:text-[#1E8B7A]'
                                                }`}
                                        >
                                            <Icon className={`h-5 w-5 ${isActive ? 'text-[#1E8B7A]' : 'text-gray-400 dark:text-[#66756F]'}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-[#E6E1D8] dark:border-[#2A3D38]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                                >
                                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:w-3/4 flex-1">
                        {/* Show Stats only on Overview */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="bg-gradient-to-r from-[#1E352F] via-[#1E8B7A] to-[#29BBA3] rounded-3xl p-8 text-white shadow-xl shadow-teal-900/30 relative overflow-hidden mb-8">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-[#1C2B27]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-bold mb-2 text-white">Welcome back to your Dashboard!</h1>
                                        <p className="text-white/80">Here is what's happening with your events and bookings.</p>
                                    </div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
                                >
                                    <StatCard label="Total Bookings" value={stats.totalBookings} icon={TicketIcon} color="blue" />
                                    <StatCard label="Upcoming Events" value={stats.upcomingEvents} icon={CalendarIcon} color="green" />
                                    <StatCard label="Total Spent" value={`$${formatPrice(stats.totalSpent)}`} icon={CurrencyDollarIcon} color="purple" />
                                </motion.div>
                            </>
                        )}

                        <div className="bg-white dark:bg-[#1C2B27] rounded-3xl shadow-sm border border-[#E6E1D8] dark:border-[#2A3D38] p-6 sm:p-8">
                            {activeTab === 'overview' && (
                                <OverviewTab
                                    bookings={bookings}
                                    user={user}
                                    navigate={navigate}
                                    formatDate={formatDate}
                                    formatPrice={formatPrice}
                                    stats={stats}
                                    setActiveTab={setActiveTab}
                                />
                            )}
                            {activeTab === 'bookings' && (
                                <BookingsTab
                                    bookings={bookings}
                                    navigate={navigate}
                                    formatDate={formatDate}
                                    formatPrice={formatPrice}
                                    loadAll={loadAll}
                                />
                            )}
                            {activeTab === 'tickets' && (
                                <TicketsTab
                                    bookings={bookings}
                                    navigate={navigate}
                                    formatDate={formatDate}
                                />
                            )}
                            {activeTab === 'cart' && (
                                <CartTab
                                    cartItems={cartItems}
                                    cartTotal={cartTotal}
                                    updateCartQty={updateCartQty}
                                    removeCartItem={removeCartItem}
                                    updatingItemId={updatingItemId}
                                    navigate={navigate}
                                    userId={userId}
                                    formatPrice={formatPrice}
                                    formatDate={formatDate}
                                />
                            )}
                            {activeTab === 'favourites' && (
                                <FavouritesTab
                                    favourites={favourites}
                                    navigate={navigate}
                                    formatDate={formatDate}
                                    removeFavourite={removeFavourite}
                                    formatPrice={formatPrice}
                                />
                            )}
                            {activeTab === 'profile' && (
                                <ProfileTab
                                    user={user}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    editData={editData}
                                    handleEditChange={handleEditChange}
                                    saveProfile={saveProfile}
                                    formatDateTime={formatDateTime}
                                    pwdData={pwdData}
                                    handlePwdChange={handlePwdChange}
                                    submitPassword={submitPassword}
                                    showOldPwd={showOldPwd}
                                    setShowOldPwd={setShowOldPwd}
                                    showNewPwd={showNewPwd}
                                    setShowNewPwd={setShowNewPwd}
                                    showConfirmPwd={showConfirmPwd}
                                    setShowConfirmPwd={setShowConfirmPwd}
                                    pwdLoading={pwdLoading}
                                    getInitials={getInitials}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};



export default Dashboard;