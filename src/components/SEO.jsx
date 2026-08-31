import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  APP_NAME_CAPITALIZED,
  APP_URL,
  DEFAULT_SEO,
  buildBreadcrumbSchema
} from '../utils/config';

/**
 * Helper to update or create a <meta> tag in the document head.
 */
const updateMetaTag = (attributeName, attributeValue, content) => {
  if (typeof document === 'undefined') return;
  if (!content && content !== '') return;

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create a <link> tag (e.g. canonical).
 */
const updateLinkTag = (rel, href) => {
  if (typeof document === 'undefined') return;
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Helper to inject or update JSON-LD structured data script.
 */
const updateJsonLd = (schemaData) => {
  if (typeof document === 'undefined') return;

  const scriptId = 'seo-structured-data';
  let scriptElement = document.getElementById(scriptId);

  if (!schemaData) {
    if (scriptElement) {
      scriptElement.remove();
    }
    return;
  }

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  try {
    scriptElement.textContent = JSON.stringify(schemaData);
  } catch (err) {
    console.warn('Failed to stringify JSON-LD structured data:', err);
  }
};

/**
 * Unified, zero-dependency SEO Component for React 19 + Vite.
 * Dynamically updates document metadata, Open Graph, Twitter Cards,
 * Canonical URLs, and JSON-LD structured data.
 */
const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
  schema,
  breadcrumbs
}) => {
  const currentPath =
    typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/';

  // Computed values with fallbacks
  const computedTitle = title
    ? title.includes(APP_NAME_CAPITALIZED)
      ? title
      : `${title} | ${APP_NAME_CAPITALIZED}`
    : DEFAULT_SEO.title;

  const computedDescription = description || DEFAULT_SEO.description;
  const computedKeywords = keywords || DEFAULT_SEO.keywords;

  const computedCanonical =
    canonical ||
    (currentPath === '/' ? APP_URL : `${APP_URL}${currentPath.split('?')[0]}`);

  const computedOgImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${APP_URL}${ogImage}`
    : DEFAULT_SEO.ogImage;

  // Determine robots indexing directive
  let robotsContent = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  if (noindex && nofollow) {
    robotsContent = 'noindex, nofollow';
  } else if (noindex) {
    robotsContent = 'noindex, follow';
  } else if (nofollow) {
    robotsContent = 'index, nofollow';
  }

  // Combine schemas (provided schema + breadcrumbs)
  const combinedSchemas = [];
  if (schema) {
    if (Array.isArray(schema)) {
      combinedSchemas.push(...schema.filter(Boolean));
    } else {
      combinedSchemas.push(schema);
    }
  }
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    if (breadcrumbSchema) combinedSchemas.push(breadcrumbSchema);
  }

  useEffect(() => {
    // 1. Document Title
    document.title = computedTitle;

    // 2. Standard Search Metadata
    updateMetaTag('name', 'description', computedDescription);
    updateMetaTag('name', 'keywords', computedKeywords);
    updateMetaTag('name', 'robots', robotsContent);
    updateMetaTag('name', 'googlebot', robotsContent);

    // 3. Canonical URL
    if (computedCanonical) {
      updateLinkTag('canonical', computedCanonical);
    }

    // 4. Open Graph Metadata
    updateMetaTag('property', 'og:title', computedTitle);
    updateMetaTag('property', 'og:description', computedDescription);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', computedCanonical);
    updateMetaTag('property', 'og:image', computedOgImage);
    updateMetaTag('property', 'og:site_name', APP_NAME_CAPITALIZED);
    updateMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Metadata
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', computedTitle);
    updateMetaTag('name', 'twitter:description', computedDescription);
    updateMetaTag('name', 'twitter:image', computedOgImage);

    // 6. JSON-LD Structured Data
    if (combinedSchemas.length === 1) {
      updateJsonLd(combinedSchemas[0]);
    } else if (combinedSchemas.length > 1) {
      updateJsonLd(combinedSchemas);
    } else {
      updateJsonLd(null);
    }

    // Cleanup on unmount (restore defaults when navigating away)
    return () => {
      // Intentionally leave the last rendered metadata so page transitions are smooth
    };
  }, [
    computedTitle,
    computedDescription,
    computedKeywords,
    computedCanonical,
    computedOgImage,
    ogType,
    twitterCard,
    robotsContent,
    JSON.stringify(combinedSchemas),
  ]);

  return null;
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      item: PropTypes.string.isRequired,
    })
  ),
};

export default SEO;
