import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const CallToAction = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-20 bg-[#F4F3EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1E352F] via-[#1E8B7A] to-[#29BBA3] text-white p-8 sm:p-14 overflow-hidden shadow-2xl shadow-teal-900/30">
          
          {/* Subtle Decorative Pattern Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#29BBA3_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F0A71E] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#F0A71E]" />
              <span>Join Bhutan's Digital Event Revolution</span>
            </div>

            {/* Poster Main Tagline */}
            <h2 className="font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-white">
              CELEBRATE. CONNECT. CULTURE.
            </h2>

            {/* Supporting Tagline */}
            <p className="text-base sm:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
              Support local. Experience more. Build memories. Subscribe to receive upcoming Tshechu announcements and special ticket releases.
            </p>

            {/* Email Subscription Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto pt-4">
              <div className="glass-panel-dark p-2 rounded-2xl border border-white/20 shadow-xl flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center pl-4">
                  <Mail className="w-5 h-5 text-[#29BBA3]/80 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#F0A71E] hover:bg-[#d4921a] text-[#1E352F] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/40"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kadrinchey! You're subscribed to TIXELO.</span>
              </motion.div>
            )}

            {/* Bottom URL Highlight matching poster */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-white/80">
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                EXPLORE NOW
              </button>
              <span>www.tixelo.bt</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToAction;