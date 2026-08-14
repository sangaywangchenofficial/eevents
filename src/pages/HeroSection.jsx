import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, ShieldCheck, Ticket, Users, Sparkles, Star } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8FF] via-white to-[#FAF8FF] py-12 lg:py-20">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/20 rounded-full filter blur-3xl pointer-events-none"></div>

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200 text-[#6B21A8] text-xs font-poppins font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
              <span>The Premier Event Platform for Bhutan</span>
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            </div>

            {/* Powerful Main Headline */}
            <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E1B4B] leading-[1.15] tracking-tight">
              BHUTAN'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B21A8] via-[#8B5CF6] to-[#A855F7]">EVENTS</span> AT YOUR FINGERTIPS
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#475569] font-inter max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover cultural festivals, workshops, music concerts, sports tournaments, and community gatherings across Bhutan. Book verified tickets instantly.
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="glass-card p-2 rounded-2xl shadow-xl shadow-purple-900/10 border border-purple-200 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center pl-4">
                  <Search className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, places, dzongkhags..."
                    className="w-full py-3 bg-transparent text-[#1E1B4B] placeholder-slate-400 focus:outline-none font-inter text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#6B21A8] to-[#8B5CF6] hover:from-[#581C87] hover:to-[#6B21A8] text-white font-poppins font-semibold text-sm rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Search Tag Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-[#6B21A8] hover:bg-purple-600 hover:text-white border border-purple-100 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 rounded-2xl bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-bold text-base shadow-xl shadow-purple-900/25 hover:shadow-purple-900/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-4 rounded-2xl border-2 border-purple-200 hover:border-[#6B21A8] text-[#1E1B4B] hover:text-[#6B21A8] font-poppins font-semibold text-base transition-all hover:bg-purple-50/50"
              >
                Learn How It Works
              </button>
            </div>

            {/* Trust & Platform Stats */}
            <div className="pt-6 border-t border-purple-100/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="font-poppins font-extrabold text-2xl text-[#1E1B4B]">50+</p>
                <p className="text-xs text-slate-500 font-medium">Annual Festivals</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-poppins font-extrabold text-2xl text-[#6B21A8]">15,000+</p>
                <p className="text-xs text-slate-500 font-medium">Happy Attendees</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-poppins font-extrabold text-2xl text-[#1E1B4B]">100%</p>
                <p className="text-xs text-slate-500 font-medium">Digital & Verified</p>
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
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 via-pink-400/10 to-indigo-400/20 rounded-full blur-2xl transform scale-110"></div>

            {/* Laptop Mockup Box */}
            <div className="relative w-full max-w-md lg:max-w-lg glass-card rounded-3xl p-3 shadow-2xl shadow-purple-950/20 border border-purple-200/80">
              
              {/* Laptop Screen Frame */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                {/* Screen Header Bar */}
                <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider">eevents.bt</span>
                  <div className="w-10"></div>
                </div>

                {/* Laptop Content Preview */}
                <div className="relative h-64 sm:h-80 overflow-hidden bg-cover bg-center" style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop")',
                }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-slate-900/40 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-900/40 border border-amber-500/30 px-2 py-0.5 rounded-md w-fit mb-1">
                      Featured Cultural Event
                    </span>
                    <h3 className="font-poppins font-bold text-xl leading-tight">Paro Tshechu 2026</h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-purple-300" /> Paro Rinpung Dzong • April 15 - 19
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Mobile Phone Mockup Overlay */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 sm:-left-8 w-44 sm:w-48 bg-slate-900 p-2 rounded-3xl shadow-2xl border-2 border-slate-700"
              >
                <div className="bg-slate-950 rounded-2xl p-2.5 space-y-2 text-white text-xs">
                  <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-1"></div>
                  <div className="flex justify-between items-center text-[10px] text-purple-300 font-bold">
                    <span>Upcoming Events</span>
                    <span className="text-amber-400 font-normal">Nu. 500</span>
                  </div>
                  <div className="rounded-lg h-20 bg-cover bg-center" style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop")',
                  }}></div>
                  <p className="font-bold text-[11px] truncate">Thimphu Tshechu</p>
                  <p className="text-[9px] text-slate-400">Tendrel Thang, Thimphu</p>
                  <div className="w-full py-1 bg-[#6B21A8] rounded-lg text-center text-[10px] font-bold text-white shadow-sm">
                    Book Ticket
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge: MADE FOR BHUTAN */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -top-6 -right-4 sm:-right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-[#6B21A8] to-[#8B5CF6] text-white p-2 shadow-xl shadow-purple-900/30 flex flex-col items-center justify-center text-center border-2 border-white"
              >
                <Sparkles className="w-4 h-4 text-amber-300 mb-0.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-poppins font-black text-[10px] tracking-wider uppercase leading-none">MADE FOR</span>
                <span className="font-poppins font-black text-xs text-amber-300 leading-tight">BHUTAN</span>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;