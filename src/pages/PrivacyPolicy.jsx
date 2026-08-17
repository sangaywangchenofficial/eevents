// PrivacyPolicy.jsx - Privacy Policy with Sticky Sidebar TOC
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaEnvelope,
    FaPhone,
    FaArrowRight,
    FaChevronDown,
    FaChevronUp,
    FaFileContract,
    FaHandshake,
    FaUsers,
    FaGlobe,
    FaServer,
    FaDatabase,
    FaCookie,
    FaUserSecret,
    FaBook,
    FaBookOpen,
    FaUserShield,
    FaEye,
    FaShareAlt,
    FaTrashAlt,
    FaClock,
    FaMobileAlt,
    FaLaptop,
    FaTablet
} from 'react-icons/fa';
import { MdSecurity, MdPrivacyTip, MdPayment, MdDescription, MdDataUsage } from 'react-icons/md';

const PrivacyPolicy = () => {
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

    // Privacy Policy sections data
    const privacySections = [
        {
            id: 'introduction',
            number: 1,
            icon: FaShieldAlt,
            title: 'Introduction',
            summary: 'We are committed to protecting your privacy and personal information.',
            content: 'At TIXELO, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.',
            details: [
                'We comply with applicable data protection laws and regulations',
                'We are transparent about how we collect and use your data',
                'We give you control over your personal information',
                'We are committed to keeping your data secure'
            ]
        },
        {
            id: 'information-collection',
            number: 2,
            icon: FaDatabase,
            title: 'Information We Collect',
            summary: 'We collect information you provide and data from your interactions.',
            content: 'We collect various types of information to provide and improve our services. This includes information you provide directly, information collected automatically, and information from third-party sources.',
            details: [
                'Personal identification information (name, email, phone number)',
                'Account credentials and profile information',
                'Event preferences and booking history',
                'Device and usage information (IP address, browser type)',
                'Location data (with your consent)',
                'Cookies and similar tracking technologies'
            ]
        },
        {
            id: 'how-we-use',
            number: 3,
            icon: FaEye,
            title: 'How We Use Your Information',
            summary: 'We use your data to provide, improve, and personalize our services.',
            content: 'We use the information we collect for various purposes, including providing our services, improving user experience, communicating with you, and ensuring platform security.',
            details: [
                'To process bookings and event registrations',
                'To send event confirmations and updates',
                'To personalize your experience and recommendations',
                'To improve our platform and develop new features',
                'To communicate with you about promotions and offers',
                'To ensure platform security and prevent fraud'
            ]
        },
        {
            id: 'information-sharing',
            number: 4,
            icon: FaShareAlt,
            title: 'Information Sharing',
            summary: 'We share data only as necessary to provide our services.',
            content: 'We may share your information with third parties in certain circumstances. We do not sell your personal information to third parties. We share data only as necessary to provide our services and as required by law.',
            details: [
                'With event organizers to process your bookings',
                'With service providers who assist in our operations',
                'With payment processors to handle transactions',
                'When required by law or legal process',
                'With your consent, for marketing purposes',
                'Never sell your personal information to third parties'
            ]
        },
        {
            id: 'data-security',
            number: 5,
            icon: FaUserShield,
            title: 'Data Security',
            summary: 'We implement robust security measures to protect your data.',
            content: 'We take data security seriously and implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
            details: [
                'Industry-standard encryption (SSL/TLS) for data transmission',
                'Secure storage of personal information',
                'Regular security assessments and updates',
                'Access controls and authentication measures',
                'Data backup and disaster recovery procedures',
                'Regular employee training on data protection'
            ]
        },
        {
            id: 'cookies',
            number: 6,
            icon: FaCookie,
            title: 'Cookies and Tracking Technologies',
            summary: 'We use cookies to enhance your experience and analyze usage.',
            content: 'We use cookies and similar tracking technologies to collect information about your browsing activities, preferences, and usage patterns. This helps us improve our services and provide a better user experience.',
            details: [
                'Essential cookies for platform functionality',
                'Analytics cookies to understand usage patterns',
                'Preference cookies to remember your settings',
                'Advertising cookies to deliver relevant content',
                'You can manage cookie preferences in your browser',
                'Third-party cookies from integrated services'
            ]
        },
        {
            id: 'your-rights',
            number: 7,
            icon: FaUserSecret,
            title: 'Your Rights',
            summary: 'You have control over your personal information and how it\'s used.',
            content: 'You have certain rights regarding your personal information under applicable data protection laws. We are committed to helping you exercise these rights and maintaining transparency about your data.',
            details: [
                'Right to access your personal information',
                'Right to correct inaccurate data',
                'Right to request deletion of your data',
                'Right to restrict or object to processing',
                'Right to data portability',
                'Right to withdraw consent at any time'
            ]
        },
        {
            id: 'data-retention',
            number: 8,
            icon: FaClock,
            title: 'Data Retention',
            summary: 'We retain your data only as long as necessary.',
            content: 'We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.',
            details: [
                'Account data retained until you delete your account',
                'Booking history retained for 7 years for tax purposes',
                'Usage data retained for analytics and improvement',
                'Marketing data retained until you opt-out',
                'You can request deletion of your data at any time',
                'Anonymized data may be retained indefinitely'
            ]
        },
        {
            id: 'children-privacy',
            number: 9,
            icon: FaUsers,
            title: 'Children\'s Privacy',
            summary: 'Our platform is not intended for children under 18.',
            content: 'Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete it.',
            details: [
                'Minimum age requirement is 18 years',
                'We do not knowingly collect children\'s data',
                'Parental consent is not applicable for underage users',
                'We encourage parents to monitor their children\'s online activity',
                'Contact us if you believe we have collected data from a minor'
            ]
        },
        {
            id: 'international-transfers',
            number: 10,
            icon: FaGlobe,
            title: 'International Data Transfers',
            summary: 'Your data may be transferred internationally.',
            content: 'We may transfer your personal information to countries outside your country of residence, including to third-party service providers. We ensure that appropriate safeguards are in place to protect your data during such transfers.',
            details: [
                'Data may be stored on servers in multiple locations',
                'We ensure compliance with international data transfer laws',
                'We use standard contractual clauses for data transfers',
                'We ensure adequate protection of your data',
                'You can contact us for more information about transfers'
            ]
        },
        {
            id: 'policy-updates',
            number: 11,
            icon: FaHandshake,
            title: 'Changes to This Policy',
            summary: 'We may update this policy from time to time.',
            content: 'We reserve the right to update this Privacy Policy at any time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
            details: [
                'Changes become effective immediately upon posting',
                'Significant changes will be notified via email',
                'We encourage you to review this policy periodically',
                'Your continued use constitutes acceptance of updates',
                'The latest version is always available on our website'
            ]
        },
        {
            id: 'contact',
            number: 12,
            icon: FaEnvelope,
            title: 'Contact Us',
            summary: 'We\'re here to address any privacy concerns.',
            content: 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don\'t hesitate to contact us. We are committed to addressing your privacy concerns promptly.',
            details: [
                'Email: privacy@tixelo.bt',
                'Phone: +975 2 123 456',
                'Address: Norzin Lam, Thimphu, Kingdom of Bhutan',
                'Our privacy team will respond within 48 hours',
                'You can also contact our Data Protection Officer'
            ]
        }
    ];

    // Scroll spy for active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = privacySections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(privacySections[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [privacySections]);

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
                                    <MdPrivacyTip className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] tracking-wider uppercase">
                                        Privacy
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
                                    Privacy <span className="text-[#29BBA3]">Policy</span>
                                </h1>

                                <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                    Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                                        <span>📅</span>
                                        Last Updated: {lastUpdated}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                                        <span>📄</span>
                                        {privacySections.length} Sections
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
                                                {privacySections.map((section) => {
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
                                            Quick Actions
                                        </p>
                                        <div className="space-y-2">
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#29BBA3] transition-colors duration-200"
                                            >
                                                <FaEnvelope className="text-xs" />
                                                Contact Privacy Team
                                            </Link>
                                            <Link
                                                to="/terms"
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#29BBA3] transition-colors duration-200"
                                            >
                                                <FaFileContract className="text-xs" />
                                                Terms of Service
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

                                    {/* Data Protection Badge */}
                                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <FaLock className="text-emerald-600" />
                                            <span className="text-xs font-semibold text-emerald-700">Your Data is Protected</span>
                                        </div>
                                        <p className="text-xs text-emerald-600">
                                            We use industry-standard encryption to keep your information safe.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                {privacySections.map((section, index) => {
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
                                        <MdSecurity className="text-[#29BBA3]" />
                                        Key Privacy Principles
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <FaLock className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Data Security</h4>
                                                <p className="text-xs text-gray-500">Your data is encrypted and protected</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaUserSecret className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Privacy Control</h4>
                                                <p className="text-xs text-gray-500">You control your personal information</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaEye className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Transparency</h4>
                                                <p className="text-xs text-gray-500">We're clear about data usage</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaHandshake className="text-emerald-500 text-sm mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Trust</h4>
                                                <p className="text-xs text-gray-500">We never sell your personal data</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="mt-6 bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] border border-[#E6F9F6] rounded-2xl p-8 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Have Privacy Concerns?
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Our privacy team is here to address any questions or concerns you may have.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <Link
                                            to="/contact"
                                            className="px-6 py-3 bg-[#1E8B7A] text-white rounded-lg hover:bg-[#1E352F] transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md inline-flex items-center gap-2"
                                        >
                                            Contact Privacy Team
                                            <FaArrowRight className="text-sm" />
                                        </Link>
                                        <Link
                                            to="/terms"
                                            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium border border-gray-200 inline-flex items-center gap-2"
                                        >
                                            Terms of Service
                                        </Link>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FaEnvelope className="text-[#29BBA3]" />
                                            privacy@tixelo.bt
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
                                <Link to="/terms" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Terms of Service
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/cookies" className="hover:text-[#29BBA3] transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/help" className="hover:text-[#29BBA3] transition-colors duration-200">
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

export default PrivacyPolicy;