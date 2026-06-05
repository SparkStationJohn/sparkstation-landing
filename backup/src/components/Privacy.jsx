import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="bg-surface min-h-screen text-primary p-6 md:p-20 font-sans">
      <Helmet>
        <title>Privacy Policy | SparkStation</title>
        <meta name="description" content="SparkStation privacy policy. Learn how we handle your data, NFC tap telemetry, and personal information." />
        <link rel="canonical" href="https://sparkstation.link/privacy" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px] mb-12 hover:gap-4 transition-all">
          <ChevronLeft size={14} /> Back to Hub
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-16 rounded-[2.5rem] border border-white/5"
        >
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase mb-8">Privacy Policy</h1>
          <p className="text-secondary text-xs mb-10">Last Updated: May 14, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-secondary">
            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">1. Information Collection</h2>
              <p>We collect information you provide directly to us when you create an account, activate a SparkStation, or update hardware redirects. This includes your name, email address, and Google profile data.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">2. Usage of Data</h2>
              <p>Your data is used exclusively to manage your hardware assets and provide the redirection services. We do not sell your data. We use Supabase and Google Auth for secure data processing.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">3. Hardware Telemetry</h2>
              <p>SparkStation hardware logs interaction counts (taps) to provide you with analytics. No personally identifiable information is collected from users who tap your physical devices unless you explicitly configure your destination URL to do so.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">4. Payment Processing & Financial Security</h2>
              <p className="mb-4">All financial transactions on SparkStation are processed via Stripe, Inc. We utilize Stripe for all billing, subscription management, and hardware purchases. SparkStation does not store or have access to your raw credit card numbers or bank account details.</p>
              <p>Your payment data is encrypted via SSL/TLS and transmitted directly to Stripe's secure infrastructure. Stripe's use of your personal information is governed by their own Privacy Policy. Our implementation adheres to PCI-DSS (Payment Card Industry Data Security Standard) requirements to ensure your financial identity remains private and secure.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">5. Website Analytics &amp; Marketing Tracking</h2>
              <p className="mb-4">SparkStation uses standard web analytics tools to understand how visitors interact with our public-facing marketing pages, including sparkstation.link, /shop, /membership, and similar public routes. These tools may collect anonymized data such as page views, session duration, referral sources, and general geographic region to help us improve our products and marketing.</p>
              <p className="mb-4">This analytics tracking applies exclusively to the public portions of our website. <strong>It does not extend to your authenticated session, your Command Center dashboard, hardware registry, tap events, lead captures, redirect configurations, or any other data associated with your account.</strong> Once you are logged in, your operational activity remains entirely private and is never reported to external analytics services or third-party advertising networks.</p>
              <p>We do not sell, rent, or share your analytics data with data brokers or advertising platforms. Marketing analytics collected from public pages are used solely by SparkStation for internal product and growth analysis.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">6. Dashboard Privacy Firewall</h2>
              <p>Your authenticated dashboard is a private operational environment. SparkStation is committed to ensuring that your business data — including tap telemetry, client leads, station configurations, and subscription details — is never surfaced to external analytics, advertising, or tracking systems. All data within the authenticated platform is governed exclusively by our internal security infrastructure and is processed solely for the purpose of delivering the SparkStation service to you.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">7. Security</h2>
              <p>We implement Row Level Security (RLS) and industry-standard encryption to protect your hardware registry and redirect configurations.</p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Privacy Inquiries</h2>
              <p className="mb-4">To request data deletion or inquire about your information:</p>
              <div className="space-y-2">
                <a href="mailto:support@sparkstation.link" className="block text-white font-black hover:text-orange-500 transition-colors">support@sparkstation.link</a>
                <a href="mailto:sales@sparkstation.link" className="block text-slate-400 text-xs hover:text-white transition-colors">sales@sparkstation.link</a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
