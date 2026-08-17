import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Home,
  Calendar,
  Grid,
  Info,
  Mail,
  LogIn,
  UserPlus,
  Menu,
  X,
  Compass,
  Heart,
  LogOut,
  User,
  Ticket,
  ShoppingCart,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'react-toastify';
import { isAuthenticated, clearAuth, getUser, STORAGE_KEYS } from '../utils/auth';
import logo from '../assets/logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const refreshAuth = () => {
    const authed = isAuthenticated();
    setIsLoggedIn(authed);
    if (authed) {
      const userObj = getUser();
      setUserName(
        userObj ? (userObj.first_name || userObj.username || '').toString() : ''
      );
    } else {
      setUserName('');
    }
  };

  useEffect(() => {
    refreshAuth();

    const onAuthChange = () => refreshAuth();
    window.addEventListener('auth:change', onAuthChange);
    window.addEventListener('storage', onAuthChange);

    return () => {
      window.removeEventListener('auth:change', onAuthChange);
      window.removeEventListener('storage', onAuthChange);
    };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Events', path: '/events', icon: Calendar },
    { label: 'Categories', path: '/categories', icon: Grid },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  const privateLinks = [
    { label: 'Dashboard', path: '/userdashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/my-bookings', icon: Ticket },
    { label: 'Cart', path: '/cart', icon: ShoppingCart },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const getDesktopNavLinks = () => {
    return publicLinks;
  };

  const getMobileNavLinks = () => {
    if (isLoggedIn) {
      return [...publicLinks, ...privateLinks];
    }
    return publicLinks;
  };

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUserName('');
    setIsOpen(false);
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const desktopNavLinks = getDesktopNavLinks();
  const mobileNavLinks = getMobileNavLinks();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#FDFDF7]/95 backdrop-blur-md shadow-md border-b border-[#E6E1D8] py-3'
        : 'bg-[#FDFDF7]/80 backdrop-blur-sm border-b border-[#E6E1D8]/60 py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l1.5-1.5a2.5 2.5 0 010-3.54L6 3l15 15-1.5 1.5a2.5 2.5 0 01-3.54 0L15 18H9l-1.5 1.5a2.5 2.5 0 01-3.54 0L3 18V9z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round"/>
                </svg>
            </div>
            <div className="leading-none">
              <span className="font-black text-xl tracking-widest uppercase text-[#1E352F]">
                TIX<span className="text-[#29BBA3]">ELO</span>
              </span>
              <p className="text-[9px] text-[#66756F] tracking-wide font-medium leading-none mt-0.5">Unlock the Moment</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4F3EC]/80 p-1.5 rounded-full border border-[#E6E1D8]">
            {desktopNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${active
                    ? 'bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white shadow-md shadow-teal-600/20'
                    : 'text-[#4A5C57] hover:text-[#1E8B7A] hover:bg-white/80'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#1E352F] hover:text-[#1E8B7A] hover:bg-[#E6F9F6] transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-[#29BBA3]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/cart"
                  className="p-2 rounded-full bg-[#E6F9F6] text-[#1E8B7A] hover:bg-[#C8EDE8] transition-colors flex items-center justify-center relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <Link
                  to="/userdashboard"
                  className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-[#E6F9F6] hover:bg-[#C8EDE8] text-[#1E8B7A] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white flex items-center justify-center text-xs font-bold">
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {userName ? userName.split(' ')[0] : 'Account'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1.5 border border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isLoggedIn && (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E6F9F6] text-[#1E8B7A]"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#4A5C57] hover:text-[#1E8B7A] hover:bg-[#E6F9F6] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFDF7]/98 backdrop-blur-lg border-b border-[#E6E1D8] px-4 pt-3 pb-6 space-y-2 mt-3 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-1">
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 transition-colors ${active
                    ? 'bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white'
                    : 'text-[#4A5C57] hover:bg-[#E6F9F6] hover:text-[#1E8B7A]'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E6E1D8] grid grid-cols-2 gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center rounded-xl text-sm font-semibold border border-[#E6E1D8] text-[#1E352F] hover:bg-[#E6F9F6]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center rounded-xl text-sm font-semibold bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white shadow-md shadow-teal-600/20"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 text-center rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 col-span-2"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;