// About.jsx - White Background Theme
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaHeart,
    FaUsers,
    FaCalendarCheck,
    FaTicketAlt,
    FaStar,
    FaShieldAlt,
    FaClock,
    FaGlobe,
    FaRocket,
    FaHands,
    FaLightbulb,
    FaArrowRight,
    FaCheckCircle,
    FaAward,
    FaChartLine,
    FaMobileAlt,
    FaHeadset,
    FaLock,
    FaSearch,
    FaUserPlus
} from 'react-icons/fa';
import { MdEvent, MdLocationOn, MdDateRange, MdPayment } from 'react-icons/md';

const About = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Stats data
    const stats = [
        { icon: FaUsers, value: '50K+', label: 'Active Users' },
        { icon: MdEvent, value: '10K+', label: 'Events Hosted' },
        { icon: FaTicketAlt, value: '100K+', label: 'Tickets Sold' },
        { icon: FaStar, value: '4.8/5', label: 'User Rating' }
    ];

    // Features data
    const features = [
        {
            icon: FaRocket,
            title: 'Easy Discovery',
            description: 'Find amazing events happening near you with our smart search and recommendation system.'
        },
        {
            icon: FaTicketAlt,
            title: 'Instant Booking',
            description: 'Book your spot in seconds with our seamless and secure booking process.'
        },
        {
            icon: FaShieldAlt,
            title: 'Secure Payments',
            description: 'Your transactions are protected with industry-standard encryption and security.'
        },
        {
            icon: FaClock,
            title: '24/7 Support',
            description: 'Our dedicated support team is always ready to help you with any questions.'
        },
        {
            icon: FaGlobe,
            title: 'Global Events',
            description: 'Discover events from around the world and connect with people everywhere.'
        },
        {
            icon: FaMobileAlt,
            title: 'Mobile Friendly',
            description: 'Access your events and tickets anytime, anywhere from any device.'
        }
    ];

    // How it works steps
    const steps = [
        {
            icon: FaSearch,
            title: 'Discover Events',
            description: 'Browse through our curated list of events and find what excites you.'
        },
        {
            icon: FaCalendarCheck,
            title: 'Book Your Spot',
            description: 'Select your tickets and complete the booking in just a few clicks.'
        },
        {
            icon: FaTicketAlt,
            title: 'Get Your Ticket',
            description: 'Receive your e-ticket instantly and get ready for the event.'
        },
        {
            icon: FaStar,
            title: 'Enjoy & Review',
            description: 'Attend the event and share your experience with the community.'
        }
    ];

    // Values data
    const values = [
        {
            icon: FaHands,
            title: 'Community First',
            description: 'We believe in building a strong community of event lovers and organizers.'
        },
        {
            icon: FaLightbulb,
            title: 'Innovation',
            description: 'We constantly innovate to make event discovery and booking seamless.'
        },
        {
            icon: FaHeart,
            title: 'Passion for Events',
            description: 'Our team is passionate about creating memorable experiences for everyone.'
        },
        {
            icon: FaShieldAlt,
            title: 'Trust & Security',
            description: 'Your safety and privacy are our top priorities.'
        }
    ];

    return (
        <>
            <PublicLayout>
                <div className="min-h-screen bg-white">
                    {/* Hero Section */}
                    <section className="relative bg-gradient-to-br from-[#FDFDF7] via-white to-[#F4F3EC] py-20 md:py-28 overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6F9F6]/50 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8EDE8]/50 rounded-full blur-3xl"></div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 bg-[#E6F9F6] border border-[#E6E1D8] rounded-full px-4 py-1.5 mb-6">
                                    <FaHeart className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] tracking-wider uppercase">
                                        Built with Passion
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
                                    About <span className="bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] bg-clip-text text-transparent">TIXELO</span>
                                </h1>

                                <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                                    We're on a mission to connect people through unforgettable experiences.
                                    Whether you're hosting or attending, TIXELO makes it easy to discover,
                                    book, and enjoy amazing events.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        to="/events"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl hover:from-[#29BBA3] hover:to-[#1E8B7A] transition-all duration-300 shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 font-medium"
                                    >
                                        Explore Events
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#1E8B7A] transition-all duration-300 font-medium"
                                    >
                                        <FaUserPlus />
                                        Join Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-16 bg-gray-50 border-y border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="text-center group transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E6F9F6] text-[#29BBA3] mb-3 group-hover:bg-[#C8EDE8] transition-all duration-300">
                                            <stat.icon className="text-2xl" />
                                        </div>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        Why Choose <span className="text-[#29BBA3]">TIXELO</span>
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    We make event discovery and booking simple, secure, and enjoyable for everyone.
                                </p>
                                <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#E6E1D8] transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/10 transform hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6F9F6] to-[#C8EDE8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="text-2xl text-[#29BBA3]" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#29BBA3] transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-20 bg-gray-50 border-y border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        How It <span className="text-[#29BBA3]">Works</span>
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Get started with TIXELO in just four simple steps.
                                </p>
                                <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="relative text-center group"
                                    >
                                        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#E6E1D8] transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg">
                                            <div className="relative inline-block">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6F9F6] to-[#C8EDE8] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <step.icon className="text-3xl text-[#29BBA3]" />
                                                </div>
                                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-teal-900/30">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#29BBA3] transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                                <FaArrowRight className="text-gray-300 text-xl" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Our Values Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        Our <span className="text-[#29BBA3]">Values</span>
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    The principles that guide everything we do at TIXELO.
                                </p>
                                <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {values.map((value, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-[#E6E1D8] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-[#E6F9F6] flex items-center justify-center mx-auto mb-4">
                                            <value.icon className="text-2xl text-[#29BBA3]" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonial Section */}
                    <section className="py-20 bg-gray-50 border-y border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        What Our <span className="text-[#29BBA3]">Users Say</span>
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Real stories from real people who love using TIXELO.
                                </p>
                                <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#E6E1D8] transition-all duration-300 shadow-sm hover:shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6F9F6] to-[#C8EDE8] flex items-center justify-center">
                                            <span className="text-xl font-bold text-[#29BBA3]">JD</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">John Doe</p>
                                            <div className="flex items-center gap-0.5">
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "TIXELO made it so easy to find and book events. The platform is intuitive
                                        and the support team is amazing!"
                                    </p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#E6E1D8] transition-all duration-300 shadow-sm hover:shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                            <span className="text-xl font-bold text-emerald-600">JS</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Jane Smith</p>
                                            <div className="flex items-center gap-0.5">
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "I love how easy it is to discover new events in my area. The booking process
                                        is seamless and secure."
                                    </p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#E6E1D8] transition-all duration-300 shadow-sm hover:shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                            <span className="text-xl font-bold text-amber-600">MJ</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Mike Johnson</p>
                                            <div className="flex items-center gap-0.5">
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <FaStar className="text-yellow-400 text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "As an event organizer, TIXELO has been a game-changer. The platform helps
                                        me reach more people and manage tickets effortlessly."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-br from-[#FDFDF7] via-[#FDFDF7] to-purple-50 border border-[#E6E1D8] rounded-3xl p-8 md:p-16 text-center shadow-xl shadow-teal-900/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6F9F6]/30 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8EDE8]/30 rounded-full blur-3xl"></div>

                                <div className="relative">
                                    <div className="inline-flex items-center gap-2 bg-[#E6F9F6] border border-[#E6E1D8] rounded-full px-4 py-1.5 mb-6">
                                        <FaRocket className="text-[#29BBA3] text-xs" />
                                        <span className="text-xs font-medium text-[#1E352F] tracking-wider uppercase">
                                            Get Started Today
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        Ready to <span className="text-[#29BBA3]">Discover</span> Your Next Adventure?
                                    </h2>
                                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                                        Join thousands of happy users and start exploring amazing events near you.
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-4">
                                        <Link
                                            to="/events"
                                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl hover:from-[#29BBA3] hover:to-[#1E8B7A] transition-all duration-300 shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 font-medium"
                                        >
                                            <FaCalendarCheck />
                                            Explore Events
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#1E8B7A] transition-all duration-300 font-medium"
                                        >
                                            <FaUserPlus />
                                            Join for Free
                                        </Link>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FaLock className="text-emerald-500" />
                                            Secure & Safe
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="flex items-center gap-1">
                                            <FaCheckCircle className="text-emerald-500" />
                                            Free to Join
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="flex items-center gap-1">
                                            <FaHeadset className="text-[#29BBA3]" />
                                            24/7 Support
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
};

export default About;