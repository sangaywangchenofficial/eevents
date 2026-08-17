import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Ticket, ShieldCheck, CheckCircle2, QrCode, Headphones, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'DISCOVER EVENTS',
    description: 'Find cultural events, festivals, workshops, concerts & more across all 20 dzongkhags of Bhutan.',
  },
  {
    icon: Ticket,
    title: 'EASY TICKET BOOKING',
    description: 'Easy & secure online booking with instant reservation for all your favorite events.',
  },
  {
    icon: ShieldCheck,
    title: 'SECURE PAYMENTS',
    description: 'Safe, trusted payment processing integrated with local Bhutanese banking methods.',
  },
  {
    icon: CheckCircle2,
    title: 'VERIFIED EVENTS',
    description: '100% verified event listings published directly by recognized organizers and authorities.',
  },
  {
    icon: QrCode,
    title: 'DIGITAL TICKETS',
    description: 'Eco-friendly instant mobile QR tickets. No paper printing required for event entry.',
  },
  {
    icon: Headphones,
    title: 'FAST SUPPORT',
    description: 'Dedicated customer support team ready to assist with any booking or ticket queries.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-[#FDFDF7] relative overflow-hidden bhutan-pattern-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9F6] text-[#1E8B7A] text-xs font-semibold uppercase tracking-wide mb-3 border border-[#C8EDE8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1E352F]">
            Built for Bhutan's Modern Event Experience
          </h2>
          <p className="text-[#4A5C57] text-base mt-3">
            Connecting communities, preserving culture, and powering seamless ticketing from Paro to Tashigang.
          </p>
        </div>

        {/* Features 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-[#E6E1D8] shadow-lg hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 group transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] text-white flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300 mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-bold text-lg text-[#1E352F] tracking-wide mb-2 group-hover:text-[#1E8B7A] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[#4A5C57] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E1D8] flex items-center gap-2 text-xs font-semibold text-[#29BBA3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#29BBA3]"></span>
                  <span>Premium Guarantee</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
