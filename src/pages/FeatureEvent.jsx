import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Heart, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { getUserId } from '../utils/auth';

/** Fisher-Yates shuffle — returns a new shuffled array */
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const DISPLAY_COUNT = 8;

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const userId = getUserId();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/view-events/');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list =
          json.data && Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];
        setAllEvents(list);
        setDisplayed(shuffleArray(list).slice(0, DISPLAY_COUNT));
      } catch (err) {
        console.warn('Failed to fetch events:', err);
        setAllEvents([]);
        setDisplayed([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  const toggleFavorite = (eventId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(eventId) ? next.delete(eventId) : next.add(eventId);
      return next;
    });
  };

  const handleBookClick = (eventId) => {
    if (!userId) navigate('/login');
    else navigate(`/event/${eventId}`);
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9F6] text-[#29BBA3] text-xs font-semibold uppercase tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1E352F]">
              Upcoming Events in Bhutan
            </h2>
            <p className="text-[#475569] text-base mt-2 max-w-xl">
              Explore authentic cultural celebrations, workshops, and community events with instant digital ticketing.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#E6E1D8] text-[#29BBA3] hover:bg-[#F4F3EC] font-semibold text-sm transition-all group"
            >
              <span>View All ({allEvents.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#1E8B7A] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading events in Bhutan...</p>
          </div>

        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No events available right now. Check back soon!</p>
          </div>

        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={displayed.map(e => e.id).join('-')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayed.map((event, idx) => {
                const isFav = favorites.has(event.id);
                const priceNum = Number(event.event_price);
                const formattedPrice =
                  isNaN(priceNum) || priceNum === 0 ? 'Free' : `Nu. ${priceNum.toLocaleString()}`;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="group bg-white rounded-2xl border border-[#E6F9F6] shadow-md hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5"
                  >
                    {/* Card Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={
                          event.event_image ||
                          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'
                        }
                        alt={event.event_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {event.category_name && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1E352F] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                          {event.category_name}
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleFavorite(event.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFav
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                          }`}
                        aria-label="Toggle favourite"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                      </button>

                      <span className="absolute bottom-3 right-3 bg-[#1E8B7A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {formattedPrice}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-[#1E352F] line-clamp-1 group-hover:text-[#29BBA3] transition-colors">
                          {event.event_name}
                        </h3>
                        <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">
                          {event.event_description || 'Join us for this exciting event in Bhutan!'}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[#FDFDF7] text-xs text-slate-600">
                        {event.event_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#29BBA3]" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        {event.event_location && (
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#1E8B7A] flex-shrink-0" />
                            <span className="truncate">{event.event_location}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex gap-2">
                        <Link
                          to={`/event/${event.id}`}
                          className="flex-1 py-2.5 rounded-xl border border-[#E6E1D8] text-[#1E352F] hover:bg-[#F4F3EC] text-center font-semibold text-xs transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleBookClick(event.id)}
                          className="flex-1 py-2.5 rounded-xl bg-[#1E8B7A] hover:bg-[#1E352F] text-white font-semibold text-xs shadow-md shadow-teal-900/20 transition-all flex items-center justify-center gap-1"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Book Ticket</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;

