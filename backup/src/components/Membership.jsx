import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, Cpu, BarChart3, Mail, Smartphone, 
  ArrowRight, CheckCircle2, Sparkles, Globe, 
  Layers, Lock, Database, Infinity, TrendingUp,
  Activity, MessageSquare, Briefcase, Store, Utensils, Users, Music
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MEMBERSHIPS } from '../lib/products';
import { sb } from '../lib/supabase';

export default function Membership() {
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
          source: 'membership_page'
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Engine unreachable (${response.status}). ${text.slice(0, 50)}...`);
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Engine returned a response but no checkout URL was found.');
      }
    } catch (err) {
      console.error('Spark Engine Failure:', err);
      alert(`Spark Engine Alert: ${err.message}\n\nTroubleshooting:\n1. Ensure 'npm run ndev' is running.\n2. Verify STRIPE_SECRET_KEY in .env.\n3. Check browser console for network logs.`);
    }
  };

  const useCases = [
    {
      title: "For the Boutique Shop",
      desc: "Turn every product into a storyteller. Let customers tap a 'Meet the Maker' tag to see the process, the materials, and the artisan behind the piece.",
      icon: <Store />,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "For the Modern Eatery",
      desc: "Point your station to your menu, Google review page, or daily specials — and change it from your phone in seconds. Zero paper, always current.",
      icon: <Utensils />,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "For the Creator",
      desc: "Your entire portfolio, social links, and booking calendar in their pocket. One card to replace a thousand paper ones.",
      icon: <Users />,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  const features = [
    {
      title: "Dynamic Intelligence",
      desc: "Change where your hardware points in real-time. Night mode for bars, weekend menus for cafes, or instant event redirects.",
      icon: <Activity className="text-orange-500" />
    },
    {
      title: "Human Telemetry",
      desc: "Understand your physical traffic. See which products are getting tapped the most and where your community is growing.",
      icon: <BarChart3 className="text-blue-500" />
    },
    {
      title: "White-Label Experience",
      desc: "Your brand, front and center. Remove SparkStation branding and create a seamless experience that feels 100% yours.",
      icon: <Layers className="text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-orange-500/30 overflow-x-hidden">
      <Helmet>
        <title>Membership Plans | SparkStation</title>
        <meta name="description" content="Choose your SparkStation plan. Free, Pro, and Enterprise tiers with NFC hardware, artisan microsites, analytics, and Switchboard automation." />
        <link rel="canonical" href="https://tap.sparkstation.link/membership" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Membership Plans | SparkStation" />
        <meta property="og:description" content="Choose your SparkStation plan. Free, Pro, and Enterprise tiers." />
        <meta property="og:image" content="https://tap.sparkstation.link/spark_card_home.png" />
        <meta property="og:url" content="https://tap.sparkstation.link/membership" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Membership Plans | SparkStation" />
        <meta name="twitter:image" content="https://tap.sparkstation.link/spark_card_home.png" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} /> The Spark Engine
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic"
          >
            Power Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Physical Space</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The hardware is the body. The Engine is the brain. Unlock the full potential of your physical nodes with intelligence, analytics, and automation.
          </motion.p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${useCase.bg} ${useCase.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(useCase.icon, { size: 28 })}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{useCase.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
             <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                  One Tap. <br/>
                  <span className="text-orange-500">Infinite Control.</span>
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  We built the Engine to handle the complexity so you can focus on the craft. Whether you have one station or a thousand, management is instant.
                </p>
             </div>

             <div className="space-y-8">
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black uppercase text-sm tracking-widest">{feature.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="relative aspect-square">
             <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full" />
             <div className="relative h-full glass rounded-[4rem] border border-white/10 p-12 flex flex-col justify-center items-center text-center space-y-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)]">
                   <Zap size={64} className="text-white" fill="white" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black uppercase tracking-tighter">Engine v2.0</h3>
                   <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time Connection Logic</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">99.9% Uptime</div>
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">TLS Encrypted</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="space-y-4">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Subscription <br/>Plans</h2>
               <p className="text-secondary text-sm font-bold uppercase tracking-widest">Choose the pulse that matches your ambition</p>
            </div>

            <div className="flex items-center gap-2 bg-surface-alt border border-white/5 p-1 rounded-2xl">
               <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 Monthly
               </button>
               <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 Yearly
                 <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[7px] font-black px-2 py-1 rounded-full shadow-lg">SAVE 17%</div>
               </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MEMBERSHIPS.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative glass rounded-[3rem] p-10 flex flex-col border transition-all duration-500 ${tier.highlight ? 'border-orange-500/50 bg-orange-500/5 shadow-2xl scale-105 z-10' : 'border-white/5 hover:border-white/10'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                    Artisan's Choice
                  </div>
                )}

                <div className="mb-10">
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4">{tier.id}</div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      ${billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly}
                    </span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  {tier.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 size={16} className={tier.highlight ? 'text-orange-500' : 'text-slate-600'} />
                      <span className="text-slate-300 leading-tight">{feature}</span>
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
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tier.highlight ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                   {tier.contact ? 'Contact Sales' : (tier.price_monthly === 0 ? 'Start Free' : 'Activate Engine')} <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto glass p-20 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
          <div className="relative space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Ready to Scale?</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl mx-auto">
              Whether you're opening your first shop or managing a global chain, the Engine scales with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                Get Your Hardware
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 rounded-2xl glass border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
