import React, { useState } from 'react';
import {
    HiCalendar,
    HiMail,
    HiArrowRight,
    HiPhone,
    HiLocationMarker
} from 'react-icons/hi';
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn
} from 'react-icons/fa';

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
            { label: 'Upcoming Events', href: '#events' },
            { label: 'Popular Categories', href: '#categories' },
            { label: 'Featured Venues', href: '#venues' },
            { label: 'Pricing Plans', href: '#pricing' },
        ],
        resources: [
            { label: 'Help Center / FAQs', href: '#faq' },
            { label: 'Organizer Guide', href: '#guide' },
            { label: 'Terms of Service', href: '#terms' },
            { label: 'Privacy Policy', href: '#privacy' },
        ],
    };

    return (
        <footer className="bg-zinc-900 text-stone-400 border-t border-stone-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">

                    {/* Column 1: Brand Info - Centered on Mobile */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                        <div className="flex items-center space-x-2.5 cursor-pointer">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-950/40">
                                <HiCalendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                eEvents
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm text-stone-400">
                            Discover, organize, and manage world-class events effortlessly. Your ultimate gateway to global conferences, local meetups, and everything in between.
                        </p>
                        {/* Social Icons Container */}
                        <div className="flex space-x-3 pt-2 justify-center md:justify-start">
                            {[
                                { icon: <FaTwitter />, label: 'Twitter' },
                                { icon: <FaFacebookF />, label: 'Facebook' },
                                { icon: <FaInstagram />, label: 'Instagram' },
                                { icon: <FaLinkedinIn />, label: 'LinkedIn' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={`#${social.label.toLowerCase()}`}
                                    aria-label={social.label}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-950/40 border border-stone-800 text-stone-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:border-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Explore - Centered on Mobile */}
                    <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider text-stone-200 uppercase">
                            Explore
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {footerLinks.explore.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="text-stone-400 hover:text-purple-400 transition-colors duration-150">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources - Centered on Mobile */}
                    <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider text-stone-200 uppercase">
                            Resources
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {footerLinks.resources.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="text-stone-400 hover:text-purple-400 transition-colors duration-150">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter Subscription - Centered on Mobile */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider text-stone-200 uppercase">
                            Stay Updated
                        </h3>
                        <p className="text-sm leading-relaxed max-w-sm text-stone-400">
                            Subscribe to our monthly newsletter for hot event recommendations and organizer discount drops.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative mt-2 w-full max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                                <HiMail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-12 py-2.5 bg-stone-950/40 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                            <p className="text-xs text-emerald-400 animate-fade-in transition-all">
                                🎉 Successfully subscribed! Check your inbox soon.
                            </p>
                        )}
                    </div>

                </div>

                {/* Contact Info Row - Fully Centered on Mobile */}
                <div className="mt-12 pt-8 border-t border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center md:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-1 sm:space-y-0 sm:space-x-2 text-stone-400">
                        <HiLocationMarker className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>123 Innovation Boulevard, Tech District</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center text-stone-400">
                        <HiPhone className="w-4 h-4 text-purple-500 flex-shrink-0 mb-1 sm:mb-0 sm:mr-2" />
                        <span>+1 (555) 234-5678</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end space-y-1 sm:space-y-0 sm:space-x-2 text-stone-400">
                        <HiMail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>support@eevents.com</span>
                    </div>
                </div>

            </div>

            <div className="bg-zinc-900/80 border-t border-stone-800/50 py-6 text-center text-xs">
                <p className="text-stone-500">
                    &copy; {new Date().getFullYear()} eEvents Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;