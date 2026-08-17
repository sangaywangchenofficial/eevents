// TermsOfService.jsx - Terms of Service with Sticky Sidebar TOC
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaShieldAlt,
    FaCheckCircle,
    FaUserCheck,
    FaCreditCard,
    FaTicketAlt,
    FaGavel,
    FaBalanceScale,
    FaLock,
    FaEnvelope,
    FaPhone,
    FaArrowRight,
    FaChevronDown,
    FaChevronUp,
    FaFileContract,
    FaHandshake,
    FaUsers,
    FaCalendarCheck,
    FaGlobe,
    FaServer,
    FaDatabase,
    FaCookie,
    FaUserSecret,
    FaList,
    FaBook,
    FaBookOpen
} from 'react-icons/fa';
import { MdSecurity, MdPrivacyTip, MdPayment, MdDescription } from 'react-icons/md';

const TermsOfService = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Last updated date
    const lastUpdated = 'August 10, 2026';

    // Terms sections data
    const termsSections = [
        {
            id: 'acceptance',
            number: 1,
            icon: FaCheckCircle,
            title: 'Acceptance of Terms',
            summary: 'By using TIXELO, you agree to these Terms of Service.',
            content: 'By using TIXELO, you agree to these Terms of Service. If you do not agree, please do not use our platform. These terms apply to all users, including event organizers and attendees.',
            details: [
                'You must be at least 18 years old to use this service',
                'You are responsible for maintaining the confidentiality of your account',
                'You agree to provide accurate and complete information',
                'You accept all risks associated with attending events'
            ]
        },
        {
            id: 'accounts',
            number: 2,
            icon: FaUserCheck,
            title: 'User Accounts',
            summary: 'You are responsible for all activities under your account.',
            content: 'To access certain features, you must create an account. You are responsible for all activities that occur under your account and for keeping your password secure.',
            details: [
                'You must provide accurate registration information',
                'You are solely responsible for your account activity',
                'You must notify us immediately of any unauthorized use',
                'We reserve the right to suspend or terminate accounts'
            ]
        },
        {
            id: 'bookings',
            number: 3,
            icon: FaTicketAlt,
            title: 'Bookings & Tickets',
            summary: 'All ticket sales are final unless otherwise stated.',
            content: 'When you book an event through TIXELO, you agree to the booking terms and conditions. All ticket sales are final unless otherwise stated in our refund policy.',
            details: [
                'Tickets are non-transferable unless specified',
                'You must present valid ID for event entry',
                'Event schedules and lineups are subject to change',
                'Refunds are available up to 48 hours before the event'
            ]
        },
        {
            id: 'payments',
            number: 4,
            icon: FaCreditCard,
            title: 'Payments & Refunds',
            summary: 'All payments are processed securely through our payment partners.',
            content: 'All payments are processed securely through our payment partners. Refunds are handled according to our refund policy and the event organizer\'s terms.',
            details: [
                'All prices are in USD unless otherwise stated',
                'Payments are non-refundable except as provided',
                'We use industry-standard encryption for transactions',
                'Chargebacks may result in account suspension'
            ]
        },
        {
            id: 'user-conduct',
            number: 5,
            icon: FaGavel,
            title: 'User Conduct',
            summary: 'You agree to use TIXELO responsibly and in compliance with all applicable laws.',
            content: 'You agree to use TIXELO responsibly and in compliance with all applicable laws. You must not engage in any activity that disrupts or harms other users or the platform.',
            details: [
                'No fraudulent or misleading activities',
                'No harassment or abuse of other users',
                'No unauthorized access to systems',
                'No distribution of malware or viruses'
            ]
        },
        {
            id: 'intellectual-property',
            number: 6,
            icon: FaBalanceScale,
            title: 'Intellectual Property',
            summary: 'All content on TIXELO is our intellectual property.',
            content: 'All content on TIXELO, including logos, designs, and text, is our intellectual property. You may not use our content without permission.',
            details: [
                'TIXELO owns all platform content and trademarks',
                'Users retain rights to their event content',
                'You may not copy or reproduce our content',
                'Unauthorized use may result in legal action'
            ]
        },
        {
            id: 'privacy',
            number: 7,
            icon: FaLock,
            title: 'Privacy & Data Protection',
            summary: 'We take your privacy seriously and protect your personal information.',
            content: 'We take your privacy seriously. Our Privacy Policy explains how we collect, use, and protect your personal information.',
            details: [
                'We collect data to improve your experience',
                'Your data is stored securely',
                'We never sell your personal information',
                'You can request data deletion at any time'
            ]
        },
        {
            id: 'liability',
            number: 8,
            icon: FaShieldAlt,
            title: 'Limitation of Liability',
            summary: 'TIXELO is not liable for indirect or consequential damages.',
            content: 'TIXELO is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or attendance at events.',
            details: [
                'We are not responsible for event cancellations',
                'We are not liable for user-generated content',
                'We do not guarantee event quality',
                'Our liability is limited to the amount you paid'
            ]
        },
        {
            id: 'termination',
            number: 9,
            icon: FaFileContract,
            title: 'Termination',
            summary: 'We may suspend or terminate your account for violations.',
            content: 'We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service.',
            details: [
                'We may terminate accounts without notice',
                'You may delete your account at any time',
                'Sections relating to intellectual property survive termination',
                'Refunds are not guaranteed for terminated accounts'
            ]
        },
        {
            id: 'changes',
            number: 10,
            icon: FaHandshake,
            title: 'Changes to Terms',
            summary: 'We may update these Terms of Service from time to time.',
            content: 'We may update these Terms of Service from time to time. We will notify you of significant changes via email or through the platform.',
            details: [
                'Changes become effective immediately upon posting',
                'Continued use constitutes acceptance of changes',
                'We will notify you of major changes',
                'Review terms periodically for updates'
            ]
        }
    ];

    // Scroll spy for active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = termsSections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(termsSections[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [termsSections]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <PublicLayout>
                <div className="min-h-screen bg-white">
                    {/* Hero Section */}
                    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFDF7]/30 via-white to-[#F4F3EC]/30"></div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-[#F4F3EC] border border-[#E6F9F6] rounded-full px-4 py-1.5 mb-5">
                                    <FaFileContract className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] tracking-wider uppercase">
                                        Legal
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
                                    Terms of <span className="text-[#29BBA3]">Service</span>
                                </h1>

                                <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                    Please read these terms carefully before using our platform.
                                    By using TIXELO, you agree to be bound by these terms.
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                                        <span>📅</span>
                                        Last Updated: {lastUpdated}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                                        <span>📄</span>
                                        {termsSections.length} Sections
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content with Sidebar */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar - Table of Contents */}
                            <div className="lg:w-72 flex-shrink-0">
                                <div className="lg:sticky lg:top-24">
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#FDFDF7] to-[#F4F3EC] px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <FaBookOpen className="text-[#29BBA3]" />
                                                <h3 className="text-sm font-semibold text-gray-900">Table of Contents</h3>
                                            </div>
                                        </div>
                                        <nav className="p-3 max-h-[70vh] overflow-y-auto">
                                            <ul className="space-y-0.5">
                                                {termsSections.map((section) => {
                                                    const Icon = section.icon;
                                                    const isActive = activeSection === section.id;
                                                    return (
                                                        <li key={section.id}>
                                                            <button
                                                                onClick={() => scrollToSection(section.id)}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${isActive
                                                                    ? 'bg-[#F4F3EC] text-[#1E352F] border border-[#E6F9F6]'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#29BBA3]'
                                                                    }`}
                                                            >
                                                                <Icon className={`text-xs flex-shrink-0 ${isActive ? 'text-[#29BBA3]' : 'text-gray-400'}`} />
                                                                <span className="truncate">
                                                                    <span className="text-gray-400 mr-1">{section.number}.</span>
                                                                    {section.title}
                                                                </span>
                                                                {isActive && (
                                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1E8B7A] flex-shrink-0"></span>
                                                                )}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </nav>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                            Need Help?
                                        </p>
                                        <div className="space-y-2">
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#29BBA3] transition-colors duration-200"
                                            >
                                                <FaEnvelope className="text-xs" />
                                                Contact Support
                                            </Link>
                                            <Link
                                                to="/privacy"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#29BBA3] transition-colors duration-200"
                                            >
                                                <FaLock className="text-xs" />
                                                Privacy Policy
                                            </Link>
                                            <Link
                                                to="/help"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#29BBA3] transition-colors duration-200"
                                            >
                                                <FaBook className="text-xs" />
                                                Help Center
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                {termsSections.map((section, index) => {
                                    const Icon = section.icon;
                                    const isExpanded = expandedSections[section.id] || false;

                                    return (
                                        <div
                                            key={section.id}
                                            id={section.id}
                                            className="mb-4 scroll-mt-24"
                                        >
                                            <div className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${activeSection === section.id ? 'border-[#E6E1D8] shadow-md' : 'border-gray-100 hover:border-[#E6E1D8]'
                                                }`}>
                                                <button
                                                    onClick={() => toggleSection(section.id)}
                                                    className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${activeSection === section.id ? 'bg-[#E6F9F6] text-[#29BBA3]' : 'bg-gray-50 text-gray-400'
                                                            }`}>
                                                            <Icon className="text-base" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-[#29BBA3] bg-[#F4F3EC] px-2 py-0.5 rounded">
                                                                    {section.number}
                                                                </span>
                                                                <h3 className="text-base font-semibold text-gray-900">
                                                                    {section.title}
                                                                </h3>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                                                {section.summary}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="flex-shrink-0 mt-1">
                                                        {isExpanded ? (
                                                            <FaChevronUp className="text-[#29BBA3] text-sm" />
                                                        ) : (
                                                            <FaChevronDown className="text-gray-400 text-sm" />
                                                        )}
                                                    </span>
                                                </button>

                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                >
                                                    <div className="px-6 pb-4 pt-1 border-t border-gray-50">
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                            {section.content}
                                                        </p>
                                                        <ul className="space-y-1.5">
                                                            {section.details.map((detail, idx) => (
                                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                                                                    <FaCheckCircle className="text-[#29BBA3] text-xs mt-0.5 flex-shrink-0" />
                                                                    {detail}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Summary Section */}
                                <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaHandshake className="text-[#29BBA3]" />
                                        Summary of Key Terms
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Age Requirement</h4>
                                                <p className="text-xs text-gray-500">You must be at least 18 years old</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Account Security</h4>
                                                <p className="text-xs text-gray-500">You are responsible for your account</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Payment Terms</h4>
                                                <p className="text-xs text-gray-500">All payments are final</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Privacy Policy</h4>
                                                <p className="text-xs text-gray-500">Your data is protected</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="mt-6 bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] border border-[#E6F9F6] rounded-2xl p-8 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Have Questions About Our Terms?
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        If you have any questions or concerns about our Terms of Service, please contact us.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <Link
                                            to="/contact"
                                            className="px-6 py-3 bg-[#1E8B7A] text-white rounded-lg hover:bg-[#1E352F] transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md inline-flex items-center gap-2"
                                        >
                                            Contact Us
                                            <FaArrowRight className="text-sm" />
                                        </Link>
                                        <Link
                                            to="/privacy"
                                            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium border border-gray-200 inline-flex items-center gap-2"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FaEnvelope className="text-[#29BBA3]" />
                                            support@tixelo.bt
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="flex items-center gap-1">
                                            <FaPhone className="text-[#29BBA3]" />
                                            +975 2 123 456
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <section className="py-8 bg-gray-50 border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                                <Link to="/about" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    About Us
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/contact" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Contact
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/privacy" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/cookies" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/help-center" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Help Center
                                </Link>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                © {new Date().getFullYear()} TIXELO. All rights reserved.
                            </p>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
};

export default TermsOfService;