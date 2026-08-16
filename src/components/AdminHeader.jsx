import React, { useState } from 'react';
import { FaBars, FaBell, FaSignOutAlt, FaUserCircle, FaChevronDown, FaChevronLeft, FaChevronRight, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const AdminHeader = ({
    onSidebarToggle,
    toggleSidebar,
    sideBarShow,
    isDarkMode,
    toggleDarkMode
}) => {
    // Local tracking states for dropdown visibility control panels
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Handle logout when user click on logout button
    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/admin-login');
    };

    // Toggle sidebar when user click on toggle button.
    const handleSidebarToggle = () => {
        if (toggleSidebar && typeof toggleSidebar === 'function') {
            toggleSidebar();
        } else if (onSidebarToggle && typeof onSidebarToggle === 'function') {
            onSidebarToggle();
        } else {
            console.warn('No sidebar toggle function provided');
        }
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Sample notifications data
    const notifications = [
        { id: 1, text: 'New event registration received', time: '2 mins ago', unread: true },
        { id: 2, text: 'Payment confirmed for Event #1234', time: '15 mins ago', unread: true },
        { id: 3, text: 'System maintenance scheduled', time: '1 hour ago', unread: false },
        { id: 4, text: 'New user account created', time: '3 hours ago', unread: false },
    ];

    return (
        <header className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-stone-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 select-none transition-colors duration-300">

            {/* Toggle Sidebar Button - when user click on this button sidebar will open and close */}
            <button
                onClick={toggleSidebar}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-lg z-40 transition-all duration-300 shadow-lg shadow-purple-950/30 hidden lg:block"
                aria-label="Toggle Sidebar"
            >
                {sideBarShow ? <FaChevronLeft className="text-base" /> : <FaChevronRight className="text-base" />}
            </button>

            {/* LEFT SIDE: TOGGLER & SYSTEM BRAND NAME */}
            <div className="flex items-center space-x-4 ml-0 lg:ml-12">
                {/* Navbar Toggler Icon - Visible only on small/medium screens */}
                <button
                    type="button"
                    onClick={handleSidebarToggle}
                    className="lg:hidden text-gray-500 dark:text-stone-400 hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg bg-gray-100 dark:bg-stone-900/50 hover:bg-gray-200 dark:hover:bg-stone-900 border border-gray-200 dark:border-stone-800/60 transition-all duration-200 active:scale-95"
                    aria-label="Toggle Sidebar"
                >
                    <FaBars className="text-lg" />
                </button>

                {/* System Name Brand Indicator */}
                <div className="hidden sm:block flex items-center gap-2">
                    <img src={logo} alt="eEvents Logo" className="h-12 w-auto object-contain" />
                    <span className="font-serif font-bold text-gray-900 dark:text-stone-100 text-lg tracking-wide hidden">
                        eEvents <span className="text-purple-600 dark:text-purple-400">Admin</span>
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: UTILITIES - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center space-x-3 relative">
                
                {/* THEME TOGGLE */}
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-stone-800 bg-gray-50 dark:bg-stone-950 text-gray-500 dark:text-stone-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-gray-300 dark:hover:border-stone-700 transition-all duration-200"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
                </button>

                {/* NOTIFICATIONS BELL ICON WITH ALERTS BADGE */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsProfileOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all duration-200 relative ${isNotificationsOpen
                            ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-gray-500 dark:text-stone-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-gray-300 dark:hover:border-stone-700'
                            }`}
                    >
                        <FaBell className="text-base" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-950 animate-pulse" />
                    </button>

                    {/* NOTIFICATIONS DROPDOWN */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-stone-800 rounded-2xl shadow-2xl p-4 animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-stone-800/60 mb-2">
                                <h3 className="text-xs font-semibold text-gray-700 dark:text-stone-300 uppercase tracking-wider">Notifications</h3>
                                <button className="text-[11px] text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline">Mark all read</button>
                            </div>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {notifications.map((n) => (
                                    <div key={n.id} className={`p-2.5 rounded-xl text-left transition-colors duration-200 cursor-pointer ${n.unread ? 'bg-gray-50 dark:bg-stone-950/60 hover:bg-gray-100 dark:hover:bg-stone-950' : 'hover:bg-gray-50 dark:hover:bg-stone-950/40'}`}>
                                        <p className={`text-xs ${n.unread ? 'text-gray-900 dark:text-stone-200 font-medium' : 'text-gray-500 dark:text-stone-400'}`}>{n.text}</p>
                                        <span className="text-[10px] text-gray-400 dark:text-stone-500 block mt-1">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SEPARATOR */}
                <div className="h-6 w-px bg-gray-200 dark:bg-stone-800/80 mx-1" />

                {/* USER PROFILE */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationsOpen(false);
                        }}
                        className={`flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${isProfileOpen
                            ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-gray-500 dark:text-stone-400 hover:text-gray-800 dark:hover:text-stone-200 hover:border-gray-300 dark:hover:border-stone-700'
                            }`}
                    >
                        <FaUserCircle className="text-2xl text-gray-400 dark:text-stone-400 group-hover:text-gray-600 dark:group-hover:text-stone-200" />
                        <div className="hidden md:block text-left leading-tight">
                            <p className="text-xs font-semibold text-gray-800 dark:text-stone-300">Admin</p>
                            <span className="text-[10px] text-gray-500 dark:text-stone-500 block">Root Access</span>
                        </div>
                        <FaChevronDown className={`text-[10px] text-gray-500 dark:text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''}`} />
                    </button>

                    {/* PROFILE DROPDOWN */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-stone-800/60 bg-gray-50 dark:bg-stone-950/40">
                                <p className="text-[10px] text-gray-500 dark:text-stone-500 font-semibold uppercase tracking-wider">Logged in as</p>
                                <p className="text-xs text-gray-800 dark:text-stone-300 truncate">admin@eevents.com</p>
                            </div>
                            <a href="#profile" className="flex items-center space-x-2.5 px-4 py-3 text-xs text-gray-600 dark:text-stone-400 hover:bg-gray-50 dark:hover:bg-stone-950 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                <FaUserCircle className="text-sm" />
                                <span>My Account</span>
                            </a>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-2.5 px-4 py-3 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-gray-100 dark:border-stone-800/40 text-left font-medium"
                            >
                                <FaSignOutAlt className="text-sm" />
                                <span>Logout Session</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU OVERLAY - Appears when hamburger is clicked on small screens */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-stone-800/80 shadow-2xl p-4 animate-slide-down">
                    <div className="flex flex-col space-y-3">
                        
                        {/* THEME TOGGLE MOBILE */}
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-stone-800 bg-gray-50 dark:bg-stone-900/50 text-gray-600 dark:text-stone-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
                                <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                        </button>

                        {/* Notification item */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNotificationsOpen(!isNotificationsOpen);
                                    setIsProfileOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${isNotificationsOpen
                                    ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-gray-50 dark:bg-stone-900/50 border-gray-200 dark:border-stone-800 text-gray-600 dark:text-stone-400 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaBell className="text-base" />
                                    <span className="text-sm font-medium">Notifications</span>
                                </div>
                                <span className="w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-950 animate-pulse" />
                            </button>

                            {/* Mobile notifications dropdown */}
                            {isNotificationsOpen && (
                                <div className="mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-stone-800 rounded-xl p-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-stone-800/60 mb-2">
                                        <h3 className="text-xs font-semibold text-gray-800 dark:text-stone-300 uppercase tracking-wider">Notifications</h3>
                                        <button className="text-[11px] text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {notifications.slice(0, 3).map((n) => (
                                            <div key={n.id} className={`p-2 rounded-lg text-left ${n.unread ? 'bg-gray-50 dark:bg-stone-950/60' : ''}`}>
                                                <p className={`text-xs ${n.unread ? 'text-gray-900 dark:text-stone-200 font-medium' : 'text-gray-500 dark:text-stone-400'}`}>{n.text}</p>
                                                <span className="text-[10px] text-gray-400 dark:text-stone-500 block mt-1">{n.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile & Logout item */}
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsNotificationsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${isProfileOpen
                                    ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-gray-50 dark:bg-stone-900/50 border-gray-200 dark:border-stone-800 text-gray-600 dark:text-stone-400 hover:text-gray-800 dark:hover:text-stone-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaUserCircle className="text-xl" />
                                    <span className="text-sm font-medium">Profile</span>
                                </div>
                                <FaChevronDown className={`text-[10px] text-gray-400 dark:text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''}`} />
                            </button>

                            {/* Mobile profile dropdown */}
                            {isProfileOpen && (
                                <div className="mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-stone-800 rounded-xl overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-stone-800/60 bg-gray-50 dark:bg-stone-950/40">
                                        <p className="text-[10px] text-gray-500 dark:text-stone-500 font-semibold uppercase tracking-wider">Logged in as</p>
                                        <p className="text-xs text-gray-800 dark:text-stone-300 truncate">admin@eevents.com</p>
                                    </div>
                                    <a href="#profile" className="flex items-center space-x-2.5 px-4 py-3 text-xs text-gray-600 dark:text-stone-400 hover:bg-gray-50 dark:hover:bg-stone-950 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                        <FaUserCircle className="text-sm" />
                                        <span>My Account</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2.5 px-4 py-3 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-gray-100 dark:border-stone-800/40 text-left font-medium"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                        <span>Logout Session</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
};

export default AdminHeader;