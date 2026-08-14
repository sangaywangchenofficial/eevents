import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Users, Ticket, ArrowRight, Sparkles, Filter, Heart, ChevronRight } from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const cat = params.get('category') || '';
    setSearchQuery(query);
    setCategoryFilter(cat);

    if (query) {
      fetchSearchResults(query);
    } else {
      fetchAllEvents();
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/event-search/?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
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

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/view-events/');
      if (!response.ok) throw new Error('Fetch failed');
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const toggleFavorite = (eventId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num) || num === 0) return 'Free';
    return `Nu. ${num.toLocaleString()}`;
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FAF8FF] py-10 font-inter">

        {/* Sticky Search Header Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-xl shadow-purple-900/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold uppercase tracking-wide mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Events</span>
                </div>
                <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-[#1E1B4B]">
                  {searchQuery ? `Search Results for "${searchQuery}"` : categoryFilter ? `Category: ${categoryFilter}` : 'Explore All Events in Bhutan'}
                </h1>
                <p className="text-[#475569] text-sm mt-1">
                  Find verified festival passes, cultural workshops, and community events across Bhutan.
                </p>
              </div>

              {/* Search Bar Input */}
              <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 max-w-lg">
                <div className="glass-card p-2 rounded-2xl border border-[#E9D5FF] flex items-center gap-2">
                  <div className="relative flex-1 flex items-center pl-3">
                    <Search className="w-5 h-5 text-[#6B21A8] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by event, location, dzongkhag..."
                      className="w-full py-2 bg-transparent text-[#1E1B4B] placeholder-slate-400 focus:outline-none text-sm font-inter"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#6B21A8] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-medium text-[#475569]">Searching Bhutanese events...</p>
            </div>
          ) : (
            <>
              {/* Filter Counter Bar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E9D5FF]">
                <p className="text-sm font-poppins font-semibold text-[#1E1B4B]">
                  Showing <span className="text-[#6B21A8] font-bold">{events.length}</span> {events.length === 1 ? 'event' : 'events'}
                </p>

                <div className="flex items-center gap-2 text-xs font-poppins font-semibold text-[#6B21A8]">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Bhutan Dzongkhag Filter Active</span>
                </div>
              </div>

              {/* Event Cards Grid */}
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, idx) => {
                    const isFav = favorites.has(event.id);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="group bg-white rounded-2xl border border-[#E9D5FF] shadow-md hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5"
                      >
                        {/* Event Image */}
                        <div>
                          <div className="relative h-52 overflow-hidden bg-slate-100">
                            <img
                              src={event.event_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'}
                              alt={event.event_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                            {/* Category Badge */}
                            {(event.category_name || event.category) && (
                              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1E1B4B] text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm">
                                {event.category_name || event.category}
                              </span>
                            )}

                            {/* Favorite Bookmark */}
                            <button
                              onClick={(e) => toggleFavorite(event.id, e)}
                              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                                }`}
                              aria-label="Favorite event"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                            </button>

                            {/* Price Badge */}
                            <span className="absolute bottom-3 right-3 bg-[#6B21A8] text-white text-xs font-poppins font-bold px-3 py-1 rounded-full shadow-md">
                              {formatPrice(event.event_price)}
                            </span>
                          </div>

                          {/* Event Body Content */}
                          <div className="p-5 space-y-3">
                            <Link to={`/event/${event.id}`}>
                              <h3 className="font-poppins font-bold text-lg text-[#1E1B4B] line-clamp-1 group-hover:text-[#6B21A8] transition-colors">
                                {event.event_name}
                              </h3>
                            </Link>

                            <p className="text-xs text-[#475569] font-inter line-clamp-2 leading-relaxed">
                              {event.event_description || 'Join us for this exciting cultural event in Bhutan.'}
                            </p>

                            <div className="space-y-1.5 pt-2 border-t border-purple-50 text-xs text-slate-600 font-inter">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#6B21A8]" />
                                <span>{formatDate(event.event_date)}</span>
                              </div>
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                                <span className="truncate">{event.event_location || 'Thimphu, Bhutan'}</span>
                              </div>
                              {event.event_quantity !== undefined && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{event.event_quantity} Seats Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-5 pt-0 flex gap-2">
                          <Link
                            to={`/event/${event.id}`}
                            className="flex-1 py-2.5 rounded-xl border border-[#E9D5FF] text-[#1E1B4B] hover:bg-purple-50 text-center font-poppins font-semibold text-xs transition-colors"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/event/${event.id}`}
                            className="flex-1 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-semibold text-xs shadow-md shadow-purple-900/20 text-center transition-all flex items-center justify-center gap-1"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Book Now</span>
                          </Link>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Results State */
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E9D5FF] p-8 max-w-lg mx-auto shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-[#6B21A8] flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-poppins font-bold text-xl text-[#1E1B4B] mb-2">No Events Found</h3>
                  <p className="text-sm text-[#475569] font-inter mb-6">
                    We couldn't find any events matching "{searchQuery}". Try searching for Paro, Thimphu, or Festivals.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); navigate('/search'); }}
                    className="px-6 py-3 bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all"
                  >
                    View All Bhutan Events
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </PublicLayout>
  );
};

export default SearchPage;