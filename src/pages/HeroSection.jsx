import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroEvent, setHeroEvent] = useState(null);
  const navigate = useNavigate();

  /* ── Pick one random event from backend to show in phone mockup ── */
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/view-events/')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => {
        const list = json.data && Array.isArray(json.data) ? json.data
          : Array.isArray(json) ? json : [];
        if (list.length > 0) {
          const pick = list[Math.floor(Math.random() * list.length)];
          setHeroEvent(pick);
        }
      })
      .catch(() => { });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  const popularTags = ['Festivals', 'Paro Tshechu', 'Workshops', 'Music', 'Sports', 'Thimphu'];

  return (
    <section className="relative overflow-hidden bg-[#FDFDF7] py-12 lg:py-20">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#29BBA3]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1E8B7A]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT SIDE: Copy & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F9F6] border border-[#C8EDE8] text-[#1E8B7A] text-xs font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#29BBA3] animate-pulse"></span>
              <span>The Premier Event Platform for Bhutan</span>
              <Sparkles className="w-3.5 h-3.5 text-[#29BBA3]" />
            </div>

            {/* Powerful Main Headline */}
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E352F] leading-[1.15] tracking-tight">
              Unlock Every Moment. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A]">Discover Events</span> at Your Fingertips.
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#4A5C57] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover cultural festivals, workshops, music concerts, sports tournaments, and community gatherings across Bhutan. Book verified tickets instantly.
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="glass-card p-2 rounded-2xl shadow-xl shadow-teal-900/8 border border-[#E6E1D8] flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center pl-4">
                  <Search className="w-5 h-5 text-[#29BBA3] mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, places, dzongkhags..."
                    className="w-full py-3 bg-transparent text-[#1E352F] placeholder-[#66756F] focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Search Tag Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-semibold text-[#66756F] mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F9F6] text-[#1E8B7A] hover:bg-[#29BBA3] hover:text-white border border-[#C8EDE8] transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white font-bold text-base shadow-xl shadow-teal-600/25 hover:shadow-teal-600/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-4 rounded-2xl border-2 border-[#E6E1D8] hover:border-[#29BBA3] text-[#1E352F] hover:text-[#1E8B7A] font-semibold text-base transition-all hover:bg-[#E6F9F6]/50"
              >
                Learn How It Works
              </button>
            </div>

            {/* Trust & Platform Stats */}
            <div className="pt-6 border-t border-[#E6E1D8] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="font-extrabold text-2xl text-[#1E352F]">50+</p>
                <p className="text-xs text-[#66756F] font-medium">Annual Festivals</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-extrabold text-2xl text-[#29BBA3]">15,000+</p>
                <p className="text-xs text-[#66756F] font-medium">Happy Attendees</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-extrabold text-2xl text-[#1E352F]">100%</p>
                <p className="text-xs text-[#66756F] font-medium">Digital & Verified</p>
              </div>
            </div>

          </motion.div>

          {/* RIGHT SIDE: Device Mockups & Floating Components */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#29BBA3]/15 via-[#1E8B7A]/8 to-[#F0A71E]/10 rounded-full blur-2xl transform scale-110"></div>

            {/* Laptop Mockup Box */}
            <div className="relative w-full max-w-md lg:max-w-lg glass-card rounded-3xl p-3 shadow-2xl shadow-teal-900/15 border border-[#E6E1D8]">

              {/* Laptop Screen Frame */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                {/* Screen Header Bar */}
                <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider">tixelo.bt</span>
                  <div className="w-10"></div>
                </div>

                {/* Laptop Content Preview */}
                <div className="relative h-64 sm:h-80 overflow-hidden bg-cover bg-center" style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop")',
                }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E352F]/90 via-slate-900/40 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0A71E] bg-[#F0A71E]/15 border border-[#F0A71E]/30 px-2 py-0.5 rounded-md w-fit mb-1">
                      Featured Cultural Event
                    </span>
                    <h3 className="font-bold text-xl leading-tight">Paro Tshechu 2026</h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#29BBA3]" /> Paro Rinpung Dzong • April 15 - 19
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Mobile Phone Mockup Overlay — live random event */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 sm:-left-8 w-44 sm:w-48 bg-slate-900 p-2 rounded-3xl shadow-2xl border-2 border-slate-700"
              >
                <div className="bg-slate-950 rounded-2xl p-2.5 space-y-2 text-white text-xs">
                  <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-1"></div>
                  <div className="flex justify-between items-center text-[10px] text-[#29BBA3] font-bold">
                    <span>Upcoming Events</span>
                    {heroEvent && (
                      <span className="text-[#F0A71E] font-normal">
                        {Number(heroEvent.event_price) > 0
                          ? `Nu. ${Number(heroEvent.event_price).toLocaleString()}`
                          : 'Free'}
                      </span>
                    )}
                  </div>
                  <div
                    className="rounded-lg h-20 bg-cover bg-center bg-slate-800"
                    style={{
                      backgroundImage: heroEvent?.event_image
                        ? `url("${heroEvent.event_image}")`
                        : 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop")',
                    }}
                  />
                  <p className="font-bold text-[11px] truncate">
                    {heroEvent?.event_name || 'Loading...'}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    {heroEvent?.event_location || ''}
                  </p>
                  <button
                    onClick={() => heroEvent && navigate(`/event/${heroEvent.id}`)}
                    className="w-full py-1 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] rounded-lg text-center text-[10px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Book Ticket
                  </button>
                </div>
              </motion.div>

              {/* Floating Badge: MADE FOR BHUTAN */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -top-6 -right-4 sm:-right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] text-white p-2 shadow-xl shadow-teal-600/30 flex flex-col items-center justify-center text-center border-2 border-white"
              >
                <Sparkles className="w-4 h-4 text-[#F0A71E] mb-0.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-black text-[10px] tracking-wider uppercase leading-none">MADE FOR</span>
                <span className="font-black text-xs text-[#F0A71E] leading-tight">BHUTAN</span>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;