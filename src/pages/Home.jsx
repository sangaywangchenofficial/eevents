import React from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import HeroSection from './HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedEvent from './FeatureEvent';
import WhyChooseUs from '../components/WhyChooseUs';
import PopularEvents from '../components/PopularEvents';
import Testimonials from '../components/Testimonials';
import AppShowcase from '../components/AppShowcase';
import FaqSection from '../components/FaqSection';
import CallToAction from './CallToAction';

export default function Home() {
  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. Featured Events */}
      <FeaturedEvent />

      {/* 4. Why Choose TIXELO */}
      <WhyChooseUs />

      {/* 5. Popular Events Across Bhutan */}
      <PopularEvents />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Mobile App Showcase */}
      <AppShowcase />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Newsletter Call To Action */}
      <CallToAction />
    </PublicLayout>
  );
}