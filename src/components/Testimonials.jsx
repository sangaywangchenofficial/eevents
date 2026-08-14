import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    name: 'Sonam Choden',
    role: 'Festival Attendee',
    location: 'Thimphu, Bhutan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'Booking Paro Tshechu tickets through eEvents was so smooth! I received my instant digital QR pass on my phone right away without waiting in long queues at the dzong gate.',
  },
  {
    id: 2,
    name: 'Kinley Tshering',
    role: 'Cultural Tourist & Photographer',
    location: 'Paro, Bhutan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'eEvents Bhutan is a game-changer! Finding local music concerts and religious prayer gatherings across Bumthang has never been easier. Highly recommended for locals and tourists.',
  },
  {
    id: 3,
    name: 'Dechen Wangmo',
    role: 'Workshop Participant',
    location: 'Punakha, Bhutan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'The payment integration with local Bhutanese banking apps was seamless. I registered for a traditional weaving workshop in Punakha within two minutes!',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const current = reviewsData[currentIndex];

  return (
    <section className="py-20 bg-[#FAF8FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Feedback</span>
          </div>
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#1E1B4B]">
            Loved by Eventgoers Across Bhutan
          </h2>
          <p className="text-[#475569] text-base mt-2 font-inter">
            Read authentic reviews from attendees who discovered unforgettable experiences with eEvents.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-200/80 shadow-xl shadow-purple-900/10 relative overflow-hidden"
            >
              <Quote className="absolute top-6 right-8 w-16 h-16 text-purple-200/40 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* User Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-300 shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Review Body */}
                <div className="flex-1 text-center sm:text-left space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="font-inter text-base sm:text-lg text-[#1E1B4B] italic leading-relaxed">
                    "{current.quote}"
                  </p>

                  <div>
                    <h4 className="font-poppins font-bold text-lg text-[#1E1B4B]">{current.name}</h4>
                    <p className="text-xs text-purple-600 font-semibold">{current.role} • {current.location}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border border-purple-200 text-[#1E1B4B] hover:bg-purple-600 hover:text-white shadow-md transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {reviewsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[#6B21A8] w-8' : 'bg-purple-200'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border border-purple-200 text-[#1E1B4B] hover:bg-purple-600 hover:text-white shadow-md transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
