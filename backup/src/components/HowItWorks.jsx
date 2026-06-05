import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, Shield, Cpu, Layers, Activity, Smartphone, 
  Terminal, Database, HardDrive, ArrowRight, CheckCircle2,
  Lock, Wifi, Gauge, Globe, Code, Box, Smartphone as PhoneIcon,
  Store, Utensils, Users, Sparkles, BarChart3
} from 'lucide-react';
import { MEMBERSHIPS } from '../lib/products';
import { sb } from '../lib/supabase';

export default function HowItWorks() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const navigate = useNavigate();

  const handleUpgrade = async (tier) => {
    const directLink = billingCycle === 'monthly' ? tier.stripe_link_monthly : tier.stripe_link_yearly;
    
    if (directLink && directLink.startsWith('http')) {
      window.location.href = directLink;
      return;
    }

    try {
      const { data: { user } } = await sb.auth.getUser();

      const response = await fetch('/.netlify/functions/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id,
          userEmail: user?.email,
          tierId: tier.id,
          stripePriceId: billingCycle === 'monthly' ? tier.stripe_price_id_monthly : tier.stripe_price_id_yearly,
          interval: billingCycle === 'monthly' ? 'month' : 'year',
          source: 'how_it_works_page'
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Engine unreachable (${response.status}).`);
      }

      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Engine Failure:', err);
      alert(`Spark Engine Alert: ${err.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-surface min-h-screen text-primary selection:bg-orange-500/30">
      <Helmet>
        <title>How it Works? | SparkStation Architecture</title>
        <meta name="description" content="Explore the SparkStation engine — NFC hardware, artisan microsites, dynamic routing, and the full Switchboard automation engine." />
      </Helmet>
      
      {/* TECH HERO */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        
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
                <Terminal size={14} /> System Specification v1.4
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic pb-2"
              >
                Precision <br/>
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 pr-8">Engineering</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-2xl text-secondary max-w-xl font-medium leading-relaxed"
              >
                The hardware is the body. The Engine is the brain. Explore the architecture that powers every physical-digital connection.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-12 border-t border-border-subtle pt-12">
               <div className="space-y-4">
                  <div className="text-orange-500 font-black text-xs uppercase tracking-widest">Latency</div>
                  <div className="text-4xl font-black italic text-primary">50ms</div>
               </div>
               <div className="space-y-4">
                  <div className="text-orange-500 font-black text-xs uppercase tracking-widest">Encryption</div>
                  <div className="text-4xl font-black italic text-primary">AES-256</div>
               </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3.5rem] bg-card border border-border-subtle shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
               <div className="h-12 bg-surface-alt border-b border-border-subtle px-8 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <div className="ml-6 text-[10px] font-mono text-secondary uppercase tracking-widest font-black opacity-50">engine_core.js</div>
               </div>
               
               <div className="flex-1 p-10 font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">01</span>
                    <span className="text-blue-400">async function</span> <span className="text-orange-400">handleRedirect</span>(tap) &#123;
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">02</span>
                    <span className="ml-6 text-slate-500">// Fetch dynamic destination</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">03</span>
                    <span className="ml-6 text-blue-400">const</span> target = <span className="text-blue-400">await</span> engine.<span className="text-amber-400">lookup</span>(tap.serial);
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">04</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">05</span>
                    <span className="ml-6 text-slate-500">// Fire physical webhooks</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">06</span>
                    <span className="ml-6 text-blue-400">await</span> engine.<span className="text-amber-400">dispatch</span>(&#123;
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">07</span>
                    <span className="ml-12 text-primary">event:</span> <span className="text-emerald-400">'STATION_TAP'</span>,
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">08</span>
                    <span className="ml-12 text-primary">metadata:</span> tap.deviceInfo
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">09</span>
                    <span className="ml-6 text-primary">&#125;);</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">10</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">11</span>
                    <span className="ml-6 text-blue-400">return</span> Response.<span className="text-amber-400">redirect</span>(target.url);
                  </div>
                  <div className="flex gap-6">
                    <span className="text-secondary opacity-30">12</span>
                    <span>&#125;</span>
                  </div>
                  
                  <div className="absolute bottom-12 right-12 w-48 h-48 bg-orange-500/20 blur-[60px] rounded-full animate-pulse" />
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-orange-500/5 rounded-[4rem] -rotate-3 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* REAL-WORLD APPLICATION (USE CASES) */}
      <section className="py-48 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none pb-1">One Tap. <span className="text-orange-500">Infinite Control.</span></h2>
              <p className="text-xl text-secondary font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">How artisans are utilizing the engine today</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Boutique Retail", desc: "Turn products into storytellers. Taps trigger 'Meet the Maker' videos or material sourcing transparency.", icon: <Store /> },
                { title: "Modern Eatery", desc: "Digital menus, live specials, and instant Google Review prompts. Managed from the phone.", icon: <Utensils /> },
                { title: "Digital Creator", desc: "One station to replace a thousand business cards. Portfolios and booking links in their pocket.", icon: <Users /> }
              ].map((useCase, i) => (
                <div key={i} className="p-12 rounded-[3.5rem] bg-card border border-border-subtle hover:border-orange-500/30 transition-all group text-center">
                   <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
                      {React.cloneElement(useCase.icon, { size: 32 })}
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-primary">{useCase.title}</h3>
                   <p className="text-secondary text-sm font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{useCase.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* OPERATIONAL PILLARS */}
      <section className="py-48 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
          <div className="flex-1 space-y-16">
             <div className="space-y-6">
                <div className="text-orange-500 font-black text-xs uppercase tracking-[0.3em]">Operational Layer</div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] pb-2 text-primary">The <span className="inline-block text-orange-500 pr-4">Engine</span></h2>
                <p className="text-2xl text-secondary font-medium leading-relaxed">
                  Bridge the gap between physical touch and digital workflow with the Switchboard automation engine.
                </p>
             </div>
            
            <div className="space-y-8">
               {[
                 { title: "Dynamic Redirection", desc: "Instantly remap your station's destination without touching the hardware.", icon: <Zap size={24} /> },
                 { title: "Physical Webhooks", desc: "Trigger Zapier, Make, or custom API endpoints with a single tap.", icon: <Cpu size={24} /> },
                 { title: "Human Telemetry", desc: "Understand your physical traffic with interaction heatmaps in real-time.", icon: <Activity size={24} /> },
                 { title: "Fleet Orchestration", desc: "Manage 1 or 1,000 stations from a single artisan dashboard.", icon: <Globe size={24} /> }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-10 group">
                    <div className="w-16 h-16 rounded-2xl bg-surface-alt border border-border-subtle flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary">{feature.title}</h3>
                      <p className="text-xs text-secondary font-bold uppercase tracking-widest leading-relaxed max-w-sm opacity-60 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 gap-8">
             <div className="p-12 rounded-[3.5rem] bg-orange-500 text-white space-y-8 shadow-2xl shadow-orange-500/10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                   <Smartphone size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">Artisan Microsites</h3>
                <p className="text-orange-100 font-medium leading-relaxed">
                   Deploy high-fidelity, mobile-optimized digital storefronts and profiles that load instantly when your station is tapped. No coding required, just your craft.
                </p>
             </div>
             <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <HardDrive size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">On-Device Security</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                   Hardware-level anti-cloning and password protection ensure that only you can map your station's destination.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PLANS (FROM MEMBERSHIP) */}
      <section id="pricing" className="py-48 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-6">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">Choose Your <br/> <span className="text-orange-500">Pulse</span></h2>
               <p className="text-xl text-slate-500 font-black uppercase tracking-widest">Pricing tiers for every stage of artisan growth</p>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-3xl">
               <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 Monthly
               </button>
               <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 Yearly
                 <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-xl">SAVE 17%</div>
               </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {MEMBERSHIPS.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative glass rounded-[3.5rem] p-12 flex flex-col border transition-all duration-500 ${tier.highlight ? 'border-orange-500/50 bg-orange-500/5 shadow-2xl scale-105 z-10' : 'border-white/5 hover:border-white/10'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-widest shadow-xl">
                    Artisan's Choice
                  </div>
                )}

                <div className="mb-12">
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">{tier.id}</div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-6">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      ${billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly}
                    </span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <div className="space-y-5 mb-16 flex-1">
                  {tier.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-4 text-sm font-medium">
                      <CheckCircle2 size={18} className={tier.highlight ? 'text-orange-500' : 'text-slate-600'} />
                      <span className="text-slate-300 leading-tight uppercase tracking-wide text-[10px] font-bold">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    if (tier.contact) {
                      window.location.href = 'mailto:sales@sparkstation.link';
                    } else if (tier.price_monthly === 0) {
                      navigate('/login');
                    } else {
                      handleUpgrade(tier);
                    }
                  }}
                  className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tier.highlight ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                   {tier.contact ? 'Contact Sales' : (tier.price_monthly === 0 ? 'Start Free' : 'Activate Engine')} <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL FOOTER CTA */}
      <section className="py-48 px-6 text-center">
        <div className="max-w-5xl mx-auto glass p-24 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
          <div className="relative space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">Scale Your <br/> <span className="text-orange-500">Ambition</span></h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Whether you're opening your first shop or managing a global fleet, the Engine scales with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="w-full sm:w-auto px-16 py-8 rounded-3xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                Get Your Hardware
              </Link>
              <Link to="/identity" className="w-full sm:w-auto px-16 py-8 rounded-3xl bg-surface-alt border border-border-subtle text-primary font-black text-xs uppercase tracking-widest hover:bg-orange-500/10 transition-all">
                Explore Identity
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
