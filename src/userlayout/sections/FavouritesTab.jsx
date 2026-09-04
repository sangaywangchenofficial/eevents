import React from 'react';
import { HeartIcon, CalendarIcon } from '@heroicons/react/24/outline';
import EmptyState from '../components/EmptyState';

const FavouritesTab = ({ favourites, navigate, formatDate, removeFavourite, formatPrice }) => {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-[#E8F5F2] mb-4">My Favourites ({favourites.length})</h2>
            {favourites.length === 0 ? (
                <EmptyState icon={HeartIcon} title="No favourites yet"
                    desc="Like an event? Save it here for later!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favourites.map((f) => (
                        <div key={f.id} className="bg-white dark:bg-[#1C2B27] rounded-2xl border border-gray-100 dark:border-[#2A3D38] overflow-hidden hover:shadow-lg transition-all group">
                            <div className="h-40 bg-gradient-to-br from-[#E6F9F6] dark:from-[#1C2B27] to-[#C8EDE8] dark:to-[#2A3D38] relative cursor-pointer"
                                onClick={() => navigate(`/event/${f.event?.id}`)}>
                                {f.event?.event_image && (
                                    <img src={f.event.event_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFavourite(f.event?.id); }}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-[#1C2B27]/90 backdrop-blur text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-white transition-all shadow"
                                >
                                    <HeartIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 dark:text-[#E8F5F2] truncate">{f.event?.event_name}</h3>
                                <p className="text-xs text-gray-500 dark:text-[#7AA49D] mt-1 flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" /> {formatDate(f.event?.event_date)}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-[#F0A71E]">${formatPrice(f.event?.event_price)}</span>
                                    <button onClick={() => navigate(`/event/${f.event?.id}`)}
                                        className="px-3 py-1.5 text-xs font-semibold bg-[#E6F9F6] dark:bg-[#1C2B27] text-[#1E8B7A] rounded-lg hover:bg-[#C8EDE8] dark:bg-[#2A3D38] transition-all">
                                        View
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

export default FavouritesTab;
