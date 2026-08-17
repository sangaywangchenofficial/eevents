import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, QrCode, Bell, Zap, Shield, Sparkles, Check } from 'lucide-react';

const AppShowcase = () => {
  return (
    <section className="py-20 bg-[#FDFDF7] border-t border-[#E6E1D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Side: Mockup Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#29BBA3]/15 via-[#1E8B7A]/8 to-[#F0A71E]/10 rounded-full blur-3xl transform scale-90"></div>

            {/* Mobile Phone Mockup Box */}
            <div className="relative w-full max-w-sm glass-card rounded-[36px] p-4 border-4 border-slate-800 shadow-2xl bg-slate-950 text-white">
              
              {/* Phone Notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-4"></div>

              {/* Mobile Screen Header */}
              <div className="p-3 space-y-3">
                <div className="flex justify-between items-center text-xs text-[#29BBA3] font-bold">
                  <span>TIXELO App</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    Live Verified
                  </span>
                </div>

                {/* QR Code Digital Ticket Preview */}
                <div className="bg-white text-slate-900 p-4 rounded-2xl text-center space-y-3 shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#E6F9F6] text-[#1E8B7A] flex items-center justify-center mx-auto">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Paro Tshechu Pass</p>
                    <p className="text-[10px] text-slate-500 font-medium">Ticket #BHU-8849-2026</p>
                  </div>

                  {/* Simulated QR Code SVG Graphic */}
                  <div className="w-36 h-36 bg-slate-900 rounded-xl mx-auto p-2 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-[#29BBA3] rounded-lg flex flex-col items-center justify-center text-white text-[9px] font-mono gap-1">
                      <QrCode className="w-16 h-16 text-[#29BBA3] animate-pulse" />
                      <span>SCAN AT ENTRANCE</span>
                    </div>
                  </div>
                  
                  <div className="pt-1 flex items-center justify-center gap-1 text-[10px] text-slate-600">
                    <Check className="w-3 h-3 text-[#29BBA3]" />
                    <span>Valid Entry for 1 Person</span>
                  </div>
                </div>

                {/* Quick Action Badges */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="bg-slate-900 p-2 rounded-xl flex items-center gap-2 border border-slate-800">
                    <Bell className="w-3.5 h-3.5 text-[#F0A71E]" />
                    <span>Event Reminders</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl flex items-center gap-2 border border-slate-800">
                    <Zap className="w-3.5 h-3.5 text-[#29BBA3]" />
                    <span>Instant Entry</span>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>

          {/* Right Side: Copy & App Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9F6] text-[#1E8B7A] text-xs font-semibold uppercase tracking-wide border border-[#C8EDE8]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Experience</span>
            </div>

            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1E352F]">
              Your Tickets Always in Your Pocket
            </h2>

            <p className="text-[#4A5C57] text-base leading-relaxed">
              Experience fast, paperless event entry. Access all your booked tickets, seat reservations, and dzongkhag event notifications anywhere in Bhutan—even offline!
            </p>

            {/* List of Features */}
            <div className="space-y-4 pt-2">
              {[
                { title: 'Instant QR Entry', desc: 'No printing required. Scan your smartphone at festival gates.' },
                { title: 'Live Event Notifications', desc: 'Get real-time weather and schedule updates for outdoor Tshechus.' },
                { title: 'Local Bank Payments', desc: 'Seamlessly pay via mBoB, B-WALLET, and local Bhutanese card portals.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-[#F4F3EC] border border-[#E6E1D8]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1E352F]">{item.title}</h4>
                    <p className="text-xs text-[#66756F] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AppShowcase;
