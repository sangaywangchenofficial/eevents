import React, { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    UserCircleIcon,
    TicketIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    HeartIcon,
    ClockIcon,
    MapPinIcon,
    CheckCircleIcon,
    XCircleIcon,
    Cog6ToothIcon,
    ShoppingCartIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    PencilIcon,
    EnvelopeIcon,
    PhoneIcon,
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ChevronRightIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { getUserId, getUser, clearAuth } from '../utils/auth';
import { api } from '../utils/api';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Cog6ToothIcon },
    { id: 'bookings', label: 'Bookings', icon: TicketIcon },
    { id: 'cart', label: 'Cart', icon: ShoppingCartIcon },
    { id: 'favourites', label: 'Favourites', icon: HeartIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
];

const Dashboard = () => {
    const userId = getUserId();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingEvents: 0,
        pastEvents: 0,
        totalSpent: 0,
        favouritTIXELO: 0,
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

            const cartData = cartRes.status === 'fulfilled'
                ? (Array.isArray(cartRes.value.data) ? cartRes.value.data : [])
                : [];
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
                favouritTIXELO: favData.length,
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
                <div className="min-h-screen bg-[#FDFDF7] py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#29BBA3]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 bg-[#29BBA3] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="mt-6 text-[#4A5C57] font-medium">Loading your dashboard...</p>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            <div className="min-h-screen bg-[#FDFDF7] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar */}
                    <div className="lg:w-1/4 flex-shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-[#E6E1D8] p-6 sticky top-24">
                            {/* User Info */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-teal-900/10 mb-4 ring-4 ring-[#E6F9F6]">
                                    {getInitials()}
                                </div>
                                <h2 className="text-xl font-bold text-[#1E352F]">{user?.first_name || 'User'} {user?.last_name || ''}</h2>
                                <p className="text-sm text-[#66756F] mt-1 flex items-center justify-center gap-1">
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
                                                ? 'bg-[#E6F9F6] text-[#1E8B7A] translate-x-1'
                                                : 'text-[#66756F] hover:bg-[#F4F3EC] hover:text-[#1E8B7A]'
                                                }`}
                                        >
                                            <Icon className={`h-5 w-5 ${isActive ? 'text-[#1E8B7A]' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-[#E6E1D8]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
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
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-bold mb-2 text-white">Welcome back to your Dashboard! 🚀</h1>
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

                        <div className="bg-white rounded-3xl shadow-sm border border-[#E6E1D8] p-6 sm:p-8">
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

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        gray: { bg: 'bg-gray-50', text: 'text-gray-600' },
        purple: { bg: 'bg-[#E6F9F6]', text: 'text-[#1E8B7A]' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    };
    const c = colorMap[color] || colorMap.blue;
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
                    <p className={`text-xl sm:text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${c.bg}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.text}`} />
                </div>
            </div>
        </div>
    );
};

const OverviewTab = ({ bookings, user, navigate, formatDate, formatPrice, stats, setActiveTab }) => {
    const recentBookings = bookings.slice(0, 5);
    const now = new Date();
    const upcoming = bookings
        .filter(b => new Date(b.event?.event_date) > now)
        .sort((a, b) => new Date(a.event?.event_date) - new Date(b.event?.event_date))
        .slice(0, 3);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <TicketIcon className="h-5 w-5 text-[#29BBA3]" /> Recent Bookings
                    </h2>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-sm text-[#1E8B7A] hover:text-[#29BBA3] font-medium flex items-center gap-1"
                    >
                        View All <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {recentBookings.length > 0 ? recentBookings.map((b, i) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-xl border border-gray-100 hover:bg-[#F4F3EC] cursor-pointer transition-all flex items-start justify-between gap-4"
                            onClick={() => navigate(`/my-booking-details/${b.id}`)}
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#1E352F] truncate">{b.event?.event_name}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" /> {formatDate(b.event?.event_date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPinIcon className="h-3 w-3" /> {b.event?.event_location || 'Online'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className="text-sm font-bold text-[#F0A71E]">${formatPrice(b.total_price)}</span>
                                <div className="text-xs text-gray-400 mt-1">{b.quantity} ticket{b.quantity > 1 ? 's' : ''}</div>
                                <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${b.is_booked ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {b.is_booked ? 'Confirmed' : 'Pending'}
                                </span>
                            </div>
                        </motion.div>
                    )) : (
                        <EmptyState icon={TicketIcon} title="No bookings yet" desc="Book your first event today!"
                            actionLabel="Browse Events" onAction={() => navigate('/events')} />
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-[#F4F3EC] rounded-2xl p-5 border border-[#E6E1D8]">
                    <h3 className="font-bold text-[#1E352F] mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-green-600" /> Upcoming Events
                    </h3>
                    <div className="space-y-2">
                        {upcoming.length > 0 ? upcoming.map((e, i) => (
                            <motion.div
                                key={e.id}
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="p-3 bg-white rounded-xl border border-[#E6E1D8] cursor-pointer hover:shadow transition-all"
                                onClick={() => navigate(`/event/${e.event?.id}`)}
                            >
                                <p className="font-medium text-sm text-gray-800 truncate">{e.event?.event_name}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" /> {formatDate(e.event?.event_date)}
                                </p>
                            </motion.div>
                        )) : (
                            <p className="text-gray-400 text-sm">No upcoming events</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <QuickAction onClick={() => setActiveTab('bookings')} label="View All Bookings" icon={TicketIcon} primary />
                        <QuickAction onClick={() => setActiveTab('cart')} label={`My Cart (${stats.cartItems})`} icon={ShoppingCartIcon} />
                        <QuickAction onClick={() => setActiveTab('favourites')} label={`Favourites (${stats.favouritTIXELO})`} icon={HeartIcon} />
                        <QuickAction onClick={() => setActiveTab('profile')} label="Edit Profile" icon={UserCircleIcon} />
                        <QuickAction onClick={() => navigate('/events')} label="Browse Events" icon={CalendarIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickAction = ({ onClick, label, icon: Icon, primary }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${primary
            ? 'bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white shadow-md hover:shadow-lg'
            : 'border-2 border-gray-200 text-gray-700 hover:border-[#29BBA3] hover:text-[#1E8B7A] hover:bg-[#E6F9F6]'
            }`}
    >
        <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
        <ChevronRightIcon className="h-4 w-4" />
    </button>
);

const BookingsTab = ({ bookings, navigate, formatDate, formatPrice, loadAll }) => {
    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.post(`/cancel-booking/${id}/`);
            toast.success('Booking cancelled');
            await loadAll();
        } catch (err) {
            toast.error(err?.message || 'Failed to cancel');
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">All Bookings ({bookings.length})</h2>
                <button onClick={() => navigate('/events')}
                    className="text-sm font-medium text-[#1E8B7A] hover:text-[#29BBA3] flex items-center gap-1">
                    Browse Events <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>

            {bookings.length === 0 ? (
                <EmptyState icon={TicketIcon} title="No bookings" desc="Explore our events and book your first ticket!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b.id} className="md:flex bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="md:w-44 h-44 md:h-auto bg-gradient-to-br from-[#1E352F] to-[#1E8B7A] relative flex-shrink-0">
                                {b.event?.event_image && (
                                    <img src={b.event.event_image} alt="" className="w-full h-full object-cover opacity-95" />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${b.is_booked ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                        }`}>
                                        {b.is_booked ? 'Confirmed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-5 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#1E352F] text-lg">{b.event?.event_name}</h3>
                                    <p className="text-sm text-[#66756F] mt-1 line-clamp-2">{b.event?.event_description}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {formatDate(b.event?.event_date)} {b.event?.event_time || ''}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {b.event?.event_location || 'Online'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TicketIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {b.quantity} ticket{b.quantity > 1 ? 's' : ''}
                                        </span>
                                        <span className="flex items-center gap-1 font-bold text-[#F0A71E]">
                                            <CurrencyDollarIcon className="h-3.5 w-3.5" />
                                            ${formatPrice(b.total_price)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button onClick={() => navigate(`/my-booking-details/${b.id}`)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">
                                        View Details
                                    </button>
                                    <button onClick={() => handleCancel(b.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CartTab = ({ cartItems, cartTotal, updateCartQty, removeCartItem, updatingItemId, navigate, userId, formatDate, formatPrice }) => {
    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/payment', {
            state: { cartItems, totalAmount: parseFloat(cartTotal.toFixed(2)), userId }
        });
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Shopping Cart ({cartItems.length})</h2>
            </div>

            {cartItems.length === 0 ? (
                <EmptyState icon={ShoppingCartIcon} title="Your cart is empty"
                    desc="Browse events and add some tickets!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {cartItems.map((it) => {
                            const price = parseFloat(it.event?.event_price) || 0;
                            const qty = parseInt(it.quantity) || 0;
                            const sub = price * qty;
                            return (
                                <div key={it.id} className={`flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-all ${updatingItemId === it.id ? 'opacity-60' : ''
                                    }`}>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#E6F9F6] to-[#C8EDE8] overflow-hidden flex-shrink-0">
                                        {it.event?.event_image && (
                                            <img src={it.event.event_image} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 truncate">{it.event?.event_name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" /> {formatDate(it.event?.event_date)}
                                            </p>
                                            <p className="text-sm font-bold text-[#F0A71E] mt-1">${formatPrice(price)} each</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2 bg-[#F4F3EC] rounded-lg p-1">
                                                <button
                                                    onClick={() => updateCartQty(it.id, qty - 1, it)}
                                                    disabled={updatingItemId === it.id || qty <= 1}
                                                    className="w-7 h-7 rounded-md bg-white flex items-center justify-center hover:bg-[#E6E1D8] text-[#1E8B7A] disabled:opacity-40"
                                                >
                                                    <MinusIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-[#1E352F]">{qty}</span>
                                                <button
                                                    onClick={() => updateCartQty(it.id, qty + 1, it)}
                                                    disabled={updatingItemId === it.id}
                                                    className="w-7 h-7 rounded-md bg-white flex items-center justify-center hover:bg-[#E6E1D8] text-[#1E8B7A] disabled:opacity-40"
                                                >
                                                    <PlusIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-800">${formatPrice(sub)}</span>
                                                <button
                                                    onClick={() => removeCartItem(it.id)}
                                                    disabled={updatingItemId === it.id}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gradient-to-br from-[#F4F3EC] to-[#FDFDF7] rounded-2xl p-6 border border-[#E6E1D8] h-fit sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[#66756F]">
                                <span>Items ({cartItems.length})</span>
                                <span>${formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-[#66756F]">
                                <span>Service Fee</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                        <div className="border-t border-[#E6E1D8] mt-4 pt-4 flex justify-between font-bold text-lg text-gray-800">
                            <span>Total</span>
                            <span className="text-[#F0A71E]">${formatPrice(cartTotal)}</span>
                        </div>
                        <button onClick={handleCheckout}
                            disabled={cartTotal <= 0}
                            className="w-full mt-5 py-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const FavouritesTab = ({ favourites, navigate, formatDate, removeFavourite, formatPrice }) => {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">My Favourites ({favourites.length})</h2>
            {favourites.length === 0 ? (
                <EmptyState icon={HeartIcon} title="No favourites yet"
                    desc="Like an event? Save it here for later!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favourites.map((f) => (
                        <div key={f.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                            <div className="h-40 bg-gradient-to-br from-[#E6F9F6] to-[#C8EDE8] relative cursor-pointer"
                                onClick={() => navigate(`/event/${f.event?.id}`)}>
                                {f.event?.event_image && (
                                    <img src={f.event.event_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFavourite(f.event?.id); }}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white transition-all shadow"
                                >
                                    <HeartIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 truncate">{f.event?.event_name}</h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" /> {formatDate(f.event?.event_date)}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-[#F0A71E]">${formatPrice(f.event?.event_price)}</span>
                                    <button onClick={() => navigate(`/event/${f.event?.id}`)}
                                        className="px-3 py-1.5 text-xs font-semibold bg-[#E6F9F6] text-[#1E8B7A] rounded-lg hover:bg-[#C8EDE8] transition-all">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProfileTab = ({
    user, isEditing, setIsEditing, editData, handleEditChange, saveProfile,
    formatDateTime, pwdData, handlePwdChange, submitPassword,
    showOldPwd, setShowOldPwd, showNewPwd, setShowNewPwd,
    showConfirmPwd, setShowConfirmPwd, pwdLoading, getInitials
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#1E352F] via-[#1E8B7A] to-[#29BBA3] px-6 py-5">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center text-4xl font-bold text-white">
                            {getInitials()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <p className="text-teal-100 flex items-center gap-2 text-sm mt-1">
                                <EnvelopeIcon className="h-4 w-4" /> {user?.email}
                            </p>
                            <p className="text-teal-100 flex items-center gap-2 text-sm">
                                <PhoneIcon className="h-4 w-4" /> {user?.phone_number}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {!isEditing ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ProfileField label="First Name" value={user?.first_name} icon={UserIcon} color="blue" />
                                <ProfileField label="Last Name" value={user?.last_name} icon={UserIcon} color="blue" />
                                <ProfileField label="Email" value={user?.email} icon={EnvelopeIcon} color="purple" />
                                <ProfileField label="Phone Number" value={user?.phone_number} icon={PhoneIcon} color="purple" />
                                <ProfileField label="Member Since" value={formatDateTime(user?.register_date)} icon={CalendarIcon} color="green" full />
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <PencilIcon className="h-4 w-4" /> Edit Profile
                            </button>
                        </>
                    ) : (
                        <form onSubmit={saveProfile}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                                    <input name="first_name" value={editData.first_name} onChange={handleEditChange} required
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                                    <input name="last_name" value={editData.last_name} onChange={handleEditChange} required
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-6">
                                <button type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                                    <CheckCircleIcon className="h-4 w-4" /> Save Changes
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <XCircleIcon className="h-4 w-4" /> Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <LockClosedIcon className="h-5 w-5 text-[#29BBA3]" />
                    <h3 className="font-bold text-gray-800">Change Password</h3>
                </div>
                <form onSubmit={submitPassword} className="p-6 space-y-4">
                    <PwdField label="Current Password" name="old_password" value={pwdData.old_password}
                        onChange={handlePwdChange} show={showOldPwd} onToggle={() => setShowOldPwd(!showOldPwd)} />
                    <PwdField label="New Password" name="new_password" value={pwdData.new_password}
                        onChange={handlePwdChange} show={showNewPwd} onToggle={() => setShowNewPwd(!showNewPwd)} />
                    <PwdField label="Confirm New Password" name="confirm_password" value={pwdData.confirm_password}
                        onChange={handlePwdChange} show={showConfirmPwd} onToggle={() => setShowConfirmPwd(!showConfirmPwd)} />
                    <button type="submit" disabled={pwdLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60">
                        {pwdLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    </div>
);

const ProfileField = ({ label, value, icon: Icon, color, full }) => {
    const c = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-[#E6F9F6] text-[#1E8B7A]',
        green: 'bg-green-100 text-green-600',
    }[color] || 'bg-gray-100 text-gray-600';
    return (
        <div className={`bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] rounded-xl p-4 border border-gray-100 ${full ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${c}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
            </div>
            <p className="text-base font-semibold text-gray-800 break-all">{value || 'N/A'}</p>
        </div>
    );
};

const PwdField = ({ label, name, value, onChange, show, onToggle }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                name={name} value={value} onChange={onChange} required
                className="w-full pl-4 pr-11 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none"
                placeholder="••••••••"
            />
            <button type="button" onClick={onToggle}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1E8B7A]">
                {show ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
        </div>
    </div>
);

const EmptyState = ({ icon: Icon, title, desc, actionLabel, onAction }) => (
    <div className="text-center py-12 px-4 bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] rounded-2xl">
        <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4">
            <Icon className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-gray-700 font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 mt-1">{desc}</p>
        {actionLabel && (
            <button onClick={onAction}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-lg font-medium hover:shadow-md transition-all">
                {actionLabel}
            </button>
        )}
    </div>
);

export default Dashboard;