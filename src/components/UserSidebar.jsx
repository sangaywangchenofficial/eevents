// UserSidebar.jsx - Complete User Sidebar
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    MdDashboard,
    MdEvent,
    MdCalendarToday,
    MdFavorite,
    MdPerson,
    MdSettings,
    MdHelp,
    MdKeyboardArrowDown,
    MdEventAvailable,
    MdHistory,
    MdPayment,
    MdRateReview,
    MdNotifications,
    MdShoppingCart,
    MdStar,
    MdLocalOffer,
    MdChat,
    MdSecurity,
    MdLogout
} from 'react-icons/md';
import {
    FaTicketAlt,
    FaUserCircle,
    FaHeart,
    FaCog,
    FaSignOutAlt,
    FaShoppingCart,
    FaCalendarCheck,
    FaGift,
    FaCreditCard
} from 'react-icons/fa';
import { IoMdCalendar, IoMdSearch } from 'react-icons/io';
import { toast } from 'react-toastify';

const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper function to check if a route is currently active
    const isActive = (path) => location.pathname === path;

    // Shared active and inactive style variables for menu buttons
    const activeClass = "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40";
    const inactiveClass = "text-stone-400 hover:bg-stone-800/60 hover:text-purple-400 transition-all duration-300";

    // Managed multi-dropdown open/close visibility tracking state states
    const [dropdownMenus, setDropdownMenus] = useState({
        events: false,
        bookings: false,
        account: false,
        payments: false
    });

    // State for badge counts
    const [cartCount, setCartCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    const toggleDropdownMenu = (menu) => {
        setDropdownMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    // Load badge counts (mock data - replace with API calls)
    useEffect(() => {
        // Simulate fetching counts
        setCartCount(3);
        setFavoritesCount(5);
        setNotificationCount(2);
    }, []);

    // Handle logout
    const handleLogout = () => {
        // Clear all user data
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('adminUser');

        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-stone-800/80 p-5 flex flex-col justify-between sticky top-0 overflow-y-auto">
            <div>

                {/* Main Brand Logo Area */}
                <div className="flex items-center space-x-3 mb-8 px-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                        <FaUserCircle className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-stone-100 tracking-wide leading-none">eEvents</h1>
                        <span className="text-[10px] text-purple-400/80 font-medium uppercase tracking-widest mt-1 block">User Panel</span>
                    </div>
                </div>

                {/* Navigation Links List */}
                <nav className="space-y-1.5 font-medium text-sm">

                    {/* Dashboard Link */}
                    <Link
                        to="/dashboard"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard') ? activeClass : inactiveClass}`}
                    >
                        <MdDashboard className="text-xl" />
                        <span>Dashboard</span>
                    </Link>

                    {/* Events Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('events')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.events ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdEvent className="text-xl" />
                                <span>Events</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.events ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu options drop list items container */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.events ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: All Events */}
                                <Link
                                    to="/events"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/events') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdEventAvailable className="text-base" />
                                    <span>All Events</span>
                                </Link>

                                {/* Sub item: Upcoming Events */}
                                <Link
                                    to="/upcoming-events"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/upcoming-events') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoMdCalendar className="text-base" />
                                    <span>Upcoming Events</span>
                                </Link>

                                {/* Sub item: Search Events */}
                                <Link
                                    to="/search-events"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/search-events') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoMdSearch className="text-base" />
                                    <span>Search Events</span>
                                </Link>

                                {/* Sub item: Categories */}
                                <Link
                                    to="/categories"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/categories') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdLocalOffer className="text-base" />
                                    <span>Categories</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* My Bookings Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('bookings')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.bookings ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdCalendarToday className="text-xl" />
                                <span>My Bookings</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.bookings ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu list container for Bookings items */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.bookings ? 'max-h-80 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: All Bookings */}
                                <Link
                                    to="/my-bookings"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/my-bookings') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaTicketAlt className="text-base" />
                                    <span>All Bookings</span>
                                </Link>

                                {/* Sub item: Active Bookings */}
                                <Link
                                    to="/active-bookings"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/active-bookings') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaCalendarCheck className="text-base" />
                                    <span>Active Bookings</span>
                                </Link>

                                {/* Sub item: Booking History */}
                                <Link
                                    to="/booking-history"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/booking-history') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdHistory className="text-base" />
                                    <span>Booking History</span>
                                </Link>

                                {/* Sub item: Upcoming Bookings */}
                                <Link
                                    to="/upcoming-bookings"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/upcoming-bookings') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoMdCalendar className="text-base" />
                                    <span>Upcoming Bookings</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Cart Link */}
                    <Link
                        to="/cart"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/cart') ? activeClass : inactiveClass}`}
                    >
                        <MdShoppingCart className="text-xl" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span className="ml-auto bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Favorites Link */}
                    <Link
                        to="/favorites"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/favorites') ? activeClass : inactiveClass}`}
                    >
                        <MdFavorite className="text-xl" />
                        <span>Favorites</span>
                        {favoritesCount > 0 && (
                            <span className="ml-auto bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                {favoritesCount}
                            </span>
                        )}
                    </Link>

                    {/* Payments Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('payments')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.payments ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdPayment className="text-xl" />
                                <span>Payments</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.payments ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu list container for Payments items */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.payments ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: Payment History */}
                                <Link
                                    to="/payment-history"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/payment-history') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdHistory className="text-base" />
                                    <span>Payment History</span>
                                </Link>

                                {/* Sub item: Payment Methods */}
                                <Link
                                    to="/payment-methods"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/payment-methods') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaCreditCard className="text-base" />
                                    <span>Payment Methods</span>
                                </Link>

                                {/* Sub item: Invoices */}
                                <Link
                                    to="/invoices"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/invoices') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaGift className="text-base" />
                                    <span>Invoices</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Link */}
                    <Link
                        to="/my-reviews"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/my-reviews') ? activeClass : inactiveClass}`}
                    >
                        <MdRateReview className="text-xl" />
                        <span>My Reviews</span>
                    </Link>

                    {/* Account Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('account')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.account ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdPerson className="text-xl" />
                                <span>Account</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.account ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu list container for Account items */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.account ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: Profile Settings */}
                                <Link
                                    to="/profile"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/profile') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaUserCircle className="text-base" />
                                    <span>Profile Settings</span>
                                </Link>

                                {/* Sub item: Account Settings */}
                                <Link
                                    to="/account-settings"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/account-settings') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <FaCog className="text-base" />
                                    <span>Account Settings</span>
                                </Link>

                                {/* Sub item: Notifications */}
                                <Link
                                    to="/notifications"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/notifications') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdNotifications className="text-base" />
                                    <span>Notifications</span>
                                    {notificationCount > 0 && (
                                        <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Sub item: Security */}
                                <Link
                                    to="/security"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/security') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <MdSecurity className="text-base" />
                                    <span>Security</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Help & Support Link */}
                    <Link
                        to="/help"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/help') ? activeClass : inactiveClass}`}
                    >
                        <MdHelp className="text-xl" />
                        <span>Help & Support</span>
                    </Link>

                </nav>
            </div>

            {/* Footer User Session Meta Area */}
            <div className="pt-4 border-t border-stone-800/60 space-y-2">
                <div className="flex items-center justify-between px-2 text-xs text-stone-500">
                    <span className="truncate">Active Session</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all duration-300 text-sm font-medium border border-rose-500/20"
                >
                    <FaSignOutAlt className="text-base" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;