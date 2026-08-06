// UserHeader.jsx
import React, { useState, useEffect } from 'react';
import {
    FaBars,
    FaBell,
    FaSignOutAlt,
    FaUserCircle,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaTicketAlt,
    FaCalendarAlt,
    FaHeart,
    FaCog,
    FaUserFriends
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserHeader = ({
    onSidebarToggle,
    toggleSidebar,
    sideBarShow,
    userName = 'User'
}) => {
    // Local tracking states for dropdown visibility control panels
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const navigate = useNavigate();

    // Get user data from localStorage
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        // Load user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserData({
                    username: parsedUser.username || 'User',
                    email: parsedUser.email || 'user@example.com',
                    first_name: parsedUser.first_name || '',
                    last_name: parsedUser.last_name || ''
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Handle logout when user click on logout button
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('isStaff');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Toggle sidebar when user click on toggle button
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
        { id: 1, text: 'Your ticket for "Summer Music Fest" is confirmed', time: '5 mins ago', unread: true },
        { id: 2, text: 'New event "Tech Conference 2024" added near you', time: '20 mins ago', unread: true },
        { id: 3, text: 'Payment confirmed for "Food Festival"', time: '1 hour ago', unread: true },
        { id: 4, text: 'Reminder: "Jazz Night" starts in 2 hours', time: '2 hours ago', unread: false },
        { id: 5, text: 'Your favorite artist added new event', time: '5 hours ago', unread: false },
    ];

    // Mark notification as read
    const markAsRead = (id) => {
        // Update notification state here
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.info('Notification marked as read');
    };

    // Mark all as read
    const markAllAsRead = () => {
        setUnreadCount(0);
        toast.success('All notifications marked as read');
    };

    return (
        <header className="w-full bg-zinc-950 border-b border-stone-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 select-none">

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
                    className="lg:hidden text-stone-400 hover:text-purple-400 p-2 rounded-lg bg-stone-900/50 hover:bg-stone-900 border border-stone-800/60 transition-all duration-200 active:scale-95"
                    aria-label="Toggle Sidebar"
                >
                    <FaBars className="text-lg" />
                </button>

                {/* System Name Brand Indicator */}
                <div className="hidden sm:block">
                    <span className="font-serif font-bold text-stone-100 text-lg tracking-wide">
                        eEvents <span className="text-purple-400">User</span>
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: UTILITIES - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center space-x-3 relative">

                {/* NOTIFICATIONS BELL ICON WITH ALERTS BADGE */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsProfileOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all duration-200 relative ${isNotificationsOpen
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-purple-400 hover:border-stone-700'
                            }`}
                    >
                        <FaBell className="text-base" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-zinc-950">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* NOTIFICATIONS DROPDOWN */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-stone-800 rounded-2xl shadow-2xl p-4 animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-stone-800/60 mb-2">
                                <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-2.5 rounded-xl text-left transition-colors duration-200 cursor-pointer ${n.unread ? 'bg-stone-950/60 hover:bg-stone-950' : 'hover:bg-stone-950/40'}`}
                                        onClick={() => n.unread && markAsRead(n.id)}
                                    >
                                        <p className={`text-xs ${n.unread ? 'text-stone-200 font-medium' : 'text-stone-400'}`}>{n.text}</p>
                                        <span className="text-[10px] text-stone-500 block mt-1">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SEPARATOR */}
                <div className="h-6 w-px bg-stone-800/80 mx-1" />

                {/* USER PROFILE */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationsOpen(false);
                        }}
                        className={`flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${isProfileOpen
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                            }`}
                    >
                        <FaUserCircle className="text-2xl text-stone-400 group-hover:text-stone-200" />
                        <div className="hidden md:block text-left leading-tight">
                            <p className="text-xs font-semibold text-stone-300">
                                {userData.first_name || userData.username || 'User'}
                            </p>
                            <span className="text-[10px] text-stone-500 block">
                                {userData.email || 'user@example.com'}
                            </span>
                        </div>
                        <FaChevronDown className={`text-[10px] text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-purple-400' : ''}`} />
                    </button>

                    {/* PROFILE DROPDOWN */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                            <div className="px-4 py-3 border-b border-stone-800/60 bg-stone-950/40">
                                <div className="flex items-center space-x-3">
                                    <FaUserCircle className="text-3xl text-purple-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-stone-100">
                                            {userData.first_name || userData.username || 'User'}
                                        </p>
                                        <p className="text-[10px] text-stone-500 truncate">
                                            {userData.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                <a href="/dashboard" className="flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                    <FaUserCircle className="text-sm" />
                                    <span>My Dashboard</span>
                                </a>
                                <a href="/my-events" className="flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                    <FaTicketAlt className="text-sm" />
                                    <span>My Events</span>
                                </a>
                                <a href="/favorites" className="flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                    <FaHeart className="text-sm" />
                                    <span>Favorites</span>
                                </a>
                                <a href="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                    <FaCog className="text-sm" />
                                    <span>Settings</span>
                                </a>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-stone-800/40 text-left font-medium"
                            >
                                <FaSignOutAlt className="text-sm" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU OVERLAY - Appears when hamburger is clicked on small screens */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-stone-800/80 shadow-2xl p-4 animate-slide-down">
                    <div className="flex flex-col space-y-3">
                        {/* Notification item */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNotificationsOpen(!isNotificationsOpen);
                                    setIsProfileOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${isNotificationsOpen
                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                    : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:text-purple-400'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaBell className="text-base" />
                                    <span className="text-sm font-medium">Notifications</span>
                                </div>
                                {unreadCount > 0 && (
                                    <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile notifications dropdown */}
                            {isNotificationsOpen && (
                                <div className="mt-2 bg-zinc-900 border border-stone-800 rounded-xl p-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-stone-800/60 mb-2">
                                        <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {notifications.slice(0, 3).map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-2 rounded-lg text-left ${n.unread ? 'bg-stone-950/60' : ''}`}
                                                onClick={() => n.unread && markAsRead(n.id)}
                                            >
                                                <p className={`text-xs ${n.unread ? 'text-stone-200 font-medium' : 'text-stone-400'}`}>{n.text}</p>
                                                <span className="text-[10px] text-stone-500 block mt-1">{n.time}</span>
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
                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                    : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:text-stone-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <FaUserCircle className="text-xl" />
                                    <span className="text-sm font-medium">Profile</span>
                                </div>
                                <FaChevronDown className={`text-[10px] text-stone-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-purple-400' : ''}`} />
                            </button>

                            {/* Mobile profile dropdown */}
                            {isProfileOpen && (
                                <div className="mt-2 bg-zinc-900 border border-stone-800 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-stone-800/60 bg-stone-950/40">
                                        <div className="flex items-center space-x-3">
                                            <FaUserCircle className="text-2xl text-purple-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-stone-100">
                                                    {userData.first_name || userData.username || 'User'}
                                                </p>
                                                <p className="text-[10px] text-stone-500 truncate">
                                                    {userData.email || 'user@example.com'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                        <FaUserCircle className="text-sm" />
                                        <span>My Dashboard</span>
                                    </a>
                                    <a href="/my-events" className="flex items-center space-x-3 px-4 py-3 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                        <FaTicketAlt className="text-sm" />
                                        <span>My Events</span>
                                    </a>
                                    <a href="/favorites" className="flex items-center space-x-3 px-4 py-3 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                        <FaHeart className="text-sm" />
                                        <span>Favorites</span>
                                    </a>
                                    <a href="/profile" className="flex items-center space-x-3 px-4 py-3 text-xs text-stone-400 hover:bg-stone-950 hover:text-purple-400 transition-colors">
                                        <FaCog className="text-sm" />
                                        <span>Settings</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-stone-800/40 text-left font-medium"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </header>
    );
};

export default UserHeader;