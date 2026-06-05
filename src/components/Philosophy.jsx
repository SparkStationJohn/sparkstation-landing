import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Cpu, Shield, Heart, Sparkles, Globe, Target, Layers } from 'lucide-react';
import { fetchMarketingFeatures } from '../lib/marketing';

const ICON_MAP = {
  Target: <Target />,
  Layers: <Layers />,
  Shield: <Shield />,
  Sparkles: <Sparkles />,
  Globe: <Globe />,
  Heart: <Heart />
};

const DifferenceCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-[2.5rem] glass border border-white/5 hover:border-orange-500/20 transition-all group"
  >
    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-3 italic">{title}</h3>
    <p className="text-secondary text-sm leading-relaxed font-medium">
      {description}
    </p>
  </motion.div>
);

export default function Philosophy() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhilosophy() {
      try {
        const data = await fetchMarketingFeatures('philosophy');
        if (data.length > 0) setFeatures(data);
      } catch (err) {
        console.error('Philosophy Hydration Error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPhilosophy();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-orange-500/30">

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
              >
                <Zap size={14} className="fill-current" /> Our Manifesto
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8 italic"
              >
                Beyond <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-x">The Card.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-secondary max-w-2xl font-medium leading-relaxed mb-12"
              >
                The world doesn't need another plastic business card. It needs a way to bridge the gap between handcrafted beauty and digital intelligence.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link to="/login" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                  Join the Mission
                </Link>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex-1 relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="relative rounded-[3rem] overflow-hidden border border-border-subtle shadow-2xl z-10 bg-surface-alt">
                   {/* This would be the sparked_artisan_vase image */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                   <img 
                    src="/sparked_artisan_vase.png" 
                    alt="Sparked Artisan Object" 
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                   />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(features.length > 0 ? features : [
              { icon_name: 'Target', title: 'Object Empowerment', description: "We don't make gadgets. We make materials for makers. A SparkTag can be embedded into a ceramic vase, a leather bag, or a wooden table. Your craft stays yours; we just give it a voice." },
              { icon_name: 'Layers', title: 'Fleet Orchestration', description: 'Manage 50 physical touchpoints as easily as one. Our Command Center is built for artisans who have work in multiple galleries, shops, and homes globally.' },
              { icon_name: 'Shield', title: 'No Seat Tax', description: 'We believe in fair commerce. No per-seat subscriptions, no ad-tracking, and no locking your hardware. You own the hardware; you own the data.' },
              { icon_name: 'Sparkles', title: 'Handcrafted Identity', description: 'Our landing pages are high-fidelity spaces that honor your craft. No generic grids or social media clones. We build digital homes that feel as premium as the physical objects you create.' },
              { icon_name: 'Globe', title: 'Real-Time Telemetry', description: 'Know the second your work is touched. Track global engagement heatmaps and see where your brand is making an impact across the physical world.' },
              { icon_name: 'Heart', title: 'Artisan Support', description: 'We are built for the makers, the creators, and the hardware pioneers. Our platform scales with your ambition, from your first sale to your global fleet.' }
            ]).map((feature, i) => (
              <DifferenceCard 
                key={i}
                icon={() => ICON_MAP[feature.icon_name] || <Sparkles />}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-48 bg-black/[0.02] dark:bg-white/[0.02] border-y border-black/5 dark:border-white/5 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-primary uppercase italic leading-tight">
            "We are bridging the gap between <span className="text-orange-500">atoms and bits</span>. Your work deserves to tell its own story."
          </h2>
          <div className="mt-12 flex flex-col items-center">
             <div className="w-12 h-px bg-orange-500 mb-6" />
             <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary opacity-40">The SparkStation Manifesto</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass rounded-[4rem] border border-orange-500/20 p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
            
            <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 italic">Ready to Spark <br />Your Fleet?</h2>
            <p className="text-secondary max-w-xl mx-auto mb-12 font-medium">
              Join the new generation of phygital artisans. Secure your hardware and start orchestrating your brand today.
            </p>
            <div className="flex justify-center gap-6">
              <Link to="/shop" className="px-12 py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20">
                Explore the Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
