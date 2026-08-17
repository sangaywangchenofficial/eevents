import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaBell, FaSignOutAlt, FaUserCircle, FaChevronDown, FaChevronLeft, FaChevronRight, FaMoon, FaSun, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({
    onSidebarToggle,
    toggleSidebar,
    sideBarShow,
    isDarkMode,
    toggleDarkMode,
    newBookings = 0,
    notifications = [],
    unreadCount = 0,
    showNotificationBadge = false,
    hasUnreadNotifications = false,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
}) => {
    // Local tracking states for dropdown visibility control panels
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [localUnreadCount, setLocalUnreadCount] = useState(0);
    const navigate = useNavigate();
    const notificationRef = useRef(null);

    // Update local unread count when prop changes
    useEffect(() => {
        setLocalUnreadCount(unreadCount);
    }, [unreadCount]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // Handle mark as read
    const handleMarkAsRead = (id) => {
        if (markNotificationAsRead) {
            markNotificationAsRead(id);
            // Update local count
            setLocalUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = () => {
        if (markAllNotificationsAsRead) {
            markAllNotificationsAsRead();
            setLocalUnreadCount(0);
            // Close dropdown after marking
            setIsNotificationsOpen(false);
        }
    };

    // Handle clear all
    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            if (clearAllNotifications) {
                clearAllNotifications();
                setLocalUnreadCount(0);
                // Close dropdown after clearing
                setIsNotificationsOpen(false);
            }
        }
    };

    // Get the count to display on bell
    const getBellCount = () => {
        // Show newBookings count if greater than 0, otherwise show unread count
        if (newBookings > 0) return newBookings;
        if (localUnreadCount > 0) return localUnreadCount;
        return 0;
    };

    const bellCount = getBellCount();

    // Format time
    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <header className="w-full bg-[#FDFDF7] dark:bg-zinc-950 border-b border-[#E6E1D8] dark:border-stone-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 select-none transition-colors duration-300">

            {/* Toggle Sidebar Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white p-2.5 rounded-lg z-40 transition-all duration-300 shadow-lg shadow-teal-900/30 hidden lg:block"
                aria-label="Toggle Sidebar"
            >
                {sideBarShow ? <FaChevronLeft className="text-base" /> : <FaChevronRight className="text-base" />}
            </button>

            {/* LEFT SIDE: TOGGLER & SYSTEM BRAND NAME */}
            <div className="flex items-center space-x-4 ml-0 lg:ml-12">
                <button
                    type="button"
                    onClick={handleSidebarToggle}
                    className="lg:hidden text-[#4A5C57] dark:text-stone-400 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] p-2 rounded-lg bg-[#E6F9F6] dark:bg-stone-900/50 hover:bg-[#C8EDE8] dark:hover:bg-stone-900 border border-[#C8EDE8] dark:border-stone-800/60 transition-all duration-200 active:scale-95"
                    aria-label="Toggle Sidebar"
                >
                    <FaBars className="text-lg" />
                </button>

                <div className="hidden sm:flex items-center gap-2">
                    {/* Ticket icon badge */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] flex items-center justify-center shadow-md flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l1.5-1.5a2.5 2.5 0 010-3.54L6 3l15 15-1.5 1.5a2.5 2.5 0 01-3.54 0L15 18H9l-1.5 1.5a2.5 2.5 0 01-3.54 0L3 18V9z" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className="leading-none">
                        <span className="font-black text-[#1E352F] dark:text-white text-xl tracking-widest uppercase">
                            TIX<span className="text-[#29BBA3] dark:text-[#29BBA3]">ELO</span>
                        </span>
                        <p className="text-[9px] text-[#66756F] dark:text-stone-500 tracking-wide font-medium leading-none mt-0.5">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: UTILITIES */}
            <div className="hidden md:flex items-center space-x-3 relative">

                {/* THEME TOGGLE */}
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-xl border border-[#E6E1D8] dark:border-stone-800 bg-[#F4F3EC] dark:bg-stone-950 text-[#66756F] dark:text-stone-400 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] hover:border-[#C8EDE8] dark:hover:border-stone-700 transition-all duration-200"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
                </button>

                {/* NOTIFICATIONS BELL ICON WITH COUNT */}
                <div className="relative" ref={notificationRef}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsProfileOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all duration-200 relative ${isNotificationsOpen
                            ? 'bg-[#E6F9F6] dark:bg-[#1E8B7A]/10 border-[#C8EDE8] dark:border-[#1E8B7A]/30 text-[#1E8B7A] dark:text-[#29BBA3]'
                            : 'bg-[#F4F3EC] dark:bg-stone-950 border-[#E6E1D8] dark:border-stone-800 text-[#66756F] dark:text-stone-400 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] hover:border-[#C8EDE8] dark:hover:border-stone-700'
                            }`}
                    >
                        <FaBell className="text-base" />

                        {/* Notification Badge - Shows count */}
                        {bellCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#F0A71E] text-[#1E352F] text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse">
                                {bellCount > 99 ? '99+' : bellCount}
                            </span>
                        )}
                    </button>

                    {/* NOTIFICATIONS DROPDOWN */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-[#E6E1D8] dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E1D8] dark:border-stone-800/60 bg-[#FDFDF7] dark:bg-stone-950/40">
                                <h3 className="text-xs font-bold text-[#1E352F] dark:text-stone-300 uppercase tracking-wider">
                                    Notifications
                                    {bellCount > 0 && (
                                        <span className="ml-2 text-[10px] bg-[#E6F9F6] dark:bg-[#1E8B7A]/20 text-[#1E8B7A] dark:text-[#29BBA3] px-2 py-0.5 rounded-full">
                                            {bellCount} new
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {bellCount > 0 && markAllNotificationsAsRead && (
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-[11px] text-[#29BBA3] dark:text-[#29BBA3] hover:text-[#1E8B7A] dark:hover:text-[#175f55] hover:underline flex items-center gap-1"
                                        >
                                            <FaCheck className="w-2.5 h-2.5" />
                                            Mark all read
                                        </button>
                                    )}
                                    {notifications.length > 0 && clearAllNotifications && (
                                        <button
                                            onClick={handleClearAll}
                                            className="text-[11px] text-[#66756F] dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:underline flex items-center gap-1"
                                        >
                                            <FaTrash className="w-2.5 h-2.5" />
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Notification List */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-3 border-b border-[#E6E1D8] dark:border-stone-800/40 transition-all duration-200 ${n.unread
                                                ? 'bg-white dark:bg-zinc-900 hover:bg-[#FDFDF7] dark:hover:bg-stone-800/50 cursor-pointer'
                                                : 'bg-[#FDFDF7]/50 dark:bg-stone-900/30 opacity-60'
                                                }`}
                                            onClick={() => n.unread && handleMarkAsRead(n.id)}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${n.unread ? 'text-[#1E352F] dark:text-stone-200 font-bold' : 'text-[#66756F] dark:text-stone-400'}`}>
                                                        {n.text}
                                                    </p>
                                                    <span className="text-[11px] text-[#66756F] dark:text-stone-500 block mt-1">
                                                        {n.timestamp ? formatTime(n.timestamp) : n.time || 'Just now'}
                                                    </span>
                                                </div>
                                                {n.unread && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(n.id);
                                                        }}
                                                        className="flex-shrink-0 text-[#29BBA3] dark:text-[#29BBA3] hover:text-[#1E8B7A] dark:hover:text-[#175f55] text-xs font-bold"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                                {!n.unread && (
                                                    <FaCheck className="flex-shrink-0 text-emerald-500 dark:text-emerald-400 w-3 h-3 mt-1" />
                                                )}
                                            </div>
                                            {n.count && n.count > 0 && n.unread && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[#F0A71E]/20 dark:bg-amber-500/20 text-[#F0A71E] dark:text-amber-400 text-[10px] font-bold rounded-full">
                                                    {n.count} new
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-[#FDFDF7]">
                                        <FaBell className="text-4xl text-[#C8EDE8] dark:text-stone-700 mx-auto mb-3" />
                                        <p className="text-sm text-[#4A5C57] dark:text-stone-400">No notifications</p>
                                        <p className="text-xs text-[#66756F] dark:text-stone-500 mt-1">You're all caught up!</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-2 border-t border-[#E6E1D8] dark:border-stone-800/60 bg-[#FDFDF7] dark:bg-stone-950/40 text-center">
                                    <span className="text-[10px] text-[#66756F] dark:text-stone-500">
                                        {notifications.filter(n => n.unread).length} unread · {notifications.length} total
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SEPARATOR */}
                <div className="h-6 w-px bg-[#E6E1D8] dark:bg-stone-800/80 mx-1" />

                {/* USER PROFILE */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationsOpen(false);
                        }}
                        className={`flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${isProfileOpen
                            ? 'bg-[#E6F9F6] dark:bg-[#1E8B7A]/10 border-[#C8EDE8] dark:border-[#1E8B7A]/30 text-[#1E8B7A] dark:text-[#29BBA3]'
                            : 'bg-[#F4F3EC] dark:bg-stone-950 border-[#E6E1D8] dark:border-stone-800 text-[#66756F] dark:text-stone-400 hover:text-[#1E352F] dark:hover:text-stone-200 hover:border-[#C8EDE8] dark:hover:border-stone-700'
                            }`}
                    >
                        <FaUserCircle className="text-2xl text-[#66756F] dark:text-stone-400" />
                        <div className="hidden md:block text-left leading-tight">
                            <p className="text-xs font-bold text-[#1E352F] dark:text-stone-300">Admin</p>
                            <span className="text-[10px] text-[#66756F] dark:text-stone-500 block">Root Access</span>
                        </div>
                        <FaChevronDown className={`text-[10px] text-[#66756F] dark:text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#1E8B7A] dark:text-[#29BBA3]' : ''}`} />
                    </button>

                    {/* PROFILE DROPDOWN */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-[#E6E1D8] dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                            <div className="px-4 py-2.5 border-b border-[#E6E1D8] dark:border-stone-800/60 bg-[#FDFDF7] dark:bg-stone-950/40">
                                <p className="text-[10px] text-[#66756F] dark:text-stone-500 font-bold uppercase tracking-wider">Logged in as</p>
                                <p className="text-xs text-[#1E352F] dark:text-stone-300 truncate">admin@tixelo.com</p>
                            </div>
                            <a href="#profile" className="flex items-center space-x-2.5 px-4 py-3 text-xs text-[#4A5C57] dark:text-stone-400 hover:bg-[#FDFDF7] dark:hover:bg-stone-950 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] transition-colors">
                                <FaUserCircle className="text-sm" />
                                <span>My Account</span>
                            </a>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-2.5 px-4 py-3 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-[#E6E1D8] dark:border-stone-800/40 text-left font-bold"
                            >
                                <FaSignOutAlt className="text-sm" />
                                <span>Logout Session</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-[#E6E1D8] dark:border-stone-800/80 shadow-2xl p-4 animate-slide-down max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col space-y-3">

                        {/* THEME TOGGLE MOBILE */}
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#E6E1D8] dark:border-stone-800 bg-[#F4F3EC] dark:bg-stone-900/50 text-[#66756F] dark:text-stone-400 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] transition-all duration-200"
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
                                    ? 'bg-[#E6F9F6] dark:bg-[#1E8B7A]/10 border-[#C8EDE8] dark:border-[#1E8B7A]/30 text-[#1E8B7A] dark:text-[#29BBA3]'
                                    : 'bg-[#FDFDF7] dark:bg-stone-900/50 border-[#E6E1D8] dark:border-stone-800 text-[#66756F] dark:text-stone-400 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3]'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaBell className="text-base" />
                                    <span className="text-sm font-medium">Notifications</span>
                                </div>
                                {bellCount > 0 && (
                                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#F0A71E] text-[#1E352F] text-[10px] font-bold rounded-full">
                                        {bellCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile notifications dropdown */}
                            {isNotificationsOpen && (
                                <div className="mt-2 bg-white dark:bg-zinc-900 border border-[#E6E1D8] dark:border-stone-800 rounded-xl p-3 max-h-60 overflow-y-auto">
                                    <div className="flex items-center justify-between pb-2 border-b border-[#E6E1D8] dark:border-stone-800/60 mb-2">
                                        <h3 className="text-xs font-bold text-[#1E352F] dark:text-stone-300 uppercase tracking-wider">
                                            Notifications
                                            {bellCount > 0 && (
                                                <span className="ml-2 text-[10px] bg-[#E6F9F6] dark:bg-[#1E8B7A]/20 text-[#1E8B7A] dark:text-[#29BBA3] px-2 py-0.5 rounded-full">
                                                    {bellCount}
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {bellCount > 0 && markAllNotificationsAsRead && (
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-[11px] text-[#29BBA3] dark:text-[#29BBA3] hover:text-[#1E8B7A] dark:hover:text-[#175f55] hover:underline"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                            {notifications.length > 0 && clearAllNotifications && (
                                                <button
                                                    onClick={handleClearAll}
                                                    className="text-[11px] text-[#66756F] dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:underline"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.slice(0, 5).map((n) => (
                                                <div
                                                    key={n.id}
                                                    className={`p-2 rounded-lg text-left ${n.unread ? 'bg-[#FDFDF7] dark:bg-stone-950/60' : ''
                                                        }`}
                                                    onClick={() => n.unread && handleMarkAsRead(n.id)}
                                                >
                                                    <p className={`text-xs ${n.unread ? 'text-[#1E352F] dark:text-stone-200 font-bold' : 'text-[#66756F] dark:text-stone-400'}`}>
                                                        {n.text}
                                                    </p>
                                                    <span className="text-[10px] text-[#66756F] dark:text-stone-500 block mt-1">
                                                        {n.timestamp ? formatTime(n.timestamp) : n.time || 'Just now'}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 bg-[#FDFDF7]">
                                                <p className="text-xs text-[#66756F] dark:text-stone-400">No notifications</p>
                                            </div>
                                        )}
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
                                    ? 'bg-[#E6F9F6] dark:bg-[#1E8B7A]/10 border-[#C8EDE8] dark:border-[#1E8B7A]/30 text-[#1E8B7A] dark:text-[#29BBA3]'
                                    : 'bg-[#FDFDF7] dark:bg-stone-900/50 border-[#E6E1D8] dark:border-stone-800 text-[#66756F] dark:text-stone-400 hover:text-[#1E352F] dark:hover:text-stone-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaUserCircle className="text-xl" />
                                    <span className="text-sm font-medium">Profile</span>
                                </div>
                                <FaChevronDown className={`text-[10px] text-[#66756F] dark:text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#1E8B7A] dark:text-[#29BBA3]' : ''}`} />
                            </button>

                            {/* Mobile profile dropdown */}
                            {isProfileOpen && (
                                <div className="mt-2 bg-white dark:bg-zinc-900 border border-[#E6E1D8] dark:border-stone-800 rounded-xl overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-[#E6E1D8] dark:border-stone-800/60 bg-[#FDFDF7] dark:bg-stone-950/40">
                                        <p className="text-[10px] text-[#66756F] dark:text-stone-500 font-bold uppercase tracking-wider">Logged in as</p>
                                        <p className="text-xs text-[#1E352F] dark:text-stone-300 truncate">admin@tixelo.com</p>
                                    </div>
                                    <a href="#profile" className="flex items-center space-x-2.5 px-4 py-3 text-xs text-[#4A5C57] dark:text-stone-400 hover:bg-[#FDFDF7] dark:hover:bg-stone-950 hover:text-[#1E8B7A] dark:hover:text-[#29BBA3] transition-colors">
                                        <FaUserCircle className="text-sm" />
                                        <span>My Account</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2.5 px-4 py-3 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-[#E6E1D8] dark:border-stone-800/40 text-left font-bold"
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