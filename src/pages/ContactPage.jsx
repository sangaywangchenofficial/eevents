// Contact.jsx - With Google Maps Location and API Integration
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaArrowRight,
    FaCheckCircle,
    FaHeadset,
    FaPaperPlane,
    FaUser,
    FaComment,
    FaTelegramPlane
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { API_BASE_URL, APP_NAME_UPPER, APP_NAME_CAPITALIZED, APP_URL, buildOrganizationSchema } from '../utils/auth';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/contact-messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Message sent successfully! We\'ll get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                const data = await response.json();
                toast.error(data?.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Contact info data with Bhutan location
    const contactInfo = [
        {
            icon: FaEnvelope,
            title: 'Email Us',
            details: 'support@tixelo.bt',
            subDetail: 'hello@tixelo.bt',
            color: 'purple'
        },
        {
            icon: FaPhone,
            title: 'Call Us',
            details: '+975-16178615',
            subDetail: '+975-16178615',
            color: 'blue'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Visit Us',
            details: 'Norzin Lam, Thimphu',
            subDetail: 'Kingdom of Bhutan',
            color: 'emerald'
        },
        {
            icon: FaClock,
            title: 'Working Hours',
            details: 'Mon - Fri: 9:00 AM - 6:00 PM',
            subDetail: 'Sat - Sun: 10:00 AM - 4:00 PM',
            color: 'amber'
        }
    ];

    // Social media links
    const socialLinks = [
        { icon: FaFacebook, label: 'Facebook', url: '#', color: 'hover:bg-blue-600' },
        { icon: FaTwitter, label: 'Twitter', url: '#', color: 'hover:bg-sky-500' },
        { icon: FaInstagram, label: 'Instagram', url: '#', color: 'hover:bg-pink-600' },
        { icon: FaLinkedin, label: 'LinkedIn', url: '#', color: 'hover:bg-blue-700' },
        { icon: FaYoutube, label: 'YouTube', url: '#', color: 'hover:bg-red-600' }
    ];

    // Google Maps Embed URL for Norzin Lam, Thimphu, Bhutan
    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.5369299015845!2d89.6300081146977!3d27.46681473328335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e195665b7cb06b%3A0x4b02f8b5b2e0e5e!2sNorzin%20Lam%2C%20Thimphu%2C%20Bhutan!5e0!3m2!1sen!2s!4v1700000000000";

    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: APP_NAME_CAPITALIZED,
        url: `${APP_URL}/contact`,
        telephone: '+975 17 00 00 00',
        email: `support@${APP_NAME_UPPER.toLowerCase()}.bt`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Norzin Lam',
            addressLocality: 'Thimphu',
            addressRegion: 'Thimphu',
            postalCode: '11001',
            addressCountry: 'BT',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '27.4668',
            longitude: '89.6300',
        },
    };

    return (
        <PublicLayout>
            <SEO
                title={`Contact Us | ${APP_NAME_CAPITALIZED}`}
                description={`Get in touch with the ${APP_NAME_CAPITALIZED} support team for ticketing inquiries, event organizer partnerships, and customer support in Thimphu, Bhutan.`}
                canonical={`${APP_URL}/contact`}
                schema={contactSchema}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Contact', item: '/contact' }
                ]}
            />
            <div className="min-h-screen bg-white dark:bg-[#1C2B27]">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] via-white dark:via-[#162019] to-[#F4F3EC] dark:to-[#0F1A17] py-16 md:py-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6F9F6] dark:bg-[#1C2B27]/50 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8EDE8] dark:bg-[#2A3D38]/50 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-[#E6F9F6] dark:bg-[#1C2B27] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-full px-4 py-1.5 mb-6">
                                <FaHeadset className="text-[#29BBA3] text-xs" />
                                <span className="text-xs font-medium text-[#1E352F] dark:text-[#E8F5F2] tracking-wider uppercase">
                                    We're Here to Help
                                </span>
                            </div>

                            <h1 className="font-serif font-bold text-4xl md:text-5xl text-gray-900 dark:text-[#E8F5F2] mb-4">
                                Get In <span className="bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] bg-clip-text text-transparent">Touch</span>
                            </h1>

                            <p className="text-gray-600 dark:text-[#7AA49D] text-lg max-w-2xl mx-auto leading-relaxed">
                                Have questions, feedback, or need assistance? We'd love to hear from you.
                                Reach out to us and we'll get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="py-12 -mt-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((info, index) => {
                                const colorClasses = {
                                    purple: 'bg-[#E6F9F6] dark:bg-[#1C2B27] text-[#29BBA3] group-hover:bg-[#C8EDE8] dark:bg-[#2A3D38]',
                                    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50',
                                    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50',
                                    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50'
                                };

                                return (
                                    <div
                                        key={index}
                                        className="group bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-2xl p-6 hover:border-[#E6E1D8] dark:border-[#2A3D38] transition-all duration-300 hover:shadow-lg hover:shadow-teal-900/10 transform hover:-translate-y-1 text-center"
                                    >
                                        <div className={`w-14 h-14 rounded-full ${colorClasses[info.color]} flex items-center justify-center mx-auto mb-4 transition-all duration-300`}>
                                            <info.icon className="text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8F5F2] mb-2">
                                            {info.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-[#7AA49D] text-sm">{info.details}</p>
                                        <p className="text-gray-500 dark:text-[#7AA49D] text-sm mt-1">{info.subDetail}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Contact Form & Map Section */}
                <section className="py-16 bg-gray-50 dark:bg-[#0F1A17] border-y border-gray-200 dark:border-[#2A3D38]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8F5F2] mb-2">
                                        Send Us a <span className="text-[#29BBA3]">Message</span>
                                    </h2>
                                    <p className="text-gray-600 dark:text-[#7AA49D] text-sm">
                                        Fill out the form below and we'll get back to you within 24 hours.
                                    </p>
                                    <div className="mt-2 h-1 w-16 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] rounded-full"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4BE] mb-1.5">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-[#66756F]">
                                                <FaUser className="text-sm" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1C2B27] border border-gray-300 dark:border-[#3D5550] rounded-xl text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#C8EDE8] transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4BE] mb-1.5">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-[#66756F]">
                                                <MdEmail className="text-sm" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1C2B27] border border-gray-300 dark:border-[#3D5550] rounded-xl text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#C8EDE8] transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4BE] mb-1.5">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-[#66756F]">
                                                <FaComment className="text-sm" />
                                            </div>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="How can we help you?"
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1C2B27] border border-gray-300 dark:border-[#3D5550] rounded-xl text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#C8EDE8] transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4BE] mb-1.5">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            placeholder="Write your message here..."
                                            className="w-full px-4 py-3 bg-white dark:bg-[#1C2B27] border border-gray-300 dark:border-[#3D5550] rounded-xl text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#C8EDE8] transition-all duration-300 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 px-6 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl hover:from-[#29BBA3] hover:to-[#1E8B7A] transition-all duration-300 shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : isSubmitted ? (
                                            <>
                                                <FaCheckCircle className="text-lg" />
                                                Sent Successfully!
                                            </>
                                        ) : (
                                            <>
                                                <FaTelegramPlane className="text-lg" />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    {isSubmitted && (
                                        <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center flex items-center justify-center gap-2 animate-fade-in">
                                            <FaCheckCircle />
                                            Thank you! Your message has been sent.
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Right Side - Map & Additional Info */}
                            <div className="space-y-6">
                                {/* Google Map */}
                                <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8F5F2] mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-[#29BBA3]" />
                                        Find Us Here
                                    </h3>
                                    <div className="rounded-xl overflow-hidden h-64">
                                        <iframe
                                            src={googleMapsEmbedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`${APP_NAME_UPPER} Office Location - Norzin Lam, Thimphu, Bhutan`}
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <div className="text-gray-500 dark:text-[#7AA49D]">
                                            <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">📍 Norzin Lam, Thimphu</span>
                                            <span className="block text-xs text-gray-400 dark:text-[#66756F]">Kingdom of Bhutan</span>
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/dir//Norzin+Lam,+Thimphu,+Bhutan"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#29BBA3] hover:text-[#1E352F] dark:text-[#E8F5F2] font-medium transition-colors flex items-center gap-1"
                                        >
                                            Get Directions
                                            <FaArrowRight className="text-xs" />
                                        </a>
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8F5F2] mb-4 flex items-center gap-2">
                                        <span className="text-2xl">🌐</span>
                                        Connect With Us
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-[#162019] text-gray-600 dark:text-[#7AA49D] flex items-center justify-center transition-all duration-300 hover:text-white ${social.color} transform hover:scale-110`}
                                                aria-label={social.label}
                                            >
                                                <social.icon className="text-lg" />
                                            </a>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-[#7AA49D] mt-4">
                                        Follow us on social media for updates, events, and more!
                                    </p>
                                </div>

                                {/* Quick Response */}
                                <div className="bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] to-[#F4F3EC] dark:to-[#0F1A17] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#E6F9F6] dark:bg-[#1C2B27] flex items-center justify-center flex-shrink-0">
                                            <FaHeadset className="text-2xl text-[#29BBA3]" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900 dark:text-[#E8F5F2]">Quick Response</h4>
                                            <p className="text-gray-600 dark:text-[#7AA49D] text-sm leading-relaxed">
                                                We typically respond within <span className="font-medium text-[#29BBA3]">24 hours</span>.
                                                For urgent matters, please call us directly.
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 text-sm">
                                                <FaPhone className="text-[#29BBA3]" />
                                                <span className="text-gray-700 dark:text-[#A8C4BE]">+975-16178615</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-sm">
                                                <FaEnvelope className="text-[#29BBA3]" />
                                                <span className="text-gray-700 dark:text-[#A8C4BE]">support@tixelo.bt</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-2xl p-6 shadow-sm">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-[#E8F5F2] mb-3 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-[#29BBA3]" />
                                        Office Location
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-[#7AA49D]">
                                        <p>🏢 Norzin Lam, Thimphu</p>
                                        <p>📍 Kingdom of Bhutan</p>
                                        <p>📮 P.O. Box: 1234</p>
                                        <div className="pt-2 border-t border-gray-100 dark:border-[#2A3D38]">
                                            <p className="text-xs text-gray-400 dark:text-[#66756F]">
                                                📍 <a
                                                    href="https://www.google.com/maps/place/Norzin+Lam,+Thimphu,+Bhutan"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#29BBA3] hover:text-[#1E352F] dark:text-[#E8F5F2] hover:underline"
                                                >
                                                    View on Google Maps
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Preview Section */}
                <section className="py-16 bg-white dark:bg-[#1C2B27]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-[#E8F5F2]">
                                    Frequently Asked <span className="text-[#29BBA3]">Questions</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 dark:text-[#7AA49D] text-lg max-w-2xl mx-auto">
                                Find quick answers to the most common questions.
                            </p>
                            <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-xl p-5 hover:border-[#E6E1D8] dark:border-[#2A3D38] transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-[#E8F5F2] mb-1">How do I book an event?</h4>
                                <p className="text-gray-600 dark:text-[#7AA49D] text-sm">Simply browse our events, select your tickets, and complete the booking process. You'll receive a confirmation email instantly.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-xl p-5 hover:border-[#E6E1D8] dark:border-[#2A3D38] transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-[#E8F5F2] mb-1">Can I cancel my booking?</h4>
                                <p className="text-gray-600 dark:text-[#7AA49D] text-sm">Yes, you can cancel your booking up to 48 hours before the event. Check our cancellation policy for details.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-xl p-5 hover:border-[#E6E1D8] dark:border-[#2A3D38] transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-[#E8F5F2] mb-1">How do I get my ticket?</h4>
                                <p className="text-gray-600 dark:text-[#7AA49D] text-sm">After booking, you'll receive an e-ticket via email. You can also find it in your dashboard under "My Bookings".</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-xl p-5 hover:border-[#E6E1D8] dark:border-[#2A3D38] transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-[#E8F5F2] mb-1">Is my payment secure?</h4>
                                <p className="text-gray-600 dark:text-[#7AA49D] text-sm">Yes, we use industry-standard encryption and secure payment gateways to protect your transactions.</p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                to="/help"
                                className="inline-flex items-center gap-2 text-[#29BBA3] hover:text-[#1E352F] dark:text-[#E8F5F2] font-medium transition-colors"
                            >
                                View All FAQs
                                <FaArrowRight className="text-sm" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gray-50 dark:bg-[#0F1A17] border-y border-gray-200 dark:border-[#2A3D38]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] via-[#FDFDF7] dark:via-[#162019] to-purple-50 dark:to-[#162019] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-teal-900/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6F9F6] dark:bg-[#1C2B27]/30 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8EDE8] dark:bg-[#2A3D38]/30 rounded-full blur-3xl"></div>

                            <div className="relative">
                                <div className="inline-flex items-center gap-2 bg-[#E6F9F6] dark:bg-[#1C2B27] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-full px-4 py-1.5 mb-6">
                                    <FaPaperPlane className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] dark:text-[#E8F5F2] tracking-wider uppercase">
                                        Stay Connected
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#E8F5F2] mb-4">
                                    Join Our <span className="text-[#29BBA3]">Community</span>
                                </h2>
                                <p className="text-gray-600 dark:text-[#7AA49D] text-base max-w-2xl mx-auto mb-6">
                                    Subscribe to our newsletter and be the first to know about new events,
                                    exclusive offers, and exciting updates.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C2B27] border border-gray-300 dark:border-[#3D5550] rounded-xl text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#C8EDE8] transition-all duration-300"
                                    />
                                    <button className="px-6 py-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl hover:from-[#29BBA3] hover:to-[#1E8B7A] transition-all duration-300 shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 font-medium whitespace-nowrap">
                                        Subscribe
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 dark:text-[#66756F] mt-3 flex items-center justify-center gap-1">
                                    <FaCheckCircle className="text-emerald-500" />
                                    No spam, unsubscribe anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
};

export default Contact;