import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchSEO, fetchSiteConfig } from '../lib/marketing';

/**
 * DynamicSEO component fetches path-specific metadata from Supabase
 * with a site-wide suffix from global config.
 */
export default function DynamicSEO() {
  const location = useLocation();
  const [seo, setSeo] = useState(null);
  const [siteConfig, setSiteConfig] = useState(null);

  useEffect(() => {
    async function loadMeta() {
      const [seoData, configData] = await Promise.all([
        fetchSEO(location.pathname),
        fetchSiteConfig()
      ]);
      
      if (seoData) setSeo(seoData);
      if (configData) setSiteConfig(configData);
    }
    loadMeta();
  }, [location.pathname]);

  if (!seo) return null;

  const fullTitle = `${seo.title} ${siteConfig?.site_title_suffix || ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={`https://tap.sparkstation.link${location.pathname}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={`https://tap.sparkstation.link${location.pathname}`} />
      {seo.image_url && <meta property="og:image" content={seo.image_url} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image_url && <meta name="twitter:image" content={seo.image_url} />}
    </Helmet>
  );
}
