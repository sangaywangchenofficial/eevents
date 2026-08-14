import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, BookOpen, Music, Trophy, Palette, Sun, Sparkles, ArrowRight } from 'lucide-react';

const categoriesData = [
  {
    id: 'festivals',
    name: 'Festivals',
    count: '18+ Events',
    icon: PartyPopper,
    description: 'Tshechus, Mask Dances & Dzong celebrations across Bhutan.',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    accentColor: 'bg-purple-600 text-white',
    borderHover: 'hover:border-purple-300',
  },
  {
    id: 'workshops',
    name: 'Workshops',
    count: '12+ Events',
    icon: BookOpen,
    description: 'Tech bootcamps, weaving, wood carving & skill sessions.',
    gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    accentColor: 'bg-indigo-600 text-white',
    borderHover: 'hover:border-indigo-300',
  },
  {
    id: 'music',
    name: 'Music & Concerts',
    count: '15+ Events',
    icon: Music,
    description: 'Live dranyen performances, modern pop & local indie bands.',
    gradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
    accentColor: 'bg-violet-600 text-white',
    borderHover: 'hover:border-violet-300',
  },
  {
    id: 'sports',
    name: 'Sports & Archery',
    count: '10+ Events',
    icon: Trophy,
    description: 'Traditional Dha (Archery), Bhutan Marathons & Football.',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    accentColor: 'bg-amber-600 text-white',
    borderHover: 'hover:border-amber-300',
  },
  {
    id: 'exhibitions',
    name: 'Exhibitions',
    count: '8+ Events',
    icon: Palette,
    description: 'Art displays, photography expos & textiles of Bhutan.',
    gradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
    accentColor: 'bg-pink-600 text-white',
    borderHover: 'hover:border-pink-300',
  },
  {
    id: 'religious',
    name: 'Religious Events',
    count: '14+ Events',
    icon: Sun,
    description: 'Sacred pujas, Moenlam Chenmo & monastic teachings.',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    accentColor: 'bg-emerald-600 text-white',
    borderHover: 'hover:border-emerald-300',
  },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();

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

        {/* Category Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group cursor-pointer bg-white rounded-2xl p-6 border border-purple-100 shadow-md hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${cat.borderHover} transform hover:-translate-y-1.5`}
              >
                {/* Subtle Card Background Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.accentColor} shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-poppins font-semibold text-purple-700 px-3 py-1 bg-purple-50 rounded-full border border-purple-100">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-xl text-[#1E1B4B] group-hover:text-[#6B21A8] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-[#475569] text-sm mt-2 leading-relaxed font-inter">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-purple-50/80 flex items-center justify-between text-xs font-poppins font-semibold text-[#6B21A8]">
                  <span>Browse Events</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCategories;
