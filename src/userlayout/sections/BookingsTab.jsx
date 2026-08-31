import React from 'react';
import { TicketIcon, ArrowRightIcon, CalendarIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import EmptyState from '../components/EmptyState';

const BookingsTab = ({ bookings, navigate, formatDate, formatPrice, loadAll }) => {
    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.post(`/cancel-booking/${id}/`);
            toast.success('Booking cancelled');
            await loadAll();
        } catch (err) {
            toast.error(err?.message || 'Failed to cancel');
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-[#E8F5F2]">All Bookings ({bookings.length})</h2>
                <button onClick={() => navigate('/events')}
                    className="text-sm font-medium text-[#1E8B7A] hover:text-[#29BBA3] flex items-center gap-1">
                    Browse Events <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>

            {bookings.length === 0 ? (
                <EmptyState icon={TicketIcon} title="No bookings" desc="Explore our events and book your first ticket!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b.id} className="md:flex bg-white dark:bg-[#1C2B27] rounded-2xl border border-gray-100 dark:border-[#2A3D38] overflow-hidden hover:shadow-md transition-all">
                            <div className="md:w-44 h-44 md:h-auto bg-gradient-to-br from-[#1E352F] to-[#1E8B7A] relative flex-shrink-0">
                                {b.event?.event_image && (
                                    <img src={b.event.event_image} alt="" className="w-full h-full object-cover opacity-95" />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${b.is_booked ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                        }`}>
                                        {b.is_booked ? 'Confirmed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-5 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#1E352F] dark:text-[#E8F5F2] text-lg">{b.event?.event_name}</h3>
                                    <p className="text-sm text-[#66756F] dark:text-[#7AA49D] mt-1 line-clamp-2">{b.event?.event_description}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600 dark:text-[#7AA49D]">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {formatDate(b.event?.event_date)} {b.event?.event_time || ''}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {b.event?.event_location || 'Online'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TicketIcon className="h-3.5 w-3.5 text-[#29BBA3]" />
                                            {b.quantity} ticket{b.quantity > 1 ? 's' : ''}
                                        </span>
                                        <span className="flex items-center gap-1 font-bold text-[#F0A71E]">
                                            <CurrencyDollarIcon className="h-3.5 w-3.5" />
                                            ${formatPrice(b.total_price)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-[#2A3D38]">
                                    <button onClick={() => navigate(`/my-booking-details/${b.id}`)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">
                                        View Details
                                    </button>
                                    <button onClick={() => handleCancel(b.id)}
                                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingsTab;
