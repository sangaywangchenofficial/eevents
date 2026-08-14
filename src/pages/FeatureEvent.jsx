import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Tag, Heart, Ticket, ArrowRight, Sparkles, Star } from 'lucide-react';
import { getUserId } from '../utils/auth';

// Removed fallback mock events as per user request

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const userId = getUserId();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/random-events/');
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const eventsList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      if (eventsList.length > 0) {
        setEvents(eventsList);
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

  const toggleFavorite = (eventId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const handleBookClick = (eventId) => {
    if (!userId) {
      navigate('/login');
    } else {
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#1E1B4B]">
              Featured Events in Bhutan
            </h2>
            <p className="text-[#475569] text-base mt-2 max-w-xl font-inter">
              Explore authentic cultural celebrations, workshops, and community events with instant digital ticketing.
            </p>
          </div>

          <Link
            to="/events"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-purple-200 text-[#6B21A8] hover:bg-purple-50 font-poppins font-semibold text-sm transition-all group"
          >
            <span>View All Events ({events.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-slate-500">Loading amazing events in Bhutan...</p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, idx) => {
              const isFav = favorites.has(event.id);
              const priceNum = Number(event.event_price);
              const formattedPrice = isNaN(priceNum) || priceNum === 0 ? 'Free' : `Nu. ${priceNum.toLocaleString()}`;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group bg-white rounded-2xl border border-purple-100 shadow-md hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5"
                >
                  {/* Card Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={event.event_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Category Tag */}
                    {event.category_name && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1E1B4B] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm">
                        {event.category_name}
                      </span>
                    )}

                    {/* Favorite Button Toggle */}
                    <button
                      onClick={(e) => toggleFavorite(event.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFav
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                        }`}
                      aria-label="Bookmark event"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Price Badge on Image Bottom Right */}
                    <span className="absolute bottom-3 right-3 bg-[#6B21A8] text-white text-xs font-poppins font-bold px-3 py-1 rounded-full shadow-md">
                      {formattedPrice}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-poppins font-bold text-lg text-[#1E1B4B] line-clamp-1 group-hover:text-[#6B21A8] transition-colors">
                        {event.event_name}
                      </h3>

                      <p className="text-xs text-[#475569] font-inter mt-1 line-clamp-2 leading-relaxed">
                        {event.event_description || 'Join us for this exciting event in Bhutan!'}
                      </p>
                    </div>

                    {/* Date & Location Rows */}
                    <div className="space-y-1.5 pt-2 border-t border-purple-50 text-xs text-slate-600 font-inter">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#6B21A8]" />
                          <span>
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      {event.event_location && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                          <span className="truncate">{event.event_location}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-2">
                      <Link
                        to={`/event/${event.id}`}
                        className="flex-1 py-2.5 rounded-xl border border-purple-200 text-[#1E1B4B] hover:bg-purple-50 text-center font-poppins font-semibold text-xs transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleBookClick(event.id)}
                        className="flex-1 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-semibold text-xs shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Now</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedEvents;