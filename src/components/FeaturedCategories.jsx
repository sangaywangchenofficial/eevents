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

// TIXELO Color palette — teal/green/golden/saffron family
const COLOR_PALETTE = [
  { gradient: 'from-[#29BBA3]/10 via-[#29BBA3]/5 to-transparent', accent: 'bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white', border: 'hover:border-[#29BBA3]/50', shadow: 'shadow-teal-500/15' },
  { gradient: 'from-[#1E8B7A]/10 via-[#1E8B7A]/5 to-transparent', accent: 'bg-gradient-to-br from-[#1E8B7A] to-[#1E352F] text-white', border: 'hover:border-[#1E8B7A]/50', shadow: 'shadow-green-900/15' },
  { gradient: 'from-[#F0A71E]/10 via-[#F0A71E]/5 to-transparent', accent: 'bg-[#F0A71E] text-[#1E352F]', border: 'hover:border-[#F0A71E]/50', shadow: 'shadow-amber-400/15' },
  { gradient: 'from-[#F47F1D]/10 via-[#F47F1D]/5 to-transparent', accent: 'bg-[#F47F1D] text-white', border: 'hover:border-[#F47F1D]/50', shadow: 'shadow-orange-400/15' },
  { gradient: 'from-[#29BBA3]/8 via-transparent to-[#1E8B7A]/5', accent: 'bg-gradient-to-br from-[#29BBA3] to-[#F0A71E] text-white', border: 'hover:border-[#29BBA3]/40', shadow: 'shadow-teal-400/15' },
  { gradient: 'from-[#1E352F]/8 via-transparent to-[#29BBA3]/5', accent: 'bg-[#1E352F] text-white', border: 'hover:border-[#1E352F]/40', shadow: 'shadow-green-900/15' },
  { gradient: 'from-[#F0A71E]/8 via-transparent to-[#F47F1D]/5', accent: 'bg-gradient-to-br from-[#F0A71E] to-[#F47F1D] text-white', border: 'hover:border-[#F0A71E]/40', shadow: 'shadow-amber-400/15' },
  { gradient: 'from-[#1E8B7A]/8 via-transparent to-[#29BBA3]/5', accent: 'bg-gradient-to-br from-[#1E8B7A] to-[#29BBA3] text-white', border: 'hover:border-[#1E8B7A]/40', shadow: 'shadow-teal-600/15' },
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
    <section className="py-16 bg-[#F4F3EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9F6] text-[#1E8B7A] text-xs font-semibold tracking-wide uppercase mb-3 border border-[#C8EDE8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1E352F]">
              Discover Events by Category
            </h2>
            <p className="text-[#4A5C57] text-base mt-2 max-w-xl">
              From colorful sacred mask dances to modern tech summits, explore what Bhutan has to offer.
            </p>
          </div>

          <button
            onClick={() => navigate('/categories')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#1E8B7A] hover:text-[#29BBA3] font-semibold text-sm group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E6E1D8] shadow-md animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F9F6]" />
                  <div className="w-20 h-6 rounded-full bg-[#F4F3EC]" />
                </div>
                <div className="h-5 bg-[#F4F3EC] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#F4F3EC]/60 rounded w-full mb-1" />
                <div className="h-4 bg-[#F4F3EC]/60 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F9F6] flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-[#29BBA3]" />
            </div>
            <h3 className="font-bold text-lg text-[#1E352F] mb-1">No Categories Yet</h3>
            <p className="text-sm text-[#4A5C57]">Categories will appear here once added by the admin.</p>
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
                  className={`group cursor-pointer bg-white rounded-2xl p-6 border border-[#E6E1D8] shadow-md hover:shadow-xl hover:${colors.shadow} transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${colors.border} transform hover:-translate-y-1.5`}
                >
                  {/* Subtle hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.accent} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {cat.event_count !== undefined && (
                        <span className="text-xs font-semibold text-[#1E8B7A] px-3 py-1 bg-[#E6F9F6] rounded-full border border-[#C8EDE8]">
                          {cat.event_count} Event{cat.event_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-xl text-[#1E352F] group-hover:text-[#1E8B7A] transition-colors">
                      {cat.category_name}
                    </h3>

                    {cat.description && (
                      <p className="text-[#4A5C57] text-sm mt-2 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#E6E1D8] flex items-center justify-between text-xs font-semibold text-[#1E8B7A]">
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
