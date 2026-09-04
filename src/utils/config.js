// ── Application Configuration ──────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'tixelo';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Base application canonical URL for SEO
export const APP_URL =
  import.meta.env.VITE_APP_URL ||
  (typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'http://localhost:5173');

export const IS_DEV = APP_ENV === 'development';
export const IS_PROD = APP_ENV === 'production';

// Display name formatters
export const APP_NAME_UPPER = APP_NAME.toUpperCase();
export const APP_NAME_CAPITALIZED =
  APP_NAME.charAt(0).toUpperCase() + APP_NAME.slice(1);

// ── Default SEO Configuration ──────────────────────────────────────────────
export const DEFAULT_SEO = {
  title: `${APP_NAME_CAPITALIZED} | Discover, Book & Experience Events in Bhutan`,
  description:
    "Bhutan's premier event management and ticket booking platform. Find cultural festivals, workshops, sports, concerts, and community gatherings across Bhutan.",
  keywords:
    'events bhutan, buy tickets bhutan, tshechu festival passes, thimphu events, paro festivals, cultural tours bhutan, concerts bhutan, event booking',
  ogType: 'website',
  ogImage: `${APP_URL}/tixelologo.jpeg`,
  twitterCard: 'summary_large_image',
  canonical: APP_URL,
};

// ── Structured Data (JSON-LD) Generators ───────────────────────────────────

/**
 * Organization Schema (Root brand schema)
 */
export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: APP_NAME_CAPITALIZED,
  url: APP_URL,
  logo: `${APP_URL}/tixelologo.jpeg`,
  description: DEFAULT_SEO.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Norzin Lam',
    addressLocality: 'Thimphu',
    addressRegion: 'Thimphu',
    postalCode: '11001',
    addressCountry: 'BT',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: `support@${APP_NAME}.bt`,
    availableLanguage: ['English', 'Dzongkha'],
  },
  sameAs: [
    `https://www.instagram.com/${APP_NAME}/`,
    `https://www.facebook.com/${APP_NAME}/`,
    `https://www.linkedin.com/company/${APP_NAME}btn/`,
  ],
});

/**
 * WebSite Schema (with SearchAction)
 */
export const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: APP_NAME_CAPITALIZED,
  url: APP_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${APP_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/**
 * Event Schema (Detailed Event & Ticket structured data)
 */
export const buildEventSchema = (event, eventUrl = '') => {
  if (!event) return null;

  // Format ISO Date Time if available
  let startDateTime = event.event_date;
  if (event.event_date && event.event_time) {
    startDateTime = `${event.event_date}T${event.event_time}`;
  }

  const imageUrl =
    event.event_image?.startsWith('http')
      ? event.event_image
      : event.event_image
      ? `${import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:8000'}${event.event_image}`
      : `${APP_URL}/tixelologo.jpeg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.event_name,
    description: event.event_description || `${event.event_name} in ${event.event_location || 'Bhutan'}`,
    image: [imageUrl],
    startDate: startDateTime || new Date().toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.event_location || 'Bhutan Event Venue',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.event_location || 'Thimphu',
        addressCountry: 'BT',
      },
    },
    offers: {
      '@type': 'Offer',
      url: eventUrl || `${APP_URL}/event/${event.id}`,
      price: event.event_price !== undefined ? String(event.event_price) : '0',
      priceCurrency: 'BTN',
      availability:
        event.is_event_available && event.event_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      validFrom: event.created_at || new Date().toISOString(),
    },
    organizer: {
      '@type': 'Organization',
      name: APP_NAME_CAPITALIZED,
      url: APP_URL,
    },
  };
};

/**
 * BreadcrumbList Schema
 */
export const buildBreadcrumbSchema = (breadcrumbs = []) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${APP_URL}${crumb.item}`,
    })),
  };
};
