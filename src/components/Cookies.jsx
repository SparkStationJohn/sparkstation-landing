import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Cookies() {
  return (
    <div className="bg-surface min-h-screen text-primary p-6 md:p-20 font-sans">
      <Helmet>
        <title>Cookie Policy | SparkStation</title>
        <meta name="description" content="SparkStation cookie policy. Learn about the cookies and tracking technologies used on our platform." />
        <link rel="canonical" href="https://sparkstation.link/cookies" />
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
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-8">Cookie Policy</h1>
          <p className="text-slate-500 text-xs mb-10">Last Updated: May 10, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">1. How We Use Cookies</h2>
              <p>We use essential cookies to maintain your session and security context (via Supabase and Google Auth). These are required for the SparkStation Dashboard to function correctly.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">2. Preferences</h2>
              <p>We store your theme preference (Light/Dark mode) in your local storage to ensure a consistent visual experience across the platform.</p>
            </section>

            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">3. Third Party</h2>
              <p>Our payment processor, Stripe, may use cookies to facilitate secure transactions and prevent fraud during the checkout process in the SparkStore.</p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Cookie Inquiries</h2>
              <p className="mb-4">For questions about our use of local storage or cookies:</p>
              <div className="space-y-2">
                <a href="mailto:support@sparkstation.link" className="block text-white font-black hover:text-orange-500 transition-colors">support@sparkstation.link</a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
