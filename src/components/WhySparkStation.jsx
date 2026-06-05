import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Zap, Cpu, Shield, Heart, Sparkles, Globe, Target, Layers, ArrowRight, BarChart3, Fingerprint } from 'lucide-react';
import { fetchMarketingFeatures } from '../lib/marketing';

const ICON_MAP = {
  Target: <Target />,
  Layers: <Layers />,
  Shield: <Shield />,
  Sparkles: <Sparkles />,
  Globe: <Globe />,
  Heart: <Heart />
};

const ValueCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10 }}
    className="p-10 rounded-[3rem] bg-card border border-border-subtle hover:border-orange-500/30 transition-all group shadow-2xl"
  >
    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-4 italic leading-tight">{title}</h3>
    <p className="text-secondary text-sm leading-relaxed font-medium">
      {description}
    </p>
  </motion.div>
);

export default function WhySparkStation() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWhy() {
      try {
        const data = await fetchMarketingFeatures('philosophy');
        if (data.length > 0) setFeatures(data);
      } catch (err) {
        console.error('Why SparkStation Hydration Error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWhy();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-orange-500/30">
      <Helmet>
        <title>Our Roots | The Story of Desserbugs's Corner LLC</title>
        <meta name="description" content="Built by artisans, for artisans. Discover how we're bridging the gap between physical objects and digital souls through our 'Makers Helping Makers' manifesto." />
        <link rel="canonical" href="https://tap.sparkstation.link/why-sparkstation" />
        <meta property="og:title" content="Our Roots | The Vision Behind SparkStation" />
        <meta property="og:image" content="/sparkstation_founders.jpg" />
      </Helmet>

      {/* HERO SECTION - THE MARKET GAP */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Fingerprint size={14} /> The Market Gap
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] italic text-primary"
            >
              Why <span className="text-orange-500">Spark</span> <br />
              <span className="text-secondary">Station?</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Physical objects are currently silent. Most "digital" solutions are cheap plastic stickers with static links. We built the missing orchestration layer for high-end hardware.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-12 h-px bg-slate-800" />
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM VS SOLUTION SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border-subtle border border-border-subtle rounded-[4rem] overflow-hidden">
            
            {/* The Problem */}
            <div className="p-16 md:p-24 space-y-10 bg-card">
              <div className="space-y-4">
                 <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">The Friction</h2>
                 <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-primary">The <span className="text-secondary opacity-50">Legacy</span> Problem</h3>
              </div>
              <ul className="space-y-8">
                {[
                  "Cheap plastic cards that feel disposable and generic.",
                  "Static links that die when your business or social handle changes.",
                  "Zero data on how customers interact with your physical goods.",
                  "No way to manage multiple physical assets from one place."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-border-subtle mt-2 shrink-0" />
                    <p className="font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-16 md:p-24 space-y-10 bg-surface-alt">
              <div className="space-y-4">
                 <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">The Future</h2>
                 <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-primary">The <span className="text-orange-500">Spark</span> Solution</h3>
              </div>
              <ul className="space-y-8">
                {[
                  "High-fidelity hardware designed to blend seamlessly with your existing craft.",
                  "A Dynamic Engine that lets you remap missions in milliseconds.",
                  "Real-time telemetry and global engagement heatmaps.",
                  "Centralized Workshop to orchestrate your entire physical fleet."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    <p className="font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CORE DIFFERENTIATORS */}
      <section className="py-32 px-6 bg-surface-alt border-y border-border-subtle">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-primary">Why We <span className="text-orange-500">Win</span></h2>
            <p className="text-secondary font-bold uppercase tracking-widest text-xs">Standard features on every SparkStation deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(features.length > 0 ? features : [
              { icon_name: 'Target', title: 'Seamless Integration', description: "Our devices are designed to blend in with what you already have. From our signature wood-inlay starters to custom artisan housings, we prioritize aesthetic harmony over generic plastic utility." },
              { icon_name: 'Layers', title: 'Fleet Control', description: 'Remap one station or one thousand instantly. Your hardware stays in the field; your message evolves in the cloud.' },
              { icon_name: 'Shield', title: 'Data Sovereignty', description: 'No per-seat tax. No hidden fees. You own your hardware and your customer data, period.' },
              { icon_name: 'Globe', title: 'Global Heatmaps', description: 'See where your work is being touched in real-time. Gain intelligence on your physical impact across the world.' },
              { icon_name: 'Sparkles', title: 'Premium Digital', description: 'Your craft is high-fidelity. Your digital profile should be too. No generic grids—only beautiful, artisan-first microsites.' },
              { icon_name: 'Zap', title: 'Instant Resolve', description: 'Our redirection engine is optimized for sub-100ms response times, ensuring a seamless experience for your customers.' }
            ]).map((feature, i) => (
              <ValueCard 
                key={i}
                icon={feature.icon_name === 'Zap' ? Zap : () => ICON_MAP[feature.icon_name] || <Sparkles />}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* THE UNIVERSAL BRIDGE SECTION */}
      <section className="py-40 px-6 border-t border-border-subtle relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-black uppercase tracking-widest">
              Open Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-primary">
              The <span className="text-orange-500">Universal</span> <br/> Bridge.
            </h2>
            <p className="text-secondary text-lg font-medium leading-relaxed">
              We don't believe in walled gardens. At its core, every SparkTag and SparkGO is a high-fidelity bridge to whatever digital destination you choose. 
            </p>
            <div className="space-y-6 pt-4">
              {[
                { label: "External Destinations", desc: "Point your hardware to your Etsy shop, Instagram profile, or custom portfolio instantly." },
                { label: "Mission-Based Routing", desc: "Use our Dashboard to remap your tags without ever touching the physical device." },
                { label: "Orchestration Power", desc: "Even when pointing to external sites, we still provide the physical-to-digital analytics." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">{item.label}</h4>
                    <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center p-12 text-center"
          >
             <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight text-primary">
               "Your craft stays yours. <br/> <span className="text-orange-500">We just give it a voice.</span>"
             </p>
          </motion.div>
        </div>
      </section>

      {/* OUR ROOTS - THE FOUNDER STORY */}
      <section className="py-40 px-6 bg-surface-alt border-y border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            {/* The Story */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Our Roots</h2>
                <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-primary">
                  From Our <br/> <span className="text-orange-500">Workshop</span> to Yours.
                </h3>
              </div>

              <div className="space-y-6 text-secondary font-medium text-lg leading-relaxed">
                <p>
                  SparkStation didn't start in a boardroom—it started on a workbench at <span className="text-primary font-bold">Desserbugs's Corner LLC</span>. 
                </p>
                <p>
                  As a small-town maker studio, John and Jessie were looking for a way to give their physical creations a digital pulse without losing the artisan soul. We built the first SparkTags for our own projects, realizing that every maker deserves a bridge between the things they build and the stories they tell.
                </p>
                <p>
                  We believe in <span className="text-orange-500 font-bold uppercase italic tracking-widest">Makers Helping Makers</span>. Our hardware isn't mass-produced in a nameless factory—it's precision-milled and artisan-finished by people who understand the weight of your craft.
                </p>
              </div>

              <div className="pt-8 border-t border-border-subtle flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-primary">John & Jessie</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary italic">Founders, Desserbugs's Corner LLC</p>
                </div>
              </div>
            </motion.div>

            {/* The Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative group"
            >
              <div className="absolute -inset-4 bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-[4rem] border border-border-subtle overflow-hidden shadow-2xl aspect-[4/5] bg-surface-alt">
                <img 
                  src="/sparkstation_founders.jpg" 
                  alt="John and Jessie - Founders of SparkStation"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange-500 rounded-full flex items-center justify-center p-6 text-center shadow-2xl shadow-orange-500/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <p className="text-white font-black text-[10px] uppercase tracking-widest leading-tight">
                  Hand-Finished <br/> In Our Studio
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[4rem] bg-orange-500 p-16 md:p-24 overflow-hidden shadow-2xl shadow-orange-500/20 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 space-y-10 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.8]">
                Ready to <br />Orchestrate?
              </h2>
              <p className="text-orange-100 max-w-xl font-medium text-lg">
                Stop using silent objects. Join the new generation of phygital artisans and secure your brand's physical-digital future.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link to="/shop" className="px-12 py-6 bg-white text-orange-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-all shadow-2xl flex items-center justify-center gap-3">
                  Explore SparkStore <ArrowRight size={18} />
                </Link>
                <Link to="/how-it-works" className="px-12 py-6 bg-orange-600 text-white border border-orange-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-3">
                  Technical Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
