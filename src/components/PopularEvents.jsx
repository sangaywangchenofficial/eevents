import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Ticket, ArrowRight, Flame } from 'lucide-react';

// Removed fallback mock events as per user request

const PopularEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/view-events/');
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const eventsList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      if (eventsList.length > 0) {
        // Take the first 4 events for the popular section
        setEvents(eventsList.slice(0, 4));
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.warn("API error, setting empty events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    // If it's a fallback string like "Nov 11, 2026", just return it
    if (isNaN(new Date(dateString).getTime())) return dateString;
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (price === 'Free' || price?.toString().startsWith('Nu.')) return price;
    const num = Number(price);
    if (isNaN(num) || num === 0) return 'Free';
    return `Nu. ${num.toLocaleString()}`;
  };

  return (
    <section className="py-16 bg-[#FDFDF7] border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF3E0] text-[#F47F1D] text-xs font-semibold uppercase tracking-wide mb-3 border border-[#F47F1D]/20">
              <Flame className="w-3.5 h-3.5 text-[#F47F1D]" />
              <span>Trending Across Dzongkhags</span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1E352F]">
              Popular Upcoming Events
            </h2>
            <p className="text-[#4A5C57] text-base mt-2 max-w-xl">
              Don't miss out on Bhutan's most anticipated cultural gatherings and seasonal celebrations.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#1E8B7A] hover:text-[#29BBA3] font-semibold text-sm group"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading / Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-[#66756F]">Loading trending events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => navigate(`/event/${event.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-[#E6E1D8] shadow-md hover:shadow-xl hover:shadow-teal-900/10 transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={event.event_image || event.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'}
                      alt={event.event_name || event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E352F]/70 via-transparent to-transparent"></div>

                    {/* Category badge — saffron orange */}
                    <span className="absolute top-3 left-3 bg-[#F47F1D]/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                      {event.category_name || event.category || 'Event'}
                    </span>

                    {/* Price badge — golden yellow */}
                    <span className="absolute bottom-3 right-3 bg-[#F0A71E] text-[#1E352F] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {formatPrice(event.event_price || event.price)}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    {/* Add organizer or just generic if not present from DB */}
                    <span className="text-[11px] font-semibold text-[#29BBA3] uppercase tracking-wider">
                      {event.organizer || 'Local Organizer'}
                    </span>

                    <h3 className="font-bold text-base text-[#1E352F] line-clamp-1 group-hover:text-[#1E8B7A] transition-colors">
                      {event.event_name || event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-[#66756F] pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#29BBA3]" />
                        <span>{formatDate(event.event_date || event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#1E8B7A] flex-shrink-0" />
                        <span className="truncate">{event.event_location || event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button className="w-full py-2.5 rounded-xl bg-[#E6F9F6] hover:bg-gradient-to-r hover:from-[#29BBA3] hover:to-[#1E8B7A] text-[#1E8B7A] hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-[#C8EDE8]">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Reserve Seat</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default PopularEvents;
