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
    <section className="py-16 bg-white border-t border-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Trending Across Dzongkhags</span>
            </div>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#1E1B4B]">
              Popular Upcoming Events
            </h2>
            <p className="text-[#475569] text-base mt-2 font-inter max-w-xl">
              Don't miss out on Bhutan's most anticipated cultural gatherings and seasonal celebrations.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#6B21A8] hover:text-[#581C87] font-poppins font-semibold text-sm group"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading / Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-slate-500">Loading trending events...</p>
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
                className="group cursor-pointer bg-white rounded-2xl border border-purple-100 shadow-md hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={event.event_image || event.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'}
                      alt={event.event_name || event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1E1B4B] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full">
                      {event.category_name || event.category || 'Event'}
                    </span>

                    <span className="absolute bottom-3 right-3 bg-[#6B21A8] text-white text-xs font-poppins font-bold px-3 py-1 rounded-full shadow-md">
                      {formatPrice(event.event_price || event.price)}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    {/* Add organizer or just generic if not present from DB */}
                    <span className="text-[11px] font-medium text-purple-600 uppercase tracking-wider">
                      {event.organizer || 'Local Organizer'}
                    </span>

                    <h3 className="font-poppins font-bold text-base text-[#1E1B4B] line-clamp-1 group-hover:text-[#6B21A8] transition-colors">
                      {event.event_name || event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-500 font-inter pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6B21A8]" />
                        <span>{formatDate(event.event_date || event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                        <span className="truncate">{event.event_location || event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-[#6B21A8] text-[#6B21A8] hover:text-white font-poppins font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
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
