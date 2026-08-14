import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book tickets for an event on eEvents Bhutan?',
    answer: 'Simply browse or search for your desired event, select your ticket tier or quantity, click "Book Now", and complete the checkout using your preferred payment method. You will instantly receive a digital QR ticket.'
  },
  {
    question: 'Which payment methods are supported in Bhutan?',
    answer: 'We support major local Bhutanese banking methods including mBoB, B-WALLET, RMA Payment Gateway, and international Visa/Mastercard payments.'
  },
  {
    question: 'Do I need to print my event tickets?',
    answer: 'No printing is required! All eEvents tickets come with a secure digital QR code that can be scanned directly from your mobile device at the event gate.'
  },
  {
    question: 'Can I cancel or request a refund for my booked tickets?',
    answer: 'Refund policies depend on the individual event organizer. You can view the specific cancellation rules on each event details page or contact our support team for assistance.'
  },
  {
    question: 'Are cultural festivals like Paro and Thimphu Tshechus free to attend?',
    answer: 'Many traditional Tshechu festivals inside Dzongs are open to the public. However, reserving specific seating areas or special cultural seating passes through eEvents ensures guaranteed entry and comfortable viewing.'
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#FAF8FF] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#1E1B4B]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#475569] text-base mt-2 font-inter">
            Everything you need to know about booking and attending events across Bhutan.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-poppins font-bold text-base text-[#1E1B4B] hover:text-[#6B21A8] transition-colors"
                >
                  <span>{faq.question}</span>
                  <div className={`p-2 rounded-full bg-purple-50 text-[#6B21A8] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#6B21A8] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-sm text-[#475569] font-inter leading-relaxed border-t border-purple-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
