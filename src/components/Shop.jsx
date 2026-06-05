import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import { ShoppingBag, Zap, ArrowRight, ChevronRight, CheckCircle2, Sparkles, Shield, Box, CreditCard, Plus } from 'lucide-react';
import { HARDWARE as initialHardware, MEMBERSHIPS as initialMemberships } from '../lib/products';
import { getHardware, getMemberships } from '../lib/marketing';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { sb } from '../lib/supabase';
import StructuredData, { getProductSchema } from './StructuredData';

export default function Shop() {
  const { cart, addToCart, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [showSuccessModal, setShowSuccessModal] = React.useState(isSuccess);
  const [billingCycle, setBillingCycle] = React.useState('monthly');
  const [showNotifyModal, setShowNotifyModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [notifyEmail, setNotifyEmail] = React.useState('');
  const [notifySubmitting, setNotifySubmitting] = React.useState(false);
  const [notifySuccess, setNotifySuccess] = React.useState(false);
  
  // Dynamic Content State (Hydrated from Supabase)
  const [hardware, setHardware] = React.useState(initialHardware || []);
  const [memberships, setMemberships] = React.useState(initialMemberships || []);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleNotifyMe = (product) => {
    setSelectedProduct(product);
    setNotifySuccess(false);
    setNotifyEmail('');
    setShowNotifyModal(true);
  };

  const handleCloseNotify = () => {
    setShowNotifyModal(false);
    setNotifySuccess(false);
    setNotifyEmail('');
  };

  const handleWaitlistSubmit = async () => {
    if (!notifyEmail || notifySubmitting) return;
    setNotifySubmitting(true);
    try {
      await sb.from('waitlist').insert({
        email: notifyEmail,
        product_id: selectedProduct?.id || 'unknown',
        product_name: selectedProduct?.name || 'Unknown Product',
      });
      setNotifySuccess(true);
      setNotifyEmail('');
    } catch (err) {
      console.error('Waitlist signup failed:', err);
    } finally {
      setNotifySubmitting(false);
    }
  };

  const handleUpgrade = async (tierId) => {
    try {
      const { data: { user } } = await sb.auth.getUser();
      const tier = memberships.find(m => m.id === tierId);
      const stripePriceId = billingCycle === 'monthly' ? tier?.stripe_price_id_monthly : tier?.stripe_price_id_yearly;
      const response = await fetch('/.netlify/functions/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id,
          userEmail: user?.email,
          tierId,
          stripePriceId,
          interval: billingCycle === 'monthly' ? 'month' : 'year'
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Upgrade failed:', err);
    }
  };

  React.useEffect(() => {
    const syncPurchase = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      
      if (isSuccess && cart.length > 0 && !isSyncing) {
        setIsSyncing(true);
        try {
          const { data: userData } = await sb.auth.getUser();
          if (!userData?.user) {
             clearCart(); // Always clear if success, even if not logged in
             return;
          }

          // 1. If we have a sessionId, we strictly wait for the Webhook to fulfill the order
          if (sessionId) {
            // Poll for verification (Max 5 attempts, total 10 seconds)
            let verified = false;
            for (let i = 0; i < 5; i++) {
              const { data: existing } = await sb
                .from('purchases')
                .select('id, order_number')
                .eq('stripe_session_id', sessionId)
                .maybeSingle();
              
              if (existing) {
                verified = true;
                break;
              }
              // Wait 2 seconds before next poll
              await new Promise(r => setTimeout(r, 2000));
            }
            
            if (verified) {
              // Transaction Confirmed
            } else {
              // Order verification pending
            }
          }
          
          // Always clear cart on success redirect
          clearCart();
        } catch (err) {
          console.error('Purchase sync failed:', err);
          clearCart(); // Safety clear
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncPurchase();
  }, [isSuccess, cart]);

  // Fetch Marketing Content from Supabase
  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const [liveHardware, liveMemberships] = await Promise.all([
          getHardware(),
          getMemberships()
        ]);
        if (liveHardware) setHardware(liveHardware);
        if (liveMemberships) setMemberships(liveMemberships);
      } catch (err) {
        console.error('Zero-Build Sync Failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const activeProducts = (hardware || []).filter(p => p.status === 'live');
  const futureProducts = (hardware || []).filter(p => p.status === 'future' || p.status === 'early_access');
  const heroProduct = activeProducts.find(p => p.hero);
  const remainingActive = activeProducts.filter(p => !p.hero);

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-orange-500/30">
      <Helmet>
        <title>SparkStore | Artisan Collections & Digital Memberships</title>
        <meta name="description" content="Browse our professional NFC collections, artisan stations, and Spark PRO memberships. The definitive ecosystem for your digital identity." />
        <link rel="canonical" href="https://tap.sparkstation.link/shop" />
      </Helmet>

      {/* Structured Data Engine */}
      {activeProducts.map(product => (
        <StructuredData key={`schema-${product.id}`} data={getProductSchema(product)} />
      ))}

      {/* Navigation Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 pt-40 pb-20">
        {/* Hero Section */}
        <header className="max-w-3xl mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            EQUIP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">IDENTITY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 font-medium leading-relaxed"
          >
            Bridge the gap between physical and digital. High-fidelity NFC hardware designed to ignite your professional networking.
          </motion.p>
        </header>

        {/* HERO PRODUCT: STARTER PACK */}
        {heroProduct && (
          <div className="mb-32">
             <div className="flex items-center gap-4 mb-12">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-primary">Limited Release</h2>
                <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-tighter">In Stock</span>
              </div>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-surface-alt rounded-[4rem] border border-border-subtle overflow-hidden hover:border-orange-500/20 transition-all duration-700 flex flex-col lg:flex-row items-stretch shadow-2xl"
            >
              <div className="lg:w-1/2 aspect-square lg:aspect-auto relative overflow-hidden bg-slate-800">
                <img 
                  src={heroProduct.image_url || '/sparkstation_stand.png'} 
                  alt={heroProduct.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8">
                <div>
                  <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-widest w-fit mb-6">
                    {heroProduct.tag}
                  </div>
                  <h3 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 leading-none text-primary">{heroProduct.name}</h3>
                  <p className="text-secondary text-xl font-medium leading-relaxed max-w-md">{heroProduct.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heroProduct.features?.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-[10px] font-black text-secondary uppercase tracking-widest bg-card p-4 rounded-2xl border border-border-subtle">
                      <CheckCircle2 size={14} className="text-orange-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                   <div className="text-4xl font-black text-primary">
                      ${heroProduct.price?.toFixed(2) || '0.00'}
                    </div>

                    <button 
                      onClick={() => addToCart(heroProduct)}
                      className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 active:scale-95"
                    >
                      Secure Starter Pack <ShoppingBag size={18} />
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* SECTION: ACCESSORIES */}
        {remainingActive.length > 0 && (
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-black tracking-tighter uppercase text-primary">Workshop Direct</h2>
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest italic">Artisan Peripherals</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingActive.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-[3rem] border border-border-subtle overflow-hidden hover:border-orange-500/30 transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-surface-alt">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-card/40 backdrop-blur-md border border-border-subtle text-[9px] font-black uppercase tracking-widest text-primary">
                      {product.tag}
                    </div>
                  </div>

                  <div className="p-10 space-y-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black tracking-tight text-primary">{product.name}</h3>
                        <div className="text-xl font-black text-orange-500">
                          ${product.price?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <p className="text-secondary text-sm leading-relaxed">{product.description}</p>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-5 rounded-2xl bg-surface-alt border border-border-subtle text-primary font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      Add to Workshop <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: FUTURE VISION */}
        {futureProducts.length > 0 && (
          <div className="mb-32">
            <div className="glass rounded-[4rem] border border-orange-500/20 p-12 lg:p-20 relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] pointer-events-none" />
              <div className="relative max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} /> Roadmap 2026
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">The Future <br/> of <span className="text-orange-500">Display.</span></h2>
                <p className="text-secondary font-medium text-lg leading-relaxed">
                  Help us bring the next generation of artisan hardware to life. These concepts are in the lab—join the waitlist to signal demand and get early production updates.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-700">
              {futureProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-surface-alt rounded-[3rem] border border-border-subtle overflow-hidden flex flex-col"
                >
                  <div className="aspect-square relative overflow-hidden bg-surface-alt">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center">
                       <span className="px-6 py-3 rounded-full bg-card/80 border border-border-subtle text-[10px] font-black uppercase tracking-widest text-orange-500">In Development</span>
                    </div>
                  </div>

                  <div className="p-10 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-primary mb-2">{product.name}</h3>
                      <p className="text-secondary text-sm leading-relaxed line-clamp-2">{product.description}</p>
                    </div>

                    <button 
                      onClick={() => handleNotifyMe(product)}
                      className="w-full py-5 rounded-2xl bg-surface-alt border border-border-subtle text-secondary font-black text-[10px] uppercase tracking-widest hover:text-primary hover:bg-orange-500 hover:border-orange-500 transition-all"
                    >
                      Signal Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MEMBERSHIPS */}
        <div id="membership" className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-primary">The Engine</h2>
            <div className="flex-1 h-px bg-border-subtle" />
            <div className="flex items-center gap-2 bg-surface-alt border border-border-subtle p-1 rounded-2xl">
               <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-secondary hover:text-primary'}`}
               >
                 Monthly
               </button>
               <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-secondary hover:text-primary'}`}
               >
                 Yearly
                 <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[7px] font-black px-2 py-1 rounded-full shadow-lg">SAVE 17%</div>
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberships.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${tier.highlight ? 'bg-orange-500 border-orange-400 shadow-[0_0_50px_rgba(249,115,22,0.2)]' : 'bg-surface-alt border-border-subtle hover:border-border-medium'}`}
              >
                <div className="mb-8">
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${tier.highlight ? 'text-white' : 'text-orange-500'}`}>
                    {tier.tag}
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">{tier.name}</h3>
                  <p className={`text-sm leading-relaxed ${tier.highlight ? 'text-white/80' : 'text-secondary opacity-60'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="mb-10">
                  {tier.contact ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">Custom</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter">
                        ${billingCycle === 'monthly' ? tier.price_monthly : Math.round(tier.price_yearly / 12)}
                      </span>
                      <span className={`text-sm font-bold uppercase tracking-widest ${tier.highlight ? 'text-white/60' : 'text-secondary opacity-40'}`}>
                        /mo
                      </span>
                    </div>
                  )}
                  {!tier.contact && billingCycle === 'yearly' && tier.price_yearly > 0 && (
                    <p className={`text-[10px] font-bold mt-2 ${tier.highlight ? 'text-white/80' : 'text-green-500'}`}>
                      Billed ${tier.price_yearly} annually
                    </p>
                  )}
                  {tier.contact && (
                    <p className="text-[10px] font-bold mt-2 text-secondary opacity-40 uppercase tracking-widest">Enterprise & Agency Fleet</p>
                  )}
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  {tier.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={16} className={tier.highlight ? 'text-white' : 'text-orange-500'} />
                      <span className={tier.highlight ? 'text-white' : 'text-primary'}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => tier.contact ? (window.location.href = 'mailto:sales@sparkstation.link') : (tier.price_monthly > 0 && handleUpgrade(tier.id))}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tier.highlight ? 'bg-white text-orange-500 hover:scale-105' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                   {tier.contact ? 'Contact Sales' : (tier.price_monthly === 0 ? 'Start Free' : 'Activate Plan')} <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Guarantee */}
        <footer className="mt-32 pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
         {[
            { icon: Shield, title: '30-Day Guarantee', desc: 'Not satisfied? Contact us within 30 days of delivery for a full hardware refund. No questions asked.' },
            { icon: Box, title: 'Artisan Workshop', desc: 'Every SparkTag and SparkGO is precision-crafted in our local workspace. Founder\'s Access pricing — limited run.' },
            { icon: CreditCard, title: 'Stripe Secured', desc: 'Professional, encrypted checkout through the Stripe Secure API. PCI-DSS compliant.' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <item.icon size={24} />
              </div>
              <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </footer>
      </main>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-slate-900 border border-white/10 rounded-[4rem] p-12 lg:p-20 text-center relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-orange-500/20 blur-[100px] pointer-events-none" />
                
                <div className="relative space-y-8">
                  <div className="w-24 h-24 rounded-full bg-orange-500 mx-auto flex items-center justify-center text-white shadow-[0_0_50px_rgba(249,115,22,0.4)]">
                    <CheckCircle2 size={48} />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">Order Confirmed</h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">
                      Welcome to the fleet. Your SparkStation hardware is being prepared for fulfillment in our workshop.
                    </p>
                  </div>

                  <div className="pt-8 flex flex-col gap-4">
                    <Link 
                      to="/dashboard"
                      className="w-full py-6 rounded-3xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
                    >
                      Return to Dashboard
                    </Link>
                    <button 
                      onClick={() => setShowSuccessModal(false)}
                      className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NOTIFY ME MODAL */}
      <AnimatePresence>
        {showNotifyModal && (
          <div className="fixed inset-0 bg-surface/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6 text-primary">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-card border border-border-medium rounded-[3rem] p-10 relative overflow-hidden"
            >
              <div className="relative space-y-6">
                {notifySuccess ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">You're on the list.</h2>
                      <p className="text-slate-400 text-sm font-medium">
                        We'll notify you the moment <span className="text-white font-bold">{selectedProduct?.name}</span> is ready for fulfillment.
                      </p>
                    </div>
                    <button
                      onClick={handleCloseNotify}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Join the Waitlist</h2>
                      <p className="text-slate-400 text-sm font-medium">
                        Be the first to know when the <span className="text-white font-bold">{selectedProduct?.name}</span> is ready for artisan fulfillment.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                        placeholder="Your Email Address"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-orange-500 transition-all text-white"
                      />
                      <button
                        onClick={handleWaitlistSubmit}
                        disabled={!notifyEmail || notifySubmitting}
                        className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {notifySubmitting ? 'Saving...' : 'Keep Me Updated'}
                      </button>
                      <button
                        onClick={handleCloseNotify}
                        className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
