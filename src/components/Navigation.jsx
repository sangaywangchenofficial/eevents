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
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-purple-100 py-3'
        : 'bg-white/70 backdrop-blur-sm border-b border-purple-100/50 py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
<<<<<<< HEAD
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="eEvents Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-gray-900 dark:text-stone-100 text-xl font-semibold">Eventbtn</span>
=======
          <Link to="/" className="flex items-center gap-1 group">
            <img src={logo} alt="eEvents Logo" className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="font-poppins font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent select-none">
              Event<span className="font-light italic">btn</span>
            </span>
>>>>>>> feature/homepage
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-purple-50/60 p-1.5 rounded-full border border-purple-100/80">
            {desktopNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${active
                    ? 'bg-[#6B21A8] text-white shadow-md shadow-purple-900/20'
                    : 'text-[#475569] hover:text-[#6B21A8] hover:bg-white/80'
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
                  className="px-5 py-2.5 rounded-full text-sm font-poppins font-semibold text-[#1E1B4B] hover:text-[#6B21A8] hover:bg-purple-50 transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-[#6B21A8]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full text-sm font-poppins font-semibold bg-gradient-to-r from-[#6B21A8] to-[#8B5CF6] hover:from-[#581C87] hover:to-[#6B21A8] text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/cart"
                  className="p-2 rounded-full bg-purple-50 text-[#6B21A8] hover:bg-purple-100 transition-colors flex items-center justify-center relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <Link
                  to="/userdashboard"
                  className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-[#6B21A8] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6B21A8] to-[#8B5CF6] text-white flex items-center justify-center text-xs font-bold">
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {userName ? userName.split(' ')[0] : 'Account'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-full text-sm font-poppins font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1.5 border border-red-200"
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
                className="px-3.5 py-1.5 rounded-full text-xs font-poppins font-semibold bg-purple-100 text-[#6B21A8]"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-[#6B21A8] hover:bg-purple-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-purple-100 px-4 pt-3 pb-6 space-y-2 mt-3 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-1">
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-colors ${active
                    ? 'bg-[#6B21A8] text-white font-semibold'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-[#6B21A8]'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-purple-100 grid grid-cols-2 gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center rounded-xl text-sm font-poppins font-semibold border border-purple-200 text-[#1E1B4B] hover:bg-purple-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center rounded-xl text-sm font-poppins font-semibold bg-[#6B21A8] text-white shadow-md shadow-purple-900/20"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 text-center rounded-xl text-sm font-poppins font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 col-span-2"
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