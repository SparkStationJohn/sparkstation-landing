import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, Star, ArrowRight, Check, Shield, Smartphone, MapPin 
} from 'lucide-react';

const colorMap = {
  green:  { bg: 'bg-green-500/10', border: 'border-green-500/30', blur: 'bg-green-500/5', blurHover: 'group-hover:bg-green-500/10' },
  blue:   { bg: 'bg-blue-500/10', border: 'border-blue-500/30', blur: 'bg-blue-500/5', blurHover: 'group-hover:bg-blue-500/10' },
  amber:  { bg: 'bg-amber-500/10', border: 'border-amber-500/30', blur: 'bg-amber-500/5', blurHover: 'group-hover:bg-amber-500/10' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', blur: 'bg-purple-500/5', blurHover: 'group-hover:bg-purple-500/10' },
};

export default function LandingPage() {

  const handleBuy = (e) => {
    e.preventDefault();
    const browserId = localStorage.getItem('spark_browser_session') || '';
    let url = 'https://tap.sparkstation.link/shop?add_bundle=true';
    if (browserId) url += `&browser_id=${encodeURIComponent(browserId)}`;
    window.location.href = url;
  };

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans text-slate-100 overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <Helmet>
        <title>Get More Google Reviews — Instantly | SparkStation</title>
        <meta name="description" content="One tap. One review. One tag. SparkStation's Review Booster turns every customer interaction into a Google review — before they forget." />
      </Helmet>

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <header className="w-full py-5 md:py-8 px-5 md:px-12 flex justify-between items-center max-w-7xl mx-auto z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <Zap size={20} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">
            Spark<span className="text-orange-500">Station</span>
          </span>
        </div>
        <button 
          onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-5 py-2.5 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:border-orange-500/30 transition-all active:scale-95"
        >
          What It Does ↓
        </button>
      </header>

      {/* HERO */}
      <section className="relative pt-8 sm:pt-16 md:pt-24 pb-10 sm:pb-16 px-6 sm:px-8 md:px-10 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-green-400">
                One Tap. One Review. Done.
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[1.0]">
              Get More <span className="text-orange-500">Google Reviews.</span> Instantly.
            </h1>

            <p className="text-slate-400 font-medium text-base sm:text-lg leading-relaxed max-w-lg">
              Most customers mean to leave a review — they just forget. Put a SparkTag on your counter, your menu, or your checkout. One tap sends them straight to your Google review page. No app. No friction. Just reviews.
            </p>

            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl max-w-md">
              <Star size={20} className="text-yellow-500 fill-yellow-500 shrink-0" />
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                <span className="text-white font-black">70% of customers</span> would leave a review if asked. 
                <span className="text-slate-500"> Only 10% do — because the moment passes.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="https://tap.sparkstation.link/shop?add_bundle=true"
                onClick={handleBuy}
                className="px-8 py-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black rounded-2xl transition-all uppercase text-sm tracking-widest shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 group text-center"
              >
                Get the Review Booster
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-5 glass border border-white/10 text-slate-300 font-black rounded-2xl transition-all hover:border-orange-500/30 uppercase text-[10px] tracking-widest"
              >
                What It Does ↓
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Shield size={12} className="text-green-500" /> No App Required</span>
              <span className="flex items-center gap-1.5"><Smartphone size={12} className="text-green-500" /> iPhone & Android</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-green-500" /> Track Every Tap</span>
            </div>
          </div>

          {/* Right: Product Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[450px] lg:max-w-none">
              <div className="glass border border-white/5 rounded-[3rem] p-6 bg-gradient-to-br from-slate-900/60 via-slate-950/60 to-slate-900/60 shadow-2xl overflow-hidden">
                <img 
                  src="/hero_starter_pack_final.png" 
                  alt="SparkStation Review Booster Kit — artisan NFC tags" 
                  className="w-full h-auto rounded-[2rem]"
                />
                <div className="flex items-center gap-4 mt-5 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Beechwood Inlay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hand-Finished</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">No App Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-10 md:py-14 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center space-y-5">
          <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest">It started with a question.</p>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            My wife's friend needed signs for her beauty business. I embedded an NFC tag so customers could tap to find her Facebook page. 
            It worked. Then she asked: <span className="text-white font-bold italic">"What happens when I want to change this to my Instagram next week?"</span>
          </p>
          <p className="text-slate-500 text-xs">
            I didn't have an answer. So I built one.
          </p>
        </div>
      </section>

      {/* WHAT ONE TAG CAN DO */}
      <section id="scenarios" className="py-16 md:py-24 bg-slate-950/40 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">One Tag. Your Rules.</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Change What It Does From Your Phone. Anytime.
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-lg mx-auto">
              The same tag. Your dashboard. Pick the mission, update it in seconds. No reprinting. No new hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {[
              {
                color: 'green',
                icon: <Star size={22} className="text-yellow-500 fill-yellow-500" />,
                scene: 'You run a restaurant or retail shop.',
                action: 'Customer taps the tag on your counter.',
                result: 'Opens your Google review page. They leave 5 stars before they leave the parking lot.',
                label: 'Get More Reviews'
              },
              {
                color: 'blue',
                icon: <Zap size={22} className="text-blue-400" />,
                scene: 'You launch a new product or run a weekend special.',
                action: 'Update the tag\'s destination from your phone in 10 seconds.',
                result: 'Every tag in your shop now points to the new promo. No reprinting signs.',
                label: 'Flash Sales & Daily Specials'
              },
              {
                color: 'amber',
                icon: <Smartphone size={22} className="text-amber-400" />,
                scene: 'You want to grow your email list without a clipboard.',
                action: 'Customer taps the tag after a purchase or service.',
                result: 'Opens a form where they drop their email for a discount code. You get the lead.',
                label: 'Capture Leads Instantly'
              },
              {
                color: 'purple',
                icon: <MapPin size={22} className="text-purple-400" />,
                scene: 'You\'re a maker or artist with work to show.',
                action: 'Customer taps the tag next to your display piece.',
                result: 'Opens your portfolio — gallery, process videos, sold pieces, and your story.',
                label: 'Show Your Portfolio'
              }
            ].map((item, i) => {
              const c = colorMap[item.color];
              return (
              <div key={i} className={`glass p-6 md:p-7 rounded-[2.5rem] border border-white/5 ${item.color === 'green' ? 'hover:border-green-500/30' : item.color === 'blue' ? 'hover:border-blue-500/30' : item.color === 'amber' ? 'hover:border-amber-500/30' : 'hover:border-purple-500/30'} transition-all group relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-24 h-24 ${c.blur} blur-3xl pointer-events-none ${c.blurHover} transition-colors`} />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">{item.label}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      <span className="text-slate-300 font-bold">{item.scene}</span> {item.action}
                    </p>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      → {item.result}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* QR Code / All-Digital Footer */}
          <div className="text-center mt-10 md:mt-14 space-y-4">
            <p className="text-slate-500 text-xs font-medium">
              No hardware? <span className="text-white font-bold">Start with a free QR code.</span> Same engine. Zero cost. Upgrade to a tag anytime.
            </p>
            <a
              href="https://tap.sparkstation.link/login"
              className="inline-flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest hover:text-orange-300 transition-colors"
            >
              Create Your Free Account <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-slate-950/80 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">Simple Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Everything You Need
            </h2>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="glass border-2 border-orange-500/40 rounded-[3rem] p-7 md:p-10 bg-gradient-to-b from-orange-500/5 to-transparent shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] pointer-events-none" />
              
              <div className="text-center space-y-4 mb-8">
                <span className="px-3.5 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Review Booster Kit
                </span>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-lg font-black text-slate-500 mb-2">$</span>
                  <span className="text-6xl font-black text-white leading-none">48</span>
                  <span className="text-xl font-black text-slate-400 mb-1">.00</span>
                  <span className="text-xs font-bold text-slate-500 uppercase ml-2 tracking-widest">USD</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold">
                  Hardware kit + <span className="text-orange-400 font-black">1 month of SparkPRO</span> included
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  '1x Premium Beechwood SparkTag™',
                  '1x SparkGO™ Keychain Tag',
                  '1 Month SparkPRO — Full Platform Access',
                  'Instant Google Review Redirect (<200ms)',
                  'Live Tap Analytics & Geo-Mapping',
                  'Change Your Review Link Anytime',
                  'No App Required — Works on All Phones',
                  '30-Day Money-Back Guarantee'
                ].map(feat => (
                  <div key={feat} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://tap.sparkstation.link/shop?add_bundle=true"
                onClick={handleBuy}
                className="block w-full py-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black rounded-2xl transition-all uppercase text-xs tracking-widest shadow-xl shadow-orange-500/30 text-center"
              >
                Get the Review Booster →
              </a>

              <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                Secure checkout via Stripe • Free shipping $40+
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-14 px-6 border-t border-white/5 text-center space-y-3">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          © {new Date().getFullYear()} SparkStation — Desserbug's Corner LLC
        </p>
        <p className="text-[9px] font-bold text-slate-700 max-w-md mx-auto leading-relaxed">
          Designed, programmed, and hand-assembled in our workshop. Lumberton, Mississippi.
        </p>
      </footer>
    </div>
  );
}
