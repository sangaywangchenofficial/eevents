import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdAdminPanelSettings,
    MdDashboard,
    MdPersonAddAlt1,
    MdOutlineCategory,
    MdSearch,
    MdRateReview,
    MdKeyboardArrowDown,
    MdOutlineEvent,
    MdCalendarToday
} from 'react-icons/md';
import { IoAddCircleOutline, IoSettingsOutline } from 'react-icons/io5';

const AdminSidebar = () => {
    const location = useLocation();

    // Helper function to check if a route is currently active
    const isActive = (path) => location.pathname === path;

    // Shared active and inactive style variables for menu buttons
    const activeClass = "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40";
    const inactiveClass = "text-stone-400 hover:bg-stone-800/60 hover:text-purple-400 transition-all duration-300";

    // Managed multi-dropdown open/close visibility tracking state states
    const [dropdownMenus, setDropdownMenus] = useState({
        eventCategory: false,
        eventMenu: false,
        bookings: false
    });

    const toggleDropdownMenu = (menu) => {
        setDropdownMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-stone-800/80 p-5 flex flex-col justify-between sticky top-0 overflow-y-auto">
            <div>

                {/* Main Brand Logo Area */}
                <div className="flex items-center space-x-3 mb-8 px-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                        <MdAdminPanelSettings className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-stone-100 tracking-wide leading-none">eEvents Admin</h1>
                        <span className="text-[10px] text-purple-400/80 font-medium uppercase tracking-widest mt-1 block">Management</span>
                    </div>
                </div>

                {/* Navigation Links List */}
                <nav className="space-y-1.5 font-medium text-sm">

                    {/* Dashboard Link */}
                    <Link
                        to="/admin-dashboard"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin-dashboard') ? activeClass : inactiveClass}`}
                    >
                        <MdDashboard className="text-xl" />
                        <span>Dashboard</span>
                    </Link>

                    {/* Register User Link */}
                    <Link
                        to="/admin-registeruser"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin-registeruser') ? activeClass : inactiveClass}`}
                    >
                        <MdPersonAddAlt1 className="text-xl" />
                        <span>Register User</span>
                    </Link>

                    {/* Event Category Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('eventCategory')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.eventCategory ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdOutlineCategory className="text-xl" />
                                <span>Event Category</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.eventCategory ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu options drop list items container */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.eventCategory ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: Add Category */}
                                <Link
                                    to="/add-category"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-addcategory') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoAddCircleOutline className="text-base" />
                                    <span>Add Category</span>
                                </Link>

                                {/* Sub item: Manage Category */}
                                <Link
                                    to="/manage-category"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-managecategory') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Manage Category</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Event Menu Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('eventMenu')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.eventMenu ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdOutlineEvent className="text-xl" />
                                <span>Event</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.eventMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu list container for Event Menu items */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.eventMenu ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: Add Menu Item */}
                                <Link
                                    to="/add-event"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-addmenuitem') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoAddCircleOutline className="text-base" />
                                    <span>Add Event</span>
                                </Link>

                                {/* Sub item: Manage Menu Items */}
                                <Link
                                    to="/manage-event"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-managemenuitems') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Manage Event</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Dropdown Collapsible Area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleDropdownMenu('bookings')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${dropdownMenus.bookings ? 'text-purple-400 bg-stone-900/40' : 'text-stone-400 hover:bg-stone-800/60 hover:text-purple-400'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <MdCalendarToday className="text-xl" />
                                <span>Bookings</span>
                            </div>
                            <MdKeyboardArrowDown className={`text-xl text-purple-400 transition-transform duration-300 ${dropdownMenus.bookings ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sub-menu list container for Bookings items */}
                        <div className={`overflow-hidden transition-all duration-300 ${dropdownMenus.bookings ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-1 border-l border-stone-800 ml-6 mt-1">

                                {/* Sub item: Bookings List */}
                                <Link
                                    to="/booking-list"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-orderlist') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoAddCircleOutline className="text-base" />
                                    <span>Bookings List</span>
                                </Link>

                                {/* Sub item: Booking Confirm */}
                                <Link
                                    to="/booking-confirm"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-orderconfirm') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Booking Confirm</span>
                                </Link>

                                {/* Sub item: Booking Not Confirm */}
                                <Link
                                    to="/booking-not-confirm"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-ordernotconfirm') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Bookings Not Confirm</span>
                                </Link>

                                {/* Sub item: Booking Cancel */}
                                <Link
                                    to="/booking-cancel"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-ordercancel') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Bookings Cancel</span>
                                </Link>

                                {/* Sub item: Booking Confirmed */}
                                <Link
                                    to="/booking-confirmed"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-bookingdelivered') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Bookings Confirmed</span>
                                </Link>

                                {/* Sub item: Booking Status */}
                                <Link
                                    to="/booking-status"
                                    className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all text-xs ${isActive('/admin-orderstatus') ? 'text-purple-400 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
                                >
                                    <IoSettingsOutline className="text-base" />
                                    <span>Bookings Status</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search Link */}
                    <Link
                        to="/search"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin-search') ? activeClass : inactiveClass}`}
                    >
                        <MdSearch className="text-xl" />
                        <span>Search</span>
                    </Link>

                    {/* Manage Reviews Link */}
                    <Link
                        to="/manage-reviews"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin-managereviews') ? activeClass : inactiveClass}`}
                    >
                        <MdRateReview className="text-xl" />
                        <span>Manage Reviews</span>
                    </Link>

                </nav>
            </div>

            {/* Footer Admin Session Meta Area */}
            <div className="pt-4 border-t border-stone-800/60 flex items-center justify-between px-2 text-xs text-stone-500">
                <span className="truncate">Active Terminal</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
        </aside>
    );
};

export default AdminSidebar;