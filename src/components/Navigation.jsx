import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiHome, HiCalendar, HiViewGrid, HiUserAdd, HiLogin, HiShieldCheck } from 'react-icons/hi';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Home');
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const location = useLocation();

    // Dynamic structural navigation definition array with paths
    const navItems = [
        { name: 'Home', icon: <HiHome className="w-5 h-5" />, path: '/' },
        { name: 'Events', icon: <HiCalendar className="w-5 h-5" />, path: '/events' },
        { name: 'Categories', icon: <HiViewGrid className="w-5 h-5" />, path: '/categories' },
        { name: 'Register', icon: <HiUserAdd className="w-5 h-5" />, path: '/register' },
        { name: 'Login', icon: <HiLogin className="w-5 h-5" />, path: '/login' },
        { name: 'Admin Login', icon: <HiShieldCheck className="w-5 h-5" />, path: '/admin-login' },
    ];

    // Set active item based on current route
    useEffect(() => {
        const currentPath = location.pathname;
        const activeNavItem = navItems.find(item => item.path === currentPath);
        if (activeNavItem) {
            setActiveItem(activeNavItem.name);
        }
    }, [location.pathname]);

    // 1. Detect scrolling to inject depth styling (Shadow & background changes)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Handle escape key for global accessibility close pattern
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // 3. Click outside handler to dismiss mobile modal panel
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 4. Action pipeline for item selection
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        setIsOpen(false);
    };

    return (
        <nav
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? 'bg-zinc-900/95 backdrop-blur-md shadow-2xl border-b border-stone-800'
                : 'bg-zinc-900 border-b border-transparent'
                } text-stone-100`}
        >
            {/* Structural Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Brand Logo Identity - Updated to match admin theme */}
                    <Link
                        to="/"
                        className="flex-shrink-0 flex items-center space-x-2.5 cursor-pointer group"
                        onClick={() => handleItemClick('Home')}
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-purple-950/40">
                            <HiCalendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            eEvents
                        </span>
                    </Link>

                    {/* Desktop Navigation Link Layout (>= 768px) */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = activeItem === item.name;
                            const isAdmin = item.name === 'Admin Login';
                            const isHome = item.name === 'Home';

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => handleItemClick(item.name)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500
                                    ${isAdmin
                                            ? 'border border-purple-500/30 bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white ml-3 shadow-sm'
                                            : isActive
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40'
                                                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                                        }`}
                                >
                                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'text-stone-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Access / Hamburger Control Action (< 768px) */}
                    <div className="md:hidden flex items-center">
                        <button
                            ref={buttonRef}
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 min-h-[44px] min-w-[44px] relative z-20"
                            aria-controls="mobile-navigation-menu"
                            aria-expanded={isOpen}
                            aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
                        >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                {/* Smooth rotation animation toggle pattern */}
                                <span className={`absolute transform transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                                    <HiMenu className="w-6 h-6" />
                                </span>
                                <span className={`absolute transform transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                                    <HiX className="w-6 h-6" />
                                </span>
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Collapsible Navigation Panel */}
            <div
                id="mobile-navigation-menu"
                ref={menuRef}
                className={`md:hidden transition-all duration-300 ease-in-out bg-zinc-900 border-stone-800
                ${isOpen ? 'max-h-[420px] opacity-100 border-t' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}
            >
                <div className="px-3 pt-2 pb-5 space-y-1.5 shadow-inner">
                    {navItems.map((item) => {
                        const isActive = activeItem === item.name;
                        const isAdmin = item.name === 'Admin Login';

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => handleItemClick(item.name)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[48px]
                                ${isAdmin
                                        ? 'bg-purple-950/40 text-purple-300 border border-purple-900/50 mt-3 shadow-sm'
                                        : isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40'
                                            : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                                    }`}
                            >
                                <div className={`p-1 rounded-lg ${isActive ? 'text-white' : 'text-stone-500'}`}>
                                    {item.icon}
                                </div>
                                <span className="tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;