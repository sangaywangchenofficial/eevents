import React from 'react';
import { motion } from 'framer-motion';
import { TicketIcon, CalendarIcon, MapPinIcon, ChevronRightIcon, ShoppingCartIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import EmptyState from '../components/EmptyState';
import QuickAction from '../components/QuickAction';

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
                    <h2 className="text-lg font-bold text-gray-800 dark:text-[#E8F5F2] flex items-center gap-2">
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
                            className="p-4 rounded-xl border border-gray-100 dark:border-[#2A3D38] hover:bg-[#F4F3EC] dark:hover:bg-[#162019] dark:bg-[#162019] dark:hover:bg-[#162019] cursor-pointer transition-all flex items-start justify-between gap-4"
                            onClick={() => navigate(`/my-booking-details/${b.id}`)}
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#1E352F] dark:text-[#E8F5F2] truncate">{b.event?.event_name}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-[#7AA49D]">
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
                                <div className="text-xs text-gray-400 dark:text-[#66756F] mt-1">{b.quantity} ticket{b.quantity > 1 ? 's' : ''}</div>
                                <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${b.is_booked ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
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
                <div className="bg-[#F4F3EC] dark:bg-[#162019] rounded-2xl p-5 border border-[#E6E1D8] dark:border-[#2A3D38]">
                    <h3 className="font-bold text-[#1E352F] dark:text-[#E8F5F2] mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" /> Upcoming Events
                    </h3>
                    <div className="space-y-2">
                        {upcoming.length > 0 ? upcoming.map((e, i) => (
                            <motion.div
                                key={e.id}
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="p-3 bg-white dark:bg-[#1C2B27] rounded-xl border border-[#E6E1D8] dark:border-[#2A3D38] cursor-pointer hover:shadow transition-all"
                                onClick={() => navigate(`/event/${e.event?.id}`)}
                            >
                                <p className="font-medium text-sm text-gray-800 dark:text-[#E8F5F2] truncate">{e.event?.event_name}</p>
                                <p className="text-xs text-gray-500 dark:text-[#7AA49D] mt-1 flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" /> {formatDate(e.event?.event_date)}
                                </p>
                            </motion.div>
                        )) : (
                            <p className="text-gray-400 dark:text-[#66756F] text-sm">No upcoming events</p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C2B27] rounded-2xl p-5 border border-gray-100 dark:border-[#2A3D38] shadow-sm">
                    <h3 className="font-bold text-gray-800 dark:text-[#E8F5F2] mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <QuickAction onClick={() => setActiveTab('bookings')} label="View All Bookings" icon={TicketIcon} primary />
                        <QuickAction onClick={() => setActiveTab('cart')} label={`My Cart (${stats.cartItems})`} icon={ShoppingCartIcon} />
                        <QuickAction onClick={() => setActiveTab('favourites')} label={`Favourites (${stats.favouritesCount})`} icon={HeartIcon} />
                        <QuickAction onClick={() => setActiveTab('profile')} label="Edit Profile" icon={UserCircleIcon} />
                        <QuickAction onClick={() => navigate('/events')} label="Browse Events" icon={CalendarIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
