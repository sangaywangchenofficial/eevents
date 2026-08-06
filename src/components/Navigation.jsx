// Navigation.jsx - Proper Alignment: Logo Left | Links Center | Auth Right
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaCalendarAlt,
    FaThLarge,
    FaBars,
    FaTimes,
    FaUserPlus,
    FaSignInAlt
} from 'react-icons/fa';
import { HiCalendar } from 'react-icons/hi';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Check login status
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Check if link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Show loading state
    if (isLoading) {
        return (
            <nav className="bg-zinc-950 border-b border-stone-800/80 h-16 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </nav>
        );
    }

    return (
        <>
            {/* Navigation Bar - Dark Theme */}
            <nav className="bg-zinc-950 border-b border-stone-800/80 text-stone-100 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* LEFT SIDE: Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-950/30 group-hover:shadow-purple-950/50 transition-all duration-300">
                                    <HiCalendar className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-serif font-bold tracking-wide">
                                    e<span className="text-purple-400">Events</span>
                                </span>
                            </Link>
                        </div>

                        {/* CENTER: Home, Events, Categories */}
                        <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
                            {/* Home */}
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${isActive('/')
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/30'
                                    : 'hover:bg-stone-800/60 hover:text-purple-400'
                                    }`}
                            >
                                <FaHome className="text-lg" />
                                <span>Home</span>
                            </Link>

                            {/* Events */}
                            <Link
                                to="/events"
                                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${isActive('/events')
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/30'
                                    : 'hover:bg-stone-800/60 hover:text-purple-400'
                                    }`}
                            >
                                <FaCalendarAlt className="text-lg" />
                                <span>Events</span>
                            </Link>

                            {/* Categories */}
                            <Link
                                to="/categories"
                                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${isActive('/categories')
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/30'
                                    : 'hover:bg-stone-800/60 hover:text-purple-400'
                                    }`}
                            >
                                <FaThLarge className="text-lg" />
                                <span>Categories</span>
                            </Link>
                        </div>

                        {/* RIGHT SIDE: Register & Login */}
                        <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
                            {/* Register */}
                            <Link
                                to="/register"
                                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${isActive('/register')
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/30'
                                    : 'hover:bg-stone-800/60 hover:text-purple-400'
                                    }`}
                            >
                                <FaUserPlus className="text-lg" />
                                <span>Register</span>
                            </Link>

                            {/* Login */}
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 ${isActive('/login')
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/30'
                                    : 'hover:bg-stone-800/60 hover:text-purple-400'
                                    }`}
                            >
                                <FaSignInAlt className="text-lg" />
                                <span>Login</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button - Right Side */}
                        <div className="md:hidden flex-shrink-0">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg hover:bg-stone-800/60 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? (
                                    <FaTimes className="text-xl text-stone-400" />
                                ) : (
                                    <FaBars className="text-xl text-stone-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-zinc-950 border-t border-stone-800/80 px-4 py-3 space-y-2 animate-slide-down">
                        {/* Home */}
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${isActive('/')
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'hover:bg-stone-800/60 hover:text-purple-400'
                                }`}
                        >
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </Link>

                        {/* Events */}
                        <Link
                            to="/events"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${isActive('/events')
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'hover:bg-stone-800/60 hover:text-purple-400'
                                }`}
                        >
                            <FaCalendarAlt className="text-lg" />
                            <span>Events</span>
                        </Link>

                        {/* Categories */}
                        <Link
                            to="/categories"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${isActive('/categories')
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'hover:bg-stone-800/60 hover:text-purple-400'
                                }`}
                        >
                            <FaThLarge className="text-lg" />
                            <span>Categories</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-stone-800/60 my-2"></div>

                        {/* Register */}
                        <Link
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${isActive('/register')
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'hover:bg-stone-800/60 hover:text-purple-400'
                                }`}
                        >
                            <FaUserPlus className="text-lg" />
                            <span>Register</span>
                        </Link>

                        {/* Login */}
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${isActive('/login')
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'hover:bg-stone-800/60 hover:text-purple-400'
                                }`}
                        >
                            <FaSignInAlt className="text-lg" />
                            <span>Login</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Animation styles */}
            <style jsx>{`
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
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Navigation;