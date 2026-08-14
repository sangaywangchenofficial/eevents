// HelpCenter.jsx - Help Center & FAQs Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaSearch,
    FaArrowRight,
    FaQuestionCircle,
    FaTicketAlt,
    FaCalendarCheck,
    FaUserCircle,
    FaCreditCard,
    FaShieldAlt,
    FaHeadset,
    FaEnvelope,
    FaPhone,
    FaChevronDown,
    FaChevronUp,
    FaBook,
    FaVideo,
    FaFileAlt,
    FaComments,
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaHeart,
    FaStar
} from 'react-icons/fa';
import { MdHelp, MdEvent, MdPayment, MdSettings } from 'react-icons/md';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFaqs, setExpandedFaqs] = useState({});
    const [filteredFaqs, setFilteredFaqs] = useState([]);

    // FAQ Categories
    const categories = [
        { id: 'all', label: 'All Topics', icon: FaQuestionCircle },
        { id: 'bookings', label: 'Bookings', icon: FaTicketAlt },
        { id: 'events', label: 'Events', icon: FaCalendarCheck },
        { id: 'account', label: 'Account', icon: FaUserCircle },
        { id: 'payments', label: 'Payments', icon: FaCreditCard },
        { id: 'security', label: 'Security', icon: FaShieldAlt }
    ];

    // FAQ Data
    const faqs = [
        // Bookings
        {
            id: 1,
            category: 'bookings',
            question: 'How do I book an event?',
            answer: 'Booking an event is simple! Browse our events, select your preferred date and ticket type, choose the quantity, and click "Book Now". You\'ll receive a confirmation email and your e-ticket will be available in your dashboard.'
        },
        {
            id: 2,
            category: 'bookings',
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel your booking up to 48 hours before the event start time. Go to "My Bookings" in your dashboard, select the booking, and click "Cancel". Refunds will be processed within 5-7 business days.'
        },
        {
            id: 3,
            category: 'bookings',
            question: 'How do I view my booking history?',
            answer: 'You can view your complete booking history in your dashboard under "My Bookings". All past and upcoming bookings are displayed there with their current status.'
        },
        {
            id: 4,
            category: 'bookings',
            question: 'Can I transfer my ticket to someone else?',
            answer: 'Yes, tickets are transferable. Go to "My Bookings", select the booking, and click "Transfer Ticket". Enter the recipient\'s email address and they\'ll receive the ticket.'
        },

        // Events
        {
            id: 5,
            category: 'events',
            question: 'How do I find events near me?',
            answer: 'Use our search and filter features to find events by location, date, category, or price. You can also enable location services to see events happening near you.'
        },
        {
            id: 6,
            category: 'events',
            question: 'What happens if an event is cancelled?',
            answer: 'If an event is cancelled, you\'ll receive a full refund automatically. You\'ll also get a notification via email and in your dashboard. Refunds are processed within 5-7 business days.'
        },
        {
            id: 7,
            category: 'events',
            question: 'How do I know if an event is available?',
            answer: 'Events show real-time availability. You\'ll see "Available" or "Sold Out" badges on event cards. If tickets are available, you\'ll be able to select the quantity.'
        },
        {
            id: 8,
            category: 'events',
            question: 'Can I get a refund if I can\'t attend?',
            answer: 'Refunds are available up to 48 hours before the event. For last-minute cancellations, please contact support directly for assistance.'
        },

        // Account
        {
            id: 9,
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Click "Register" in the top navigation, fill in your details (name, email, phone, password), and submit. You\'ll receive a confirmation email and can start booking events immediately.'
        },
        {
            id: 10,
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a password reset link. Follow the link to create a new password.'
        },
        {
            id: 11,
            category: 'account',
            question: 'How do I update my profile?',
            answer: 'Go to your dashboard, click "Profile Settings" to update your name, email, phone number, and other personal information.'
        },
        {
            id: 12,
            category: 'account',
            question: 'Can I delete my account?',
            answer: 'Yes, you can delete your account from the "Account Settings" section. Please note that this action is permanent and cannot be undone.'
        },

        // Payments
        {
            id: 13,
            category: 'payments',
            question: 'What payment methods are accepted?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital wallets. All transactions are secure and encrypted.'
        },
        {
            id: 14,
            category: 'payments',
            question: 'Is my payment information secure?',
            answer: 'Yes, all payments are processed through industry-standard secure gateways. We never store your payment information on our servers.'
        },
        {
            id: 15,
            category: 'payments',
            question: 'How do I view my payment history?',
            answer: 'You can view your complete payment history in your dashboard under "Payment History". All transactions are listed with dates and amounts.'
        },
        {
            id: 16,
            category: 'payments',
            question: 'What if my payment fails?',
            answer: 'If your payment fails, you\'ll see an error message. Try again with a different payment method or contact your bank. Your booking will be saved for 24 hours.'
        },

        // Security
        {
            id: 17,
            category: 'security',
            question: 'How does eEvents protect my data?',
            answer: 'We use industry-standard encryption (SSL/TLS) for all data transmission. Your personal information is stored securely and never shared with third parties without your consent.'
        },
        {
            id: 18,
            category: 'security',
            question: 'What should I do if I suspect fraud?',
            answer: 'Contact our support team immediately if you notice any suspicious activity. We\'ll investigate and take appropriate action to protect your account.'
        }
    ];

    // Help categories
    const helpCategories = [
        {
            icon: FaTicketAlt,
            title: 'Booking & Tickets',
            description: 'Learn how to book, cancel, and manage your tickets.',
            color: 'purple'
        },
        {
            icon: FaCalendarCheck,
            title: 'Events & Calendar',
            description: 'Discover events, get reminders, and manage your schedule.',
            color: 'blue'
        },
        {
            icon: FaUserCircle,
            title: 'Account Management',
            description: 'Manage your profile, settings, and preferences.',
            color: 'emerald'
        },
        {
            icon: FaCreditCard,
            title: 'Payments & Billing',
            description: 'Understand payments, refunds, and billing cycles.',
            color: 'amber'
        },
        {
            icon: FaShieldAlt,
            title: 'Security & Privacy',
            description: 'Learn about data protection and account security.',
            color: 'rose'
        },
        {
            icon: FaHeadset,
            title: 'Customer Support',
            description: 'Get help from our support team when you need it.',
            color: 'indigo'
        }
    ];

    // Filter FAQs based on category and search
    useEffect(() => {
        let filtered = faqs;

        if (activeCategory !== 'all') {
            filtered = filtered.filter(faq => faq.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        }

        setFilteredFaqs(filtered);
    }, [activeCategory, searchQuery]);

    const toggleFaq = (id) => {
        setExpandedFaqs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getColorClasses = (color) => {
        const colors = {
            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
            amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
            rose: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
            indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
        };
        return colors[color] || colors.purple;
    };

    const getIconColor = (color) => {
        const colors = {
            purple: 'text-purple-600',
            blue: 'text-blue-600',
            emerald: 'text-emerald-600',
            amber: 'text-amber-600',
            rose: 'text-rose-600',
            indigo: 'text-indigo-600'
        };
        return colors[color] || colors.purple;
    };

    return (
        <>
            <PublicLayout>
                <div className="min-h-screen bg-white">
                    {/* Hero Section */}
                    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30"></div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-5">
                                    <FaQuestionCircle className="text-purple-600 text-xs" />
                                    <span className="text-xs font-medium text-purple-700 tracking-wider uppercase">
                                        Help Center
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
                                    How Can We <span className="text-purple-600">Help?</span>
                                </h1>

                                <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                                    Find answers to common questions or get in touch with our support team.
                                </p>

                                {/* Search Bar */}
                                <div className="max-w-2xl mx-auto">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400 text-sm" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for help articles..."
                                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Help Categories */}
                    <section className="py-12 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Browse Help <span className="text-purple-600">Topics</span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Select a category to find answers to your questions
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {helpCategories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveCategory(category.title.toLowerCase().includes('booking') ? 'bookings' :
                                            category.title.toLowerCase().includes('event') ? 'events' :
                                                category.title.toLowerCase().includes('account') ? 'account' :
                                                    category.title.toLowerCase().includes('payment') ? 'payments' :
                                                        category.title.toLowerCase().includes('security') ? 'security' : 'all')}
                                        className="group bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-purple-200 transition-all duration-300 hover:shadow-sm"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg ${getColorClasses(category.color)} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
                                                <category.icon className="text-base" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                    {category.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Frequently Asked <span className="text-purple-600">Questions</span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Find quick answers to the most common questions
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            {/* Category Filters */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    const isActive = activeCategory === category.id;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveCategory(category.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="text-sm" />
                                            {category.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* FAQ List */}
                            {filteredFaqs.length > 0 ? (
                                <div className="max-w-4xl mx-auto space-y-3">
                                    {filteredFaqs.map((faq) => {
                                        const isExpanded = expandedFaqs[faq.id];
                                        return (
                                            <div
                                                key={faq.id}
                                                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-purple-200 transition-all duration-300"
                                            >
                                                <button
                                                    onClick={() => toggleFaq(faq.id)}
                                                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {faq.question}
                                                    </span>
                                                    <span className="flex-shrink-0">
                                                        {isExpanded ? (
                                                            <FaChevronUp className="text-purple-600 text-sm" />
                                                        ) : (
                                                            <FaChevronDown className="text-gray-400 text-sm" />
                                                        )}
                                                    </span>
                                                </button>
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                >
                                                    <div className="px-5 pb-4 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-3">🔍</div>
                                    <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                                    <p className="text-gray-400 text-xs mt-1">Try adjusting your search or browse categories</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Contact Support Section */}
                    <section className="py-16 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-4">
                                            <FaHeadset className="text-purple-600 text-xs" />
                                            <span className="text-xs font-medium text-purple-700 tracking-wider uppercase">
                                                Still Need Help?
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            We're Here to <span className="text-purple-600">Support</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                            Can't find what you're looking for? Our support team is ready to assist you.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <FaEnvelope className="text-purple-600" />
                                                <span className="text-gray-600">support@eevents.bt</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <FaPhone className="text-purple-600" />
                                                <span className="text-gray-600">+975 2 123 456</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <FaClock className="text-purple-600" />
                                                <span className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/contact"
                                            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 text-sm font-medium text-center shadow-sm hover:shadow-md"
                                        >
                                            Contact Support
                                        </Link>
                                        <Link
                                            to="/faqs"
                                            className="w-full py-3 px-6 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm font-medium text-center border border-gray-200"
                                        >
                                            View All FAQs
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Links */}
                    <section className="py-12 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                                <Link to="/about" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    About Us
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/contact" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    Contact
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/privacy" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/terms" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    Terms of Service
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/cookies" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
};

export default HelpCenter;