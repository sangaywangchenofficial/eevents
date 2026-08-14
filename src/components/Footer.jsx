// Footer.jsx - White Background Footer
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
    <footer className="bg-white text-gray-500 border-t border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">

          {/* Column 1: Brand Info - Centered on Mobile */}
          <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer">
              <img src={logo} alt="eEvents Logo" className="h-9 w-auto object-contain" />
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent hidden">
                eEvents
              </span>
              <span className="text-gray-900 dark:text-stone-100 text-xl font-semibold">Eventbtn</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Discover, organize, and manage world-class events effortlessly. Your ultimate gateway to global conferences, local meetups, and everything in between.
            </p>
            {/* Social Icons Container */}
            <div className="flex space-x-3 pt-2 justify-center md:justify-start">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', url: 'https://www.facebook.com/eventbtn' },
                { icon: <FaInstagram />, label: 'Instagram', url: 'https://www.instagram.com/eeventbtn/' },
                { icon: <FaLinkedinIn />, label: 'LinkedIn', url: 'https://www.linkedin.com/company/eeventsbtn/' },
                { icon: <FaTiktok />, label: 'TikTok', url: 'www.tiktok.com/@eventbtn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:border-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore - Centered on Mobile */}
          <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.explore.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-gray-500 hover:text-purple-600 transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources - Centered on Mobile */}
          <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-gray-500 hover:text-purple-600 transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription - Centered on Mobile */}
          <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Stay Updated
            </h3>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Subscribe to our monthly newsletter for hot event recommendations and organizer discount drops.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2 w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <HiMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute inset-y-1.5 right-1.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <HiArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-600 animate-fade-in transition-all">
                🎉 Successfully subscribed! Check your inbox soon.
              </p>
            )}
          </div>

        </div>

        {/* Contact Info Row - Fully Centered on Mobile */}
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-1 sm:space-y-0 sm:space-x-2 text-gray-500">
            <HiLocationMarker className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>Norzin Lam, Thimphu, Kingdom of Bhutan</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center text-gray-500">
            <HiPhone className="w-4 h-4 text-purple-600 flex-shrink-0 mb-1 sm:mb-0 sm:mr-2" />
            <span>+975 2 123 456</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end space-y-1 sm:space-y-0 sm:space-x-2 text-gray-500">
            <HiMail className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>support@eevents.bt</span>
          </div>
        </div>

      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-6 text-center text-xs">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} eEvents Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;