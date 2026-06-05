import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Helper component to inject JSON-LD structured data into the <head>
 */
export default function StructuredData({ data }) {
  if (!data) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

/**
 * Generators for common SparkStation schemas
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SparkStation",
  "alternateName": "Desserbugs's Corner LLC",
  "url": "https://tap.sparkstation.link",
  "logo": "https://tap.sparkstation.link/favicon.png",
  "founder": [
    {
      "@type": "Person",
      "name": "John William Odell"
    }
  ],
  "description": "The definitive orchestration platform for makers and artisans. Bridging physical atoms to digital bits through professional NFC hardware.",
  "sameAs": [
    "https://instagram.com/sparkstation",
    "https://twitter.com/sparkstation"
  ]
});

export const getProductSchema = (product) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://tap.sparkstation.link${product.image_url}`,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "SparkStation"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://tap.sparkstation.link/shop`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.status === 'live' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
};

export const getFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
