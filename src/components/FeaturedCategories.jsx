import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PartyPopper, BookOpen, Music, Trophy, Palette, Sun,
  Sparkles, ArrowRight, Layers, Tag, Star, Heart,
  Camera, Users, Megaphone, Utensils, Globe, Zap
} from 'lucide-react';

// Icon pool — assigned by index so each category gets a unique icon
const ICON_POOL = [
  PartyPopper, BookOpen, Music, Trophy, Palette, Sun,
  Camera, Users, Megaphone, Utensils, Globe, Zap,
  Layers, Tag, Star, Heart,
];

// Color palette — assigned by index
const COLOR_PALETTE = [
  { gradient: 'from-purple-500/10 via-purple-500/5 to-transparent', accent: 'bg-purple-600 text-white', border: 'hover:border-purple-300' },
  { gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent', accent: 'bg-indigo-600 text-white', border: 'hover:border-indigo-300' },
  { gradient: 'from-violet-500/10 via-violet-500/5 to-transparent', accent: 'bg-violet-600 text-white', border: 'hover:border-violet-300' },
  { gradient: 'from-amber-500/10 via-amber-500/5 to-transparent', accent: 'bg-amber-600 text-white', border: 'hover:border-amber-300' },
  { gradient: 'from-pink-500/10 via-pink-500/5 to-transparent', accent: 'bg-pink-600 text-white', border: 'hover:border-pink-300' },
  { gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent', accent: 'bg-emerald-600 text-white', border: 'hover:border-emerald-300' },
  { gradient: 'from-rose-500/10 via-rose-500/5 to-transparent', accent: 'bg-rose-600 text-white', border: 'hover:border-rose-300' },
  { gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent', accent: 'bg-cyan-600 text-white', border: 'hover:border-cyan-300' },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/view-categories/');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const list = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setCategories(list);
    } catch (err) {
      console.warn('Failed to load categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-16 bg-[#FAF8FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#1E1B4B]">
              Discover Events by Category
            </h2>
            <p className="text-[#475569] text-base mt-2 max-w-xl">
              From colorful sacred mask dances to modern tech summits, explore what Bhutan has to offer.
            </p>
          </div>

          <button
            onClick={() => navigate('/categories')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#6B21A8] hover:text-[#581C87] font-poppins font-semibold text-sm group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-md animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100" />
                  <div className="w-20 h-6 rounded-full bg-purple-50" />
                </div>
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-50 rounded w-full mb-1" />
                <div className="h-4 bg-slate-50 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-poppins font-bold text-lg text-[#1E1B4B] mb-1">No Categories Yet</h3>
            <p className="text-sm text-[#475569] font-inter">Categories will appear here once added by the admin.</p>
          </div>
        ) : (
          /* Category Grid Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const colors = COLOR_PALETTE[idx % COLOR_PALETTE.length];
              const Icon = ICON_POOL[idx % ICON_POOL.length];
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => handleCategoryClick(cat.category_name)}
                  className={`group cursor-pointer bg-white rounded-2xl p-6 border border-purple-100 shadow-md hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${colors.border} transform hover:-translate-y-1.5`}
                >
                  {/* Subtle hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.accent} shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {cat.event_count !== undefined && (
                        <span className="text-xs font-poppins font-semibold text-purple-700 px-3 py-1 bg-purple-50 rounded-full border border-purple-100">
                          {cat.event_count} Event{cat.event_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <h3 className="font-poppins font-bold text-xl text-[#1E1B4B] group-hover:text-[#6B21A8] transition-colors">
                      {cat.category_name}
                    </h3>

                    {cat.description && (
                      <p className="text-[#475569] text-sm mt-2 leading-relaxed font-inter line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-purple-50/80 flex items-center justify-between text-xs font-poppins font-semibold text-[#6B21A8]">
                    <span>Browse Events</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
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

export default FeaturedCategories;
