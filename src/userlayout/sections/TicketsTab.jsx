import React from 'react';
import { TicketIcon, CalendarIcon, MapPinIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

const TicketsTab = ({ bookings, navigate, formatDate }) => {
    // A ticket is usually a confirmed booking
    const confirmedBookings = bookings.filter(b => b.is_booked);

    const handleDownload = (bookingId) => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                @page { 
                    margin: 0;
                    size: auto; 
                }
                html, body {
                    height: 100vh;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    background: #f5f5f5;
                }
                body * {
                    visibility: hidden;
                }
                #ticket-${bookingId}, #ticket-${bookingId} * {
                    visibility: visible;
                }
                #ticket-${bookingId} {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 600px;
                    margin: 0;
                    padding: 0;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    border-radius: 16px;
                    overflow: hidden;
                }
                .print-hidden {
                    display: none !important;
                }
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        `;
        document.head.appendChild(style);
        setTimeout(() => {
            window.print();
            document.head.removeChild(style);
        }, 100);
    };

    return (
        <div className="tickets-tab">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-[#E8F5F2]">
                    My Tickets
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-[#66756F]">
                        ({confirmedBookings.length})
                    </span>
                </h2>
                {confirmedBookings.length > 0 && (
                    <button
                        onClick={() => navigate('/events')}
                        className="text-sm text-[#29BBA3] hover:text-[#1E8B7A] font-medium transition-colors"
                    >
                        Browse More Events →
                    </button>
                )}
            </div>

            {confirmedBookings.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon={TicketIcon}
                        title="No tickets yet"
                        desc="You don't have any confirmed tickets right now. Start exploring events to book your first ticket!"
                        actionLabel="View Events"
                        onAction={() => navigate('/events')}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {confirmedBookings.map((b, idx) => (
                        <motion.div
                            key={b.id}
                            id={`ticket-${b.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: idx * 0.08,
                                duration: 0.4,
                                ease: "easeOut"
                            }}
                            className="ticket-card group"
                        >
                            {/* Ticket Container */}
                            <div className="bg-white dark:bg-[#1C2B27] rounded-2xl border-2 border-[#29BBA3]/20 hover:border-[#29BBA3]/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col">

                                {/* Ticket Header */}
                                <div className="bg-gradient-to-r from-[#1E352F] to-[#1E8B7A] p-5 text-white relative">
                                    {/* Decorative pattern */}
                                    <div className="absolute top-0 right-0 opacity-10">
                                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                                            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" />
                                            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" />
                                            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg truncate pr-8 text-white">
                                            {b.event?.event_name || 'Untitled Event'}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-teal-50 text-xs opacity-90">
                                                Ticket #{b.booked_number || String(b.id).slice(0, 8)}
                                            </p>
                                            <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-semibold backdrop-blur-sm">
                                                CONFIRMED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cutout circles for ticket effect */}
                                    <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#FDFDF7] dark:bg-[#162019] border-2 border-[#29BBA3]/20"></div>
                                    <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#FDFDF7] dark:bg-[#162019] border-2 border-[#29BBA3]/20"></div>
                                </div>

                                {/* Ticket Body */}
                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Event Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-[#66756F] flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                Date & Time
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-[#E8F5F2]">
                                                {formatDate(b.event?.event_date) || 'Date TBA'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-[#7AA49D]">
                                                {b.event?.event_time || 'Time TBA'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-[#66756F] flex items-center gap-1">
                                                <MapPinIcon className="h-3 w-3" />
                                                Location
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-[#E8F5F2] truncate">
                                                {b.event?.event_location || 'Online'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-[#66756F]">
                                                Admit
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-[#E8F5F2]">
                                                {b.quantity || 1} Person{b.quantity > 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-[#66756F]">
                                                Status
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                <p className="text-sm font-bold text-green-500">
                                                    Confirmed
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider with cutouts */}
                                    <div className="border-t-2 border-dashed border-gray-200 dark:border-[#2A3D38] my-3 relative">
                                        <div className="absolute -top-3 -left-8 w-6 h-6 rounded-full bg-[#FDFDF7] dark:bg-[#162019] border-2 border-[#29BBA3]/20"></div>
                                        <div className="absolute -top-3 -right-8 w-6 h-6 rounded-full bg-[#FDFDF7] dark:bg-[#162019] border-2 border-[#29BBA3]/20"></div>

                                        {/* Scannable barcode decoration */}
                                        <div className="flex justify-center gap-0.5 py-2 opacity-20">
                                            {[...Array(20)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gray-600 dark:bg-gray-400"
                                                    style={{
                                                        width: (i % 3 === 0) ? '3px' : '1px',
                                                        height: (i % 2 === 0) ? '12px' : '8px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between mt-2 print-hidden gap-2">
                                        <button
                                            onClick={() => handleDownload(b.id)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-[#162019] text-gray-700 dark:text-[#A8C4BE] rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-[#2A3D38] transition-all duration-200 flex-1 justify-center group-hover:shadow-md"
                                        >
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => navigate(`/my-booking-details/${b.id}`)}
                                            className="px-4 py-2.5 bg-[#E6F9F6] dark:bg-[#1C2B27] text-[#1E8B7A] dark:text-[#29BBA3] rounded-xl text-xs font-bold hover:bg-[#C8EDE8] dark:hover:bg-[#2A3D38] transition-all duration-200 flex-1 justify-center group-hover:shadow-md"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketsTab;