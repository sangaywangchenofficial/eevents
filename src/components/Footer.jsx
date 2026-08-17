// Footer.jsx - TIXELO Brand Footer
import React, { useState } from 'react';
import {
  HiCalendar,
  HiMail,
  HiArrowRight,
  HiPhone,
  HiLocationMarker
} from 'react-icons/hi';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinks = {
    explore: [
      { label: 'Events', href: '/events' },
      { label: 'Categories', href: '/categories' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
    resources: [
      { label: 'Help Center', href: '/help-center' },
      { label: 'Booking Guide', href: '/booking-guide' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-conditions' },
    ],
  };

  return (
    <footer className="bg-[#FDFDF7] text-[#66756F] border-t border-[#E6E1D8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">

          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l1.5-1.5a2.5 2.5 0 010-3.54L6 3l15 15-1.5 1.5a2.5 2.5 0 01-3.54 0L15 18H9l-1.5 1.5a2.5 2.5 0 01-3.54 0L3 18V9z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="leading-none">
                <span className="font-black text-xl tracking-widest uppercase text-[#1E352F]">
                  TIX<span className="text-[#29BBA3]">ELO</span>
                </span>
                <p className="text-[9px] text-[#66756F] tracking-wide font-medium leading-none mt-0.5">Unlock the Moment. Discover Your Event.</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-[#66756F]">
              Discover, organize, and manage world-class events effortlessly. Your ultimate gateway to global conferences, local meetups, and everything in between.
            </p>
            {/* Social Icons Container */}
            <div className="flex space-x-3 pt-2 justify-center md:justify-start">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', url: 'https://www.facebook.com/eventbtn' },
                { icon: <FaInstagram />, label: 'Instagram', url: 'https://www.instagram.com/tixelo/' },
                { icon: <FaLinkedinIn />, label: 'LinkedIn', url: 'https://www.linkedin.com/company/tixelobtn/' },
                { icon: <FaTiktok />, label: 'TikTok', url: 'www.tiktok.com/@eventbtn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F4F3EC] border border-[#E6E1D8] text-[#66756F] hover:text-white hover:bg-gradient-to-r hover:from-[#29BBA3] hover:to-[#1E8B7A] hover:border-[#29BBA3] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29BBA3]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#1E352F] uppercase">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.explore.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-[#66756F] hover:text-[#1E8B7A] transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#1E352F] uppercase">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-[#66756F] hover:text-[#1E8B7A] transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#1E352F] uppercase">
              Stay Updated
            </h3>
            <p className="text-sm leading-relaxed max-w-sm text-[#66756F]">
              Subscribe to our monthly newsletter for hot event recommendations and organizer discount drops.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2 w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66756F]">
                <HiMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#E6E1D8] rounded-xl text-sm text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:ring-2 focus:ring-[#29BBA3] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute inset-y-1.5 right-1.5 px-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29BBA3]"
              >
                <HiArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-[#1E8B7A] animate-fade-in transition-all">
                🎉 Successfully subscribed! Check your inbox soon.
              </p>
            )}
          </div>

        </div>

        {/* Contact Info Row */}
        <div className="mt-12 pt-8 border-t border-[#E6E1D8] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-1 sm:space-y-0 sm:space-x-2 text-[#66756F]">
            <HiLocationMarker className="w-4 h-4 text-[#29BBA3] flex-shrink-0" />
            <span>Norzin Lam, Thimphu, Kingdom of Bhutan</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center text-[#66756F]">
            <HiPhone className="w-4 h-4 text-[#29BBA3] flex-shrink-0 mb-1 sm:mb-0 sm:mr-2" />
            <span>+975-16178615</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end space-y-1 sm:space-y-0 sm:space-x-2 text-[#66756F]">
            <HiMail className="w-4 h-4 text-[#29BBA3] flex-shrink-0" />
            <span>support@tixelo.bt</span>
          </div>
        </div>

      </div>

      <div className="bg-[#F4F3EC] border-t border-[#E6E1D8] py-6 text-center text-xs">
        <p className="text-[#66756F]">
          &copy; {new Date().getFullYear()} TIXELO. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;