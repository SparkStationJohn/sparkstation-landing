import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import TemplateRenderer from './templates/TemplateRenderer';

export default function Profile() {
  const { userId, handle } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function trackPageView(profileId) {
      try {
        const ref = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Attribution Logic
        let source = 'direct';
        const srcParam = urlParams.get('src');
        if (srcParam) {
          source = srcParam;
        } else if (ref) {
          const r = ref.toLowerCase();
          if (r.includes('instagram.com')) source = 'instagram';
          else if (r.includes('t.co') || r.includes('twitter.com')) source = 'x';
          else if (r.includes('tiktok.com')) source = 'tiktok';
          else if (r.includes('linkedin.com')) source = 'linkedin';
          else if (r.includes('facebook.com')) source = 'facebook';
          else source = 'other';
        }

        // Hardware Detection Override
        if (urlParams.get('src') === 'hardware' || urlParams.get('aid')) {
          source = 'sparktag';
        }

        // Device Detection
        const ua = navigator.userAgent;
        let device = 'desktop';
        if (/tablet|ipad/i.test(ua)) device = 'tablet';
        else if (/Mobile|Android|iP(hone|od)/i.test(ua)) device = 'mobile';

        await sb.from('page_views').insert({
          profile_id: profileId,
          source: source,
          referrer: ref || null,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
          device_type: device
        });
      } catch (err) {
        console.warn('Analytics Tracking Error:', err);
      }
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        let query = sb
          .from('profiles')
          .select('*, template_id, content_data');

        if (handle) {
          query = query.eq('username', handle);
        } else if (userId) {
          query = query.eq('id', userId);
        } else {
          return;
        }

        const { data, error } = await query.single();

        if (error) {
          console.warn('Profile not found:', error.message);
          setProfile(null);
        } else {
          setProfile(data);
          // Trigger tracking once profile is resolved
          trackPageView(data.id);
        }
      } catch (err) {
        console.error('Profile Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId, handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing SparkStation...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900">404 - Profile Not Found</h1>
          <p className="text-slate-500 text-sm mt-2">This SparkStation has not been claimed yet or the handle is invalid.</p>
        </div>
      </div>
    );
  }

  const canonicalUrl = profile.username
    ? `https://tap.sparkstation.link/u/${profile.username}`
    : `https://tap.sparkstation.link/p/${profile.id}`;
  const ogImage = profile.logo_url || 'https://tap.sparkstation.link/spark_card_home.png';
  const pageTitle = `${profile.full_name || profile.business_name || profile.username} | SparkStation`;
  const pageDesc = profile.bio || 'View my digital identity and connect on SparkStation.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <TemplateRenderer profile={profile} />
    </>
  );
}
