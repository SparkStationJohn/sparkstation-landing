import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="bg-surface min-h-screen text-primary p-6 md:p-20 font-sans">
      <Helmet>
        <title>Terms of Service | SparkStation</title>
        <meta name="description" content="SparkStation terms of service. Read our usage policies, hardware warranty information, and legal agreements." />
        <link rel="canonical" href="https://sparkstation.link/terms" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px] mb-12 hover:gap-4 transition-all">
          <ChevronLeft size={14} /> Back to Hub
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-16 rounded-[2.5rem] border border-border-subtle"
        >
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase mb-8">Terms of Service</h1>
          <p className="text-secondary text-xs mb-10">Last Updated: May 14, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-secondary">
            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Acceptance of Terms</h2>
              <p>By activating a SparkStation hardware device or using the SparkStation platform, you agree to be bound by these terms.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">2. Hardware Ownership</h2>
              <p>SparkStation devices must be claimed via the official dashboard to enable cloud redirection features. You are responsible for the physical security and data destination of any device registered to your account.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">3. Prohibited Content</h2>
              <p>Users are prohibited from using SparkStation redirects to point to malicious, illegal, or harmful content. We reserve the right to suspend any hardware registry that violates these guidelines.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">4. Hardware Return Policy — 30-Day Satisfaction Guarantee</h2>
              <p className="mb-4">All SparkStation hardware purchases are backed by a <strong>30-day satisfaction guarantee</strong> from the date of confirmed delivery. If you are not fully satisfied with your hardware for any reason, contact us at support@sparkstation.link within 30 days of receipt and we will issue a full refund of the hardware purchase price.</p>
              <p className="mb-4">To initiate a return, the hardware must be in its original or reasonable condition. Return shipping costs are the responsibility of the customer unless the item arrived damaged or defective, in which case SparkStation will cover the return shipment. Refunds are processed within 5–10 business days of receiving the returned item.</p>
              <p>Digital subscriptions, platform memberships, and software services are not covered under the hardware return policy and are governed by Section 5 below.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">5. Subscriptions &amp; Cancellation</h2>
              <p className="mb-4">SparkStation platform subscriptions (Spark AUTOMATE, Spark PRO, Spark Fleet) are billed on a recurring basis as selected at time of purchase. You may cancel your subscription at any time through the Account &amp; Billing section of your dashboard. Cancellation takes effect at the end of the current billing period — you will retain full access until that date.</p>
              <p>SparkStation does not offer prorated refunds for partial subscription periods. If you believe you were billed in error, contact support@sparkstation.link within 14 days of the charge for review.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">6. Limitation of Liability</h2>
              <p>SparkStation is provided "as is." We are not liable for any disruptions in service or physical hardware failure after delivery and initial hardware activation.</p>
            </section>

            <section className="pt-8 border-t border-border-subtle">
              <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Contact Our Workshop</h2>
              <p className="mb-4">For legal or sales inquiries regarding these terms:</p>
              <div className="space-y-2">
                <a href="mailto:sales@sparkstation.link" className="block text-primary font-black hover:text-orange-500 transition-colors">sales@sparkstation.link</a>
                <a href="mailto:support@sparkstation.link" className="block text-secondary text-xs hover:text-primary transition-colors">support@sparkstation.link</a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
