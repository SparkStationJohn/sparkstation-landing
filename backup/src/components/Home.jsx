import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Shield, Cpu, Smartphone, Globe, Clock, ChevronRight, ArrowRight, Sparkles, CheckCircle2, Share2, MapPin, Star, Image as ImageIcon, Map as MapIcon, BarChart3, User, Layers } from 'lucide-react';
import { fetchMarketingFAQ, fetchMarketingFeatures, fetchMarketingSolutions } from '../lib/marketing';
import { fetchSpotlight, fetchGlobalPulse, fetchProfileByUsername, fetchArtisans } from '../lib/community';
import SparkMap from './SparkMap';
import StructuredData, { getOrganizationSchema, getFAQSchema } from './StructuredData';

const ICON_MAP = {
  Zap: <Zap />,
  Shield: <Shield />,
  Cpu: <Cpu />,
  Smartphone: <Smartphone />,
  Globe: <Globe />,
  Clock: <Clock />,
  BarChart3: <BarChart3 />,
  Star: <Star />,
  Image: <ImageIcon />,
  Map: <MapIcon />
};

const SocialIcon = ({ platform, size = 16 }) => {
  switch (platform?.toLowerCase()) {
    case 'instagram': return <ImageIcon size={size} />;
    case 'twitter': return <Share2 size={size} />;
    case 'website': return <Globe size={size} />;
    case 'location': return <MapPin size={size} />;
    default: return <Globe size={size} />;
  }
};

export default function Home({ user }) {
  const [faqs, setFaqs] = useState([]);
  const [primaryFeatures, setPrimaryFeatures] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [activeSolution, setActiveSolution] = useState(null);
  const [spotlight, setSpotlight] = useState(null);
  const [platformProfile, setPlatformProfile] = useState(null);
  const [artisans, setArtisans] = useState([]);
  const [activeArtisanHandle, setActiveArtisanHandle] = useState('sparkstation');
  const [pulse, setPulse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarketingData() {
      try {
        const [faqData, primData, capData, solutionData, spotlightData, pulseData] = await Promise.all([
          fetchMarketingFAQ(),
          fetchMarketingFeatures('primary'),
          fetchMarketingFeatures('capabilities'),
          fetchMarketingSolutions(),
          fetchSpotlight(),
          fetchGlobalPulse(50)
        ]);
        
        // Fetch Platform Profile separately
        const platformData = await fetchProfileByUsername('sparkstation');
        setPlatformProfile(platformData);

        // Fetch Artisans for the Showcase
        const artisanData = await fetchArtisans();
        if (artisanData.length > 0) {
          setArtisans(artisanData);
          // Initial random start
          const randomIndex = Math.floor(Math.random() * artisanData.length);
          setActiveArtisanHandle(artisanData[randomIndex].username);
        }

        if (faqData.length > 0) setFaqs(faqData);
        if (primData.length > 0) setPrimaryFeatures(primData);
        if (capData.length > 0) setCapabilities(capData);
        if (solutionData.length > 0) {
          setSolutions(solutionData);
          setActiveSolution(solutionData[0]);
        }
        setSpotlight(spotlightData);
        setPulse(pulseData);
      } catch (err) {
        console.error('Home Marketing Hydration Error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMarketingData();
  }, []);

  // Cycle Showcase Artisans
  useEffect(() => {
    if (artisans.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = artisans.findIndex(a => a.username === activeArtisanHandle);
      const nextIndex = (currentIndex + 1) % artisans.length;
      setActiveArtisanHandle(artisans[nextIndex].username);
    }, 15000); // 15 seconds per profile for reading time

    return () => clearInterval(interval);
  }, [artisans, activeArtisanHandle]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const letterContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.1 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 }
    }
  };

  return (
    <div className="bg-surface min-h-screen text-primary selection:bg-orange-500/30 overflow-x-hidden">
      <Helmet>
        <title>SparkStation | The Artisan Bridge for Atoms & Bits</title>
        <meta name="description" content="One tap to connect. SparkStation is the definitive orchestration platform for makers and artisans. Bridge your physical craft to your digital identity with SparkTag and SparkGO." />
        <link rel="canonical" href="https://tap.sparkstation.link/" />
        <meta property="og:title" content="SparkStation | The Artisan Bridge for Atoms & Bits" />
        <meta property="og:description" content="One tap to connect. SparkStation is the definitive orchestration platform for makers and artisans." />
        <meta property="og:image" content="/assets/sparktag_clean.png" />
      </Helmet>

      {/* Structured Data Engine */}
      <StructuredData data={getOrganizationSchema()} />
      {faqs.length > 0 && <StructuredData data={getFAQSchema(faqs)} />}

      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles size={14} fill="currentColor" /> The Future of Physical Identity
            </motion.div>

            <motion.h1 
              variants={letterContainerVariants}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic text-primary"
            >
              <span className="inline-block whitespace-nowrap">
                {"Ignite".split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants} className="inline-block whitespace-pre">
                    {char}
                  </motion.span>
                ))}
              </span>
              {" "}
              <span className="inline-block whitespace-nowrap">
                {"Your".split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants} className="inline-block whitespace-pre">
                    {char}
                  </motion.span>
                ))}
              </span>
              <br/>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                <span className="inline-block whitespace-nowrap">
                  {"Digital".split("").map((char, i) => (
                    <motion.span key={i} variants={letterVariants} className="inline-block whitespace-pre">
                      {char}
                    </motion.span>
                  ))}
                </span>
                {" "}
                <span className="inline-block whitespace-nowrap">
                  {"Presence".split("").map((char, i) => (
                    <motion.span key={i} variants={letterVariants} className="inline-block whitespace-pre">
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-secondary max-w-xl font-medium leading-relaxed"
            >
              SparkStation is the bridge between the physical and digital. One tap connects your hardware to a complete identity platform — built for makers, creators, and brands.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link 
                to="/shop"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 group"
              >
                Visit SparkShop <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/demo"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl glass border border-white/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Explore Platform <ChevronRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-500">
                <CheckCircle2 size={11} /> Free plan — no card required
              </span>
              <span className="text-secondary opacity-30 text-[10px]">·</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-60">Launch Tags from $19</span>
              <span className="text-secondary opacity-30 text-[10px]">·</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-60">Plans from $9/mo</span>
            </motion.div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative"
          >
            <div className="relative z-10 p-4">
              <img 
                src="/assets/sparktag_clean.png" 
                alt="SparkTag Premium NFC Hardware" 
                className="w-full h-auto drop-shadow-[0_0_100px_rgba(249,115,22,0.2)]"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* THE ENGINE (HUMAN-FIRST) */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Built to <br/>
              <span className="text-orange-500 italic">Simply Work</span>
            </h2>
            <p className="text-xl text-secondary font-medium leading-relaxed">
              We took the complexity of hardware and buried it under a layer of pure artisan craft. No manuals, no setup fees, just magic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(primaryFeatures.length > 0 ? primaryFeatures : [
              { icon_name: "Smartphone", title: "No Apps, No Friction", description: "Your audience doesn't need to download anything. A single tap opens your world instantly on any modern phone." },
              { icon_name: "Shield", title: "Private by Design", description: "We never sell your data. Tap analytics belong to you alone — used to power your own insights dashboard, nothing else." },
              { icon_name: "Zap", title: "Lightning Fast", description: "We've engineered our engine to load in the blink of an eye. Because in the physical world, every second of a tap counts." }
            ]).map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                  {React.cloneElement(ICON_MAP[feature.icon_name] || <Zap />, { size: 32 })}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-primary">{feature.title}</h3>
                <p className="text-secondary font-medium leading-relaxed mb-6">{feature.description}</p>
                <Link 
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-white transition-colors group/link"
                >
                  Learn More <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Differentiators Section */}
          <div className="pt-20 border-t border-black/5 dark:border-white/5 space-y-16">

            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <h3 className="text-4xl md:text-5xl font-black uppercase italic leading-none">
                Not Another<br/>
                <span className="text-orange-500">Link Page.</span>
              </h3>
              <p className="text-secondary font-medium leading-relaxed">
                Most tools give you a list or a card. SparkStation gives you a complete physical-to-digital operating system — with the hardware to back it up.
              </p>
            </div>

            {/* Comparison table */}
            <div className="grid grid-cols-1 md:grid-cols-3 rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">
              <div className="p-8 bg-white/[0.01]">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 mb-6">Link Tools</p>
                <ul className="space-y-3">
                  {['Static link list','No hardware','No routing logic','No lead capture','Click counts only','Their domain, your name'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-secondary font-medium leading-snug">
                      <span className="shrink-0 mt-0.5 text-secondary opacity-30">—</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-white/[0.01]">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 mb-6">NFC Card Only</p>
                <ul className="space-y-3">
                  {['Tap → static URL','One card, no fleet','No scheduling','Basic profile page','No analytics','No automation'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-secondary font-medium leading-snug">
                      <span className="shrink-0 mt-0.5 text-secondary opacity-30">—</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-orange-500/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6">SparkStation</p>
                <ul className="space-y-3">
                  {['Mission-based routing','Full hardware ecosystem','Time & day scheduling','Built-in lead capture','Source attribution + maps','Your domain, your brand'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-primary font-medium leading-snug">
                      <span className="shrink-0 mt-0.5 text-orange-500">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mission Selector (New High-Impact Solution Section) */}
            <div className="pt-32 space-y-16">
              <div className="max-w-3xl space-y-6">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Choose Your <br/>
                  <span className="text-orange-500 italic">Mission.</span>
                </h3>
                <p className="text-xl text-secondary font-medium leading-relaxed">
                  The possibilities aren't endless—they're specific. Pick a goal and see how SparkStation transforms your physical space into a digital powerhouse.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Mission List */}
                <div className="lg:col-span-5 space-y-4">
                  {solutions.map((solution) => (
                    <button 
                      key={solution.id}
                      onClick={() => setActiveSolution(solution)}
                      className={`w-full text-left p-8 rounded-[2rem] border transition-all duration-500 group ${
                        activeSolution?.id === solution.id 
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          activeSolution?.id === solution.id ? 'bg-orange-500 text-white' : 'bg-surface-alt text-secondary opacity-60 group-hover:text-primary group-hover:opacity-100'
                        }`}>
                          {React.cloneElement(ICON_MAP[solution.icon_name] || <Zap />, { size: 24 })}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                            activeSolution?.id === solution.id ? 'text-orange-500' : 'text-secondary opacity-40'
                          }`}>
                            {solution.category} Mission
                          </p>
                          <h4 className="text-xl font-black uppercase tracking-tight text-primary">{solution.title}</h4>
                          <p className="text-xs text-secondary opacity-60 font-medium leading-relaxed mt-2">{solution.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Visual Preview */}
                <div className="lg:col-span-7 sticky top-32">
                  <AnimatePresence mode="wait">
                    {activeSolution && (
                      <motion.div 
                        key={activeSolution.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: [1, 1.005, 1] 
                        }}
                        transition={{
                          scale: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative rounded-[3.5rem] overflow-hidden border border-white/10 glass shadow-2xl group"
                      >
                        <img 
                          src={activeSolution.mock_image_url} 
                          className="w-full aspect-[16/10] object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt={activeSolution.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-12 left-12 right-12 space-y-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={12} fill="currentColor" /> Business Impact
                          </div>
                          <h5 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            {activeSolution.impact_text}
                          </h5>
                          <div className="pt-4 flex gap-4">
                             <Link to="/dashboard" className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                                Deploy This Mission
                             </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* IDENTITY SECTION */}
      <section id="identity" className="py-32 px-6 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                <Sparkles size={12} fill="currentColor" /> Community Spotlight
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Your Digital <br/>
                <span className="text-orange-500 italic">Signature</span>
              </h2>
              <p className="text-xl text-secondary font-medium leading-relaxed max-w-xl">
                Identity is more than just a link. It's a living, breathing digital gateway that represents your craft in the physical world.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Smart Microsites", desc: "Instantly create a beautiful mobile-first hub for all your content." },
                { title: "Live Analytics", desc: "See where your taps are coming from with real-time heatmaps. (Pro plan)" },
                { title: "Dynamic Routing", desc: "Change your station's destination in seconds from anywhere." },
                { title: "Full Customization", desc: "Themes, fonts, and colors tailored to your personal brand." }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]" />
                    <h4 className="font-black text-sm uppercase tracking-widest">{item.title}</h4>
                  </div>
                  <p className="text-secondary opacity-60 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-secondary font-medium leading-relaxed max-w-xl border-l-2 border-orange-500/30 pl-6 italic">
              The window to the right displays <span className="text-primary font-bold italic underline decoration-orange-500/50 underline-offset-4">Live Profiles</span> from our community. Every artisan on SparkStation gets a professional identity that's as unique as their craft.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                Build Your Profile <ArrowRight size={16} />
              </Link>
              <Link 
                to="/identity"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all"
              >
                Explore Architecture <Layers size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-slate-900 rounded-[3.5rem] border border-white/10 p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 group/phone overflow-hidden">
              <div className="bg-slate-950 rounded-[3rem] overflow-hidden aspect-[9/19] relative border border-white/5">
                <AnimatePresence mode="wait">
                  <motion.iframe 
                    key={activeArtisanHandle}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    src={`/u/${activeArtisanHandle}`} 
                    className="w-full h-full border-none pointer-events-auto"
                    title="Live Community Showcase"
                    loading="lazy"
                  />
                </AnimatePresence>
                
                {/* Showcase Overlay */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] z-20 pointer-events-none">
                  Live Showcase
                </div>

                <div className="absolute inset-0 pointer-events-none" />
              </div>

              {/* Physical Detail: Home Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full" />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* MEET THE MAKERS TEASER */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Visual Hook */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl aspect-[16/10] lg:aspect-square">
                <img 
                  src="/sparkstation_founders.jpg" 
                  alt="John and Jessie - Founders of SparkStation"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center p-4 text-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20">
                <p className="text-white font-black text-[8px] uppercase tracking-widest leading-tight">
                  Built In Our <br/> Workshop
                </p>
              </div>
            </motion.div>

            {/* Narrative Hook */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-black uppercase tracking-widest">
                  The Maker's Forge
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  Built by <br/> <span className="text-orange-500">Artisans.</span>
                </h2>
                <p className="text-xl text-secondary font-medium leading-relaxed">
                  SparkStation didn't start in a boardroom. It started on a workbench at <span className="text-primary font-bold">Desserbugs's Corner LLC</span>. We built the tools we needed for our own craft, and now we're sharing them with you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/why-sparkstation"
                  className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  Our Vision <ArrowRight size={16} />
                </Link>
                <div className="flex items-center gap-4 px-6">
                  <div className="w-10 h-px bg-slate-800" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40 italic">Makers Helping Makers</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMUNITY SPOTLIGHT */}
      {spotlight && (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass p-12 md:p-24 rounded-[4rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles size={14} fill="currentColor" /> Artisan Spotlight
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Meet the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Collective</span>
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">{spotlight.title}</h3>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                      {spotlight.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/30">
                      <img src={spotlight.profiles?.logo_url} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white">{spotlight.profiles?.full_name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{spotlight.profiles?.showcase_bio || 'Featured Artisan'}</p>
                    </div>
                  </div>
                  <Link 
                    to="/showcase"
                    className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-white/5"
                  >
                    Explore The Showcase <Share2 size={16} />
                  </Link>
                </div>
                
                <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  <img src={spotlight.image_url} className="w-full h-full object-cover" alt={spotlight.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                      <MapPin size={12} className="text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">Verified Mission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GLOBAL PULSE PREVIEW */}
      <section className="py-32 px-6 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">Live Network Telemetry</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
              Global <br/> <span className="text-slate-600">Network Pulse</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              SparkStation is expanding. Watch as artisans across the globe wake up their physical identities and sync with the consciousness.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Active Hubs</p>
                <p className="text-4xl font-black text-white italic">{pulse.length}+</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Recent Taps</p>
                <p className="text-4xl font-black text-white italic">{(pulse.length * 3.5).toFixed(0)}+</p>
              </div>
            </div>
            <Link 
              to="/discovery"
              className="inline-flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs group pt-4"
            >
              View Global Network <Globe size={20} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 glass p-2 rounded-[3.5rem] border border-white/5">
              <div className="h-[400px] rounded-[3rem] overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all">
                <SparkMap taps={pulse} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Common <br /><span className="text-orange-500 italic">Questions</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg">Everything you need to know before your first tap.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(faqs.length > 0 ? faqs : [
              {
                question: "Does this work on iPhone and Android?",
                answer: "Yes. NFC works natively on iPhones from XS onward and all modern Android devices. Your audience taps — no app download, no QR code, no friction."
              },
              {
                question: "Can I change where my card points after I buy it?",
                answer: "That's the whole point. Log in from any device and update your station's destination in real-time. No reprogramming. No new hardware. Ever."
              },
              {
                question: "Do I need a subscription for my card to work?",
                answer: "No. The free plan includes 2 active stations and full dashboard access. Paid plans unlock more stations, analytics, scheduling, and custom domains."
              },
              {
                question: "Does the hardware need charging or a battery?",
                answer: "Never. NFC is completely passive — it draws power from the phone tapping it. No charging, no batteries, no maintenance."
              },
              {
                question: "How many stations can I manage?",
                answer: "Free: 2 stations. Automate ($9/mo): 25 stations. Pro ($19/mo): 100 stations. Enterprise: unlimited. Upgrade or downgrade any time."
              },
              {
                question: "What if I want to completely change my profile later?",
                answer: "Change everything from your dashboard — destination URL, microsite template, branding, social links — all instantly. Your physical card never needs to be touched again."
              }
            ]).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 font-black text-sm mt-0.5 shrink-0">Q.</span>
                  <h4 className="font-black text-sm uppercase tracking-tight leading-snug">{item.question}</h4>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-black text-sm mt-0.5 shrink-0">A.</span>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 text-sm font-medium mb-6">Still have questions?</p>
            <a
              href="mailto:support@sparkstation.link"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-white/10 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Contact Support <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
