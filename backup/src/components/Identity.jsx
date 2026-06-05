import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Layout, BarChart3, Fingerprint, Share2, 
  Smartphone, Palette, Globe, ArrowRight, Zap, 
  ShieldCheck, MousePointer2, ExternalLink, Sparkles,
  Layers, Code, Box, Activity, Network, Command, ChevronRight
} from 'lucide-react';

export default function Identity() {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const blocks = [
    { id: 'profile', icon: <User size={24} />, title: 'Identity Core', desc: 'The anchor of your presence. Logo, handle, and professional biography.', position: 'top-0 left-0 lg:-translate-x-12' },
    { id: 'socials', icon: <Share2 size={24} />, title: 'Social Grid', desc: 'High-fidelity links to your digital universe—Instagram, Twitter, LinkedIn.', position: 'top-20 right-0 lg:translate-x-12' },
    { id: 'missions', icon: <Layers size={24} />, title: 'Mission Logic', desc: 'The "Brain" of the tag. Swap between retail, review, or lead capture modes.', position: 'bottom-20 left-0 lg:-translate-x-20' },
    { id: 'pulse', icon: <Activity size={24} />, title: 'Pulse Engine', desc: 'Real-time telemetry tracking every interaction across the physical fleet.', position: 'bottom-0 right-0 lg:translate-x-20' }
  ];

  return (
    <div className="bg-surface min-h-screen text-primary selection:bg-orange-500/30 overflow-hidden">
      <Helmet>
        <title>Identity Blueprint | SparkStation Architecture</title>
        <meta name="description" content="Deconstructing the SparkStation identity engine. Explore how hardware missions, digital signatures, and pulse telemetry unify into a single artisan fleet." />
        <link rel="canonical" href="https://tap.sparkstation.link/identity" />
      </Helmet>
      
      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6">
        {/* Subtle Glow Backgrounds */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            <div className="space-y-8">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Command size={14} /> Specification v1.4
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic pb-2"
              >
                Identity <br/>
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 pr-8">Blueprint</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-2xl text-secondary max-w-xl font-medium leading-relaxed"
              >
                SparkStation is an open architecture for the modern artisan. It bridges the gap between physical touch and digital intent.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center gap-4 pt-8"
              >
                <Link 
                  to="/dashboard"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 group"
                >
                  Claim Your Identity <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/demo"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-surface-alt border border-border-subtle text-primary font-black text-xs uppercase tracking-widest hover:bg-surface-elevated transition-all flex items-center justify-center gap-2"
                >
                  Explore Platform <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-border-subtle pt-12">
               <div className="space-y-4">
                  <div className="text-orange-500 font-black text-xs uppercase tracking-widest">01. Hardware Layer</div>
                  <p className="text-sm text-secondary font-medium leading-relaxed">Encrypted NFC assets acting as physical keys to your digital embassy.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-orange-500 font-black text-xs uppercase tracking-widest">02. Logic Layer</div>
                  <p className="text-sm text-secondary font-medium leading-relaxed">The Switchboard—where missions are defined and destinations are mapped.</p>
               </div>
            </motion.div>
          </motion.div>

          {/* BLUEPRINT VISUALIZER */}
          <div className="relative h-[600px] flex items-center justify-center">
            {/* CENTRAL HUB */}
            <div className="relative z-20 w-40 h-40 rounded-[2.5rem] bg-orange-500 flex items-center justify-center text-white shadow-[0_0_80px_rgba(249,115,22,0.3)] border-4 border-surface">
              <Zap size={64} fill="currentColor" />
            </div>

            {/* CONNECTING LINES */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
               <svg className="w-full h-full" viewBox="0 0 600 600">
                  <path d="M300 300 L120 120" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                  <path d="M300 300 L480 180" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                  <path d="M300 300 L180 480" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
                  <path d="M300 300 L480 480" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
               </svg>
            </div>

            {/* FLOATING BLOCKS */}
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                className={`absolute ${block.position} z-30 group cursor-help`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <div className={`p-8 rounded-[2rem] bg-surface-alt/80 backdrop-blur-md border transition-all duration-500 ${hoveredBlock === block.id ? 'border-orange-500 shadow-2xl' : 'border-border-subtle shadow-xl'}`}>
                   <div className="text-orange-500 mb-4">{block.icon}</div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-2">{block.title}</h4>
                   <p className={`text-xs text-secondary font-medium leading-relaxed max-w-[180px] transition-opacity duration-500 ${hoveredBlock === block.id ? 'opacity-100' : 'opacity-60'}`}>
                      {block.desc}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SWITCHBOARD SECTION */}
      <section className="py-48 px-6 border-t border-border-subtle relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-8 order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { mode: 'Retail Mode', desc: 'Point tags to product collections or Shopify checkouts.', active: true },
                   { mode: 'Lead Capture', desc: 'Collect contact info directly from a physical interaction.', active: false },
                   { mode: 'Gallery View', desc: 'Showcase your portfolio with high-fidelity image grids.', active: false },
                   { mode: 'Social Hub', desc: 'A unified gateway to every digital profile you own.', active: false }
                 ].map((mode, i) => (
                   <div key={i} className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${mode.active ? 'bg-orange-500/10 border-orange-500 shadow-2xl shadow-orange-500/5' : 'bg-surface-alt border-border-subtle opacity-40'}`}>
                      <div className="flex items-center gap-3 mb-6">
                         <div className={`w-3 h-3 rounded-full ${mode.active ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]' : 'bg-secondary'}`} />
                         <span className="text-xs font-black uppercase tracking-widest text-primary">{mode.mode}</span>
                      </div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] leading-relaxed">{mode.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="text-orange-500 font-black text-xs uppercase tracking-[0.3em]">Operational Logic</div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] pb-2 text-primary">The <span className="inline-block text-orange-500 pr-4">Switchboard</span></h2>
              </div>
              <p className="text-2xl text-secondary font-medium leading-relaxed">
                Your hardware is the key, but the Switchboard is the engine. Instantly remap your station's destination in real-time.
              </p>
              <div className="space-y-6 pt-6">
                 <div className="flex items-center gap-8 p-8 rounded-3xl bg-surface-alt border border-border-subtle hover:border-orange-500/30 transition-colors">
                    <div className="p-4 bg-orange-500/10 rounded-2xl">
                       <Zap className="text-orange-500" size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Instant Redirection</h4>
                       <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em]">Update routes globally in under 100ms.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8 p-8 rounded-3xl bg-surface-alt border border-border-subtle hover:border-orange-500/30 transition-colors">
                    <div className="p-4 bg-orange-500/10 rounded-2xl">
                       <Layers className="text-orange-500" size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Multi-Mission Support</h4>
                       <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em]">Run different missions on different hardware sets.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ANONYMIZED PULSE */}
      <section className="py-48 px-6 overflow-hidden bg-surface-alt border-y border-border-subtle">
         <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  <ShieldCheck size={14} /> Privacy Guaranteed
               </div>
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] pb-2 text-primary">Anonymized <br/> <span className="inline-block text-orange-500 pr-4">Pulse</span></h2>
            </div>
            <p className="text-2xl text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
               We capture the frequency of the interaction, not the identity of the user. High-fidelity telemetry without compromising privacy.
            </p>
            <div className="relative pt-12">
               <div className="w-full h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-16">
                  <div className="space-y-4">
                     <div className="text-5xl font-black italic text-primary leading-none">100%</div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-30">
          &copy; 2026 SparkStation Platform. All rights reserved.
        </p>                  </div>
                  <div className="space-y-4">
                     <div className="text-5xl font-black italic text-primary leading-none">0.0ms</div>
                     <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Data Retained</div>
                  </div>
                  <div className="space-y-4">
                     <div className="text-5xl font-black italic text-primary leading-none">Live</div>
                     <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Global Telemetry</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 px-6 border-t border-border-subtle">
        <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.9] pb-4 text-primary">
            Claim Your <br/> <span className="inline-block text-orange-500 pr-8 italic">Embassy</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] bg-orange-500 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[0_0_80px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95"
            >
              Start Building
            </Link>
            <Link 
              to="/demo"
              className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] bg-surface-alt border border-border-subtle text-primary font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Explore Platform <ChevronRight size={18} />
            </Link>
            <Link 
              to="/shop"
              className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] bg-surface-alt border border-border-subtle text-primary font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all"
            >
              Get Hardware
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
