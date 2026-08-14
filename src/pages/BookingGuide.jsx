import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaSearch,
    FaTicketAlt,
    FaCreditCard,
    FaCheckCircle,
    FaEnvelope,
    FaQrcode,
    FaArrowRight,
    FaArrowLeft,
    FaCalendarCheck,
    FaMapMarkerAlt,
    FaClock,
    FaUser,
    FaPhone,
    FaShieldAlt,
    FaStar,
    FaUsers,
    FaHeart,
    FaShare,
    FaBookmark,
    FaRegBookmark,
    FaChevronRight,
    FaChevronLeft,
    FaPlay,
    FaVideo,
    FaDownload,
    FaPrint,
    FaMobileAlt,
    FaLaptop,
    FaTablet,
    FaHeadset // <-- This was missing
} from 'react-icons/fa';
import { MdEvent, MdLocationOn, MdDateRange, MdPayment } from 'react-icons/md';

const BookingGuide = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [activeTab, setActiveTab] = useState('steps');

    // Booking steps data
    const steps = [
        {
            number: 1,
            title: 'Discover Events',
            icon: FaSearch,
            description: 'Browse through our curated list of events. Use filters to find events by location, date, category, or price range.',
            tips: [
                'Use the search bar to find specific events',
                'Filter by location to find events near you',
                'Check event details including date, time, and venue',
                'Save your favorite events to your wishlist'
            ],
            image: 'discover'
        },
        {
            number: 2,
            title: 'Select Your Tickets',
            icon: FaTicketAlt,
            description: 'Choose the ticket type and quantity that suits your needs. Different ticket tiers offer various benefits and pricing.',
            tips: [
                'Check ticket availability before selecting',
                'Compare different ticket tiers and benefits',
                'Review the event details and terms',
                'Use the quantity selector to adjust ticket count'
            ],
            image: 'select'
        },
        {
            number: 3,
            title: 'Complete Payment',
            icon: FaCreditCard,
            description: 'Secure your tickets by completing the payment process. We accept multiple payment methods for your convenience.',
            tips: [
                'Your payment is secure with industry-standard encryption',
                'We accept credit cards, PayPal, and digital wallets',
                'Double-check your billing information',
                'You\'ll receive a confirmation email after payment'
            ],
            image: 'payment'
        },
        {
            number: 4,
            title: 'Receive Your Tickets',
            icon: FaEnvelope,
            description: 'Get your e-tickets instantly via email and in your dashboard. You\'re all set for the event!',
            tips: [
                'Check your email for the confirmation',
                'Tickets are also available in your dashboard',
                'Download or print your tickets for the event',
                'Add the event to your calendar for reminders'
            ],
            image: 'ticket'
        }
    ];

    // Payment methods
    const paymentMethods = [
        { name: 'Credit/Debit Card', icon: FaCreditCard, description: 'Visa, Mastercard, American Express' },
        { name: 'PayPal', icon: FaCreditCard, description: 'Secure online payments' },
        { name: 'Digital Wallets', icon: FaMobileAlt, description: 'Apple Pay, Google Pay' }
    ];

    // Tips for booking
    const bookingTips = [
        {
            icon: FaClock,
            title: 'Book Early',
            description: 'Secure your spot early. Popular events sell out quickly.'
        },
        {
            icon: FaShieldAlt,
            title: 'Secure Payment',
            description: 'All transactions are encrypted and secure.'
        },
        {
            icon: FaEnvelope,
            title: 'Check Your Email',
            description: 'You\'ll receive instant confirmation and your e-ticket.'
        },
        {
            icon: FaMobileAlt,
            title: 'Mobile Ready',
            description: 'Access your tickets on your mobile device.'
        }
    ];

    // FAQ data specific to booking
    const bookingFaqs = [
        {
            question: 'Do I need to create an account to book?',
            answer: 'Yes, you need to create an account to book tickets. This helps us manage your bookings securely and send you important updates. The registration process is quick and easy.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay. All payments are processed securely.'
        },
        {
            question: 'How do I get my tickets after booking?',
            answer: 'You\'ll receive your e-tickets instantly via email after successful payment. You can also find them in your dashboard under "My Bookings". Download or print them for the event.'
        },
        {
            question: 'Can I get a refund if I cancel?',
            answer: 'Yes, you can cancel your booking up to 48 hours before the event start time. Refunds are processed within 5-7 business days. Check our cancellation policy for details.'
        },
        {
            question: 'What if I have issues with my tickets?',
            answer: 'Contact our support team immediately if you have any issues with your tickets. We\'re here to help and will resolve any problems promptly.'
        }
    ];

    // Responsive image display
    const renderStepImage = (image) => {
        const images = {
            discover: (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 text-center border border-purple-100">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-sm">Browse and discover events</p>
                </div>
            ),
            select: (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 text-center border border-blue-100">
                    <div className="text-6xl mb-4">🎫</div>
                    <p className="text-gray-600 text-sm">Select your tickets</p>
                </div>
            ),
            payment: (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-100">
                    <div className="text-6xl mb-4">💳</div>
                    <p className="text-gray-600 text-sm">Secure payment</p>
                </div>
            ),
            ticket: (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 text-center border border-amber-100">
                    <div className="text-6xl mb-4">📧</div>
                    <p className="text-gray-600 text-sm">Get your e-tickets</p>
                </div>
            )
        };
        return images[image] || images.discover;
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
                                    <FaTicketAlt className="text-purple-600 text-xs" />
                                    <span className="text-xs font-medium text-purple-700 tracking-wider uppercase">
                                        Booking Guide
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
                                    How to Book <span className="text-purple-600">Tickets</span>
                                </h1>

                                <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                    A simple guide to help you book tickets for your favorite events quickly and easily.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Quick Stats */}
                    <section className="py-8 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">4</p>
                                    <p className="text-xs text-gray-500">Simple Steps</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">5 min</p>
                                    <p className="text-xs text-gray-500">Average Time</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">100%</p>
                                    <p className="text-xs text-gray-500">Secure Payment</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">24/7</p>
                                    <p className="text-xs text-gray-500">Support Available</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Booking Steps */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Booking in <span className="text-purple-600">4 Simple Steps</span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Follow these steps to secure your tickets
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            {/* Step Navigation */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                                {steps.map((step) => (
                                    <button
                                        key={step.number}
                                        onClick={() => setActiveStep(step.number)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeStep === step.number
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === step.number
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {step.number}
                                        </span>
                                        {step.title}
                                    </button>
                                ))}
                            </div>

                            {/* Active Step Content */}
                            {steps.map((step) => (
                                step.number === activeStep && (
                                    <div key={step.number} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                                    <step.icon className="text-xl" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Step {step.number}: {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                                {step.description}
                                            </p>
                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                                    💡 Pro Tips
                                                </h4>
                                                <ul className="space-y-2">
                                                    {step.tips.map((tip, index) => (
                                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                            <FaCheckCircle className="text-purple-600 text-xs mt-0.5 flex-shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            {renderStepImage(step.image)}
                                            <div className="mt-4 flex justify-between">
                                                <button
                                                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                                                    disabled={activeStep === 1}
                                                    className={`flex items-center gap-1 text-sm ${activeStep === 1
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-500 hover:text-purple-600 transition-colors'
                                                        }`}
                                                >
                                                    <FaChevronLeft className="text-xs" />
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                                                    disabled={activeStep === 4}
                                                    className={`flex items-center gap-1 text-sm ${activeStep === 4
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-500 hover:text-purple-600 transition-colors'
                                                        }`}
                                                >
                                                    Next
                                                    <FaChevronRight className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>

                    {/* Payment Methods */}
                    <section className="py-16 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Secure <span className="text-purple-600">Payment</span> Options
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Choose from multiple secure payment methods
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {paymentMethods.map((method, index) => {
                                    const Icon = method.icon;
                                    return (
                                        <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:border-purple-200 transition-all duration-300">
                                            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                                                <Icon className="text-xl" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-gray-900">{method.name}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{method.description}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                    <FaShieldAlt className="text-emerald-500" />
                                    All payments are secure and encrypted
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Booking Tips */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Booking <span className="text-purple-600">Tips</span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Make the most of your booking experience
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {bookingTips.map((tip, index) => (
                                    <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center hover:border-purple-200 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                                            <tip.icon className="text-xl" />
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900">{tip.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{tip.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-16 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Frequently Asked <span className="text-purple-600">Questions</span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Common questions about booking tickets
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-purple-600 rounded-full mx-auto"></div>
                            </div>

                            <div className="max-w-3xl mx-auto space-y-3">
                                {bookingFaqs.map((faq, index) => (
                                    <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-purple-200 transition-all duration-300">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{faq.question}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-6">
                                <Link
                                    to="/help-center"
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1 transition-colors"
                                >
                                    View all FAQs
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Ready to <span className="text-purple-600">Book</span> Your Tickets?
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Start exploring events and secure your spot today.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                        to="/events"
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md inline-flex items-center gap-2"
                                    >
                                        Browse Events
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                    <Link
                                        to="/help"
                                        className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium border border-gray-200 inline-flex items-center gap-2"
                                    >
                                        Need Help?
                                        <FaHeadset className="text-sm" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
};

export default BookingGuide;