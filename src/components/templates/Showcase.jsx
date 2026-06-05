import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Star, Heart, Sparkles, Share2, CheckCircle2, Mail, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { sb } from '../../lib/supabase';
import SocialIcon from '../SocialIcon';

const THEME_CONFIG = {
  glass: {
    bg: 'bg-slate-950',
    card: 'bg-white/5 border-white/10 text-white',
    text: 'text-white',
    subtext: 'text-slate-400',
    accent: 'text-orange-500',
    meshOpacity: 'opacity-30'
  },
  minimal: {
    bg: 'bg-white',
    card: 'bg-slate-50 border-slate-100 text-slate-900',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
    accent: 'text-orange-600',
    meshOpacity: 'opacity-10'
  },
  vibrant: {
    bg: 'bg-slate-950',
    card: 'bg-white/10 border-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/70',
    accent: 'text-white',
    meshOpacity: 'opacity-50',
    isVibrant: true
  }
};

const SUPPORTED_TEXTURES = {
  none: '',
  noise: 'industrial-noise',
  grid: 'tactical-grid',
  dots: 'dots-pattern'
};

const RADIUS_MAP = {
  sharp: 'rounded-none',
  industrial: 'rounded-lg',
  rounded: 'rounded-[2.5rem]',
  pill: 'rounded-full'
};

export default function Showcase({ profile, content }) {
  const heroImages = content.hero_images || [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
  ];
  const primaryColor = content.primary_color || '#f97316';
  const secondaryColor = content.secondary_color || '#000000';
  const fontFamily = content.font_family || 'Outfit';
  const theme = THEME_CONFIG[content.theme_style || 'glass'];
  const textureClass = SUPPORTED_TEXTURES[content.texture || 'none'];
  const blurValue = content.glass_blur !== undefined ? content.glass_blur : 20;
  const radiusClass = RADIUS_MAP[content.border_radius || 'rounded'];
  const motionIntensity = content.motion_intensity !== undefined ? content.motion_intensity : 0.5;
  const animStyle = content.animation_style || 'stagger';

  const [leadData, setLeadData] = useState({ name: '', email: '', message: '' });
  const [leadStatus, setLeadStatus] = useState('idle'); // idle, sending, success

  // Update SEO Page Title
  useEffect(() => {
    if (content.seo_title) {
       document.title = content.seo_title;
    }
  }, [content.seo_title]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadStatus('sending');
    
    try {
      const { error } = await sb.from('leads').insert({
        profile_id: profile.id,
        name: leadData.name,
        email: leadData.email,
        message: leadData.message,
        metadata: {
          ua: navigator.userAgent,
          source: 'ShowcaseTemplate'
        }
      });

      if (error) throw error;
      setLeadStatus('success');
      setLeadData({ name: '', email: '', message: '' });
      setTimeout(() => setLeadStatus('idle'), 5000);
    } catch (err) {
      console.error('Lead failed:', err);
      setLeadStatus('idle');
    }
  };

  return (
    <div 
      className={`min-h-screen ${theme.bg} relative overflow-x-hidden transition-all duration-500`}
      style={{ fontFamily }}
    >
      <Helmet>
        <title>{content.seo_title || `${profile.full_name} | Showcase`}</title>
        <meta name="description" content={content.seo_description || profile.bio || "View my curated collection on SparkStation."} />
        {content.seo_keywords && <meta name="keywords" content={content.seo_keywords} />}
        {profile.username && <link rel="canonical" href={`https://tap.sparkstation.link/u/${profile.username}`} />}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={content.seo_title || `${profile.full_name} | Showcase`} />
        <meta property="og:description" content={content.seo_description || profile.bio || "View my curated collection on SparkStation."} />
        <meta property="og:image" content={profile.logo_url || 'https://tap.sparkstation.link/spark_card_home.png'} />
        {profile.username && <meta property="og:url" content={`https://tap.sparkstation.link/u/${profile.username}`} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={content.seo_title || `${profile.full_name} | Showcase`} />
        <meta name="twitter:description" content={content.seo_description || profile.bio || "View my curated collection on SparkStation."} />
        <meta name="twitter:image" content={profile.logo_url || 'https://sparkstation.link/spark_card_home.png'} />
      </Helmet>
      {/* Background Texture Overlay */}
      {textureClass && (
        <div className={`absolute inset-0 z-[1] pointer-events-none ${textureClass}`} />
      )}

      {/* Mesh Gradient Banner */}
      <div className="relative w-full h-[25vh] overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
        <div className={`absolute inset-0 ${theme.meshOpacity}`} 
          style={{ 
            backgroundImage: `radial-gradient(circle at 20% 30%, white 0%, transparent 70%), 
                             radial-gradient(circle at 80% 70%, ${secondaryColor} 0%, transparent 70%)` 
          }} 
        />
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
      </div>

      <div className="px-8 -mt-20 pb-56 relative z-10">
        {/* Floating Brand Seal */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`w-40 h-40 ${theme.card} ${radiusClass} p-2 shadow-2xl mb-8 relative z-20 border-2`}
          style={{ backdropFilter: `blur(${blurValue}px)` }}
        >
          <div className={`w-full h-full ${radiusClass} overflow-hidden bg-black/10 flex items-center justify-center p-4`}>
            <img 
              src={profile.logo_url} 
              className="max-w-full max-h-full object-contain"
              alt="Logo"
            />
          </div>
          <div className={`absolute -right-2 -bottom-2 w-10 h-10 ${theme.card} rounded-full flex items-center justify-center shadow-lg border`}>
             <Sparkles size={20} style={{ color: primaryColor }} />
          </div>
        </motion.div>

        <header className="mb-12">
          <h1 className={`text-5xl font-black ${theme.text} tracking-tighter leading-[0.8] mb-4`}>{profile.full_name}</h1>
          <p 
            className="text-[10px] font-black uppercase tracking-[0.3em]"
            style={{ color: primaryColor }}
          >
            {content.subtitle || "The Showcase Collection"}
          </p>
        </header>
        
        {/* Story Section */}
        <div className="flex items-center gap-4 mb-8">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.card}`} style={{ backdropFilter: `blur(${blurValue}px)` }}>
              <Star className="w-6 h-6" style={{ color: primaryColor, fill: primaryColor }} />
           </div>
           <div>
             <h2 className={`font-black ${theme.text} text-lg`}>Our Story</h2>
             <p className={`${theme.subtext} text-[10px] font-bold uppercase tracking-widest`}>The Spark behind the craft</p>
           </div>
        </div>

        <div className="max-w-none mb-16">
          <p className={`${theme.subtext} leading-relaxed font-medium italic`}>
            "{content.story || "Hand-crafted with passion and precision."}"
          </p>
        </div>

        {/* Gallery Section */}
        {heroImages.length > 0 && (
          <div className="mb-16 -mx-8">
             <div className="px-8 mb-4 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Works</p>
                <div className="flex gap-1">
                   <div className="w-1 h-1 rounded-full bg-orange-500" />
                   <div className="w-1 h-1 rounded-full bg-orange-500/30" />
                   <div className="w-1 h-1 rounded-full bg-orange-500/10" />
                </div>
             </div>
             <div className="flex overflow-x-auto gap-4 px-8 no-scrollbar snap-x pb-4">
                {heroImages.map((img, idx) => (
                   <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={`flex-shrink-0 w-64 aspect-[4/5] ${radiusClass} overflow-hidden bg-slate-900 border border-white/5 snap-center shadow-2xl`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                  </motion.div>
                ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-16">
          {content.why_us && content.why_us.length > 0 ? (
            content.why_us.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-4 ${theme.card} p-6 ${radiusClass} border`}
                style={{ backdropFilter: `blur(${blurValue}px)` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                   <Sparkles size={24} />
                </div>
                <div>
                   <h4 className={`${theme.text} text-sm font-black uppercase tracking-tight mb-1`}>{item.title}</h4>
                   <p className={`${theme.subtext} text-xs leading-relaxed`}>{item.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`text-center py-8 ${theme.subtext} text-[10px] font-black uppercase tracking-widest border-2 border-dashed ${radiusClass} border-white/10`}>
               No Value Propositions Added
            </div>
          )}
        </div>

        {/* Lead Generation Form */}
        {content.lead_enabled && (
          <div 
            className={`mt-12 p-8 ${radiusClass} border ${theme.card} text-left mb-16`}
            style={{ backdropFilter: `blur(${blurValue}px)` }}
          >
             <h3 className="text-sm font-black uppercase tracking-widest mb-6">{content.lead_title}</h3>
             
             {leadStatus === 'success' ? (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Message Captured</p>
               </motion.div>
             ) : (
               <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name" 
                    value={leadData.name}
                    onChange={e => setLeadData({...leadData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white/30 transition-all" 
                  />
                  <input 
                    required
                    type="email" 
                    placeholder="Email Address" 
                    value={leadData.email}
                    onChange={e => setLeadData({...leadData, email: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white/30 transition-all" 
                  />
                  <textarea 
                    required
                    placeholder="Your Message" 
                    rows={3}
                    value={leadData.message}
                    onChange={e => setLeadData({...leadData, message: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white/30 transition-all resize-none" 
                  />
                  <button 
                    disabled={leadStatus === 'sending'}
                    type="submit"
                    style={{ backgroundColor: primaryColor }}
                    className="w-full py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
                  >
                    {leadStatus === 'sending' ? 'Sending...' : content.lead_button}
                  </button>
               </form>
             )}
          </div>
        )}

        {/* Social Links section */}
        {profile.social_links && profile.social_links.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {profile.social_links.map((link, idx) => (
                <motion.a 
                  key={idx} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={animStyle === 'stagger' ? { opacity: 0, scale: 0.95 } : { opacity: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: animStyle === 'stagger' ? (idx * 0.1 * (1 - motionIntensity)) : 0, 
                    duration: 0.4 * (1 - motionIntensity) 
                  }}
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    backdropFilter: `blur(${blurValue}px)`
                  }}
                  className={`${theme.card} px-6 py-4 ${radiusClass} font-black text-[10px] uppercase tracking-widest flex items-center gap-3 border border-white/5 hover:scale-105 transition-all group relative overflow-hidden`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <SocialIcon platform={link.platform} size={14} style={{ color: primaryColor }} />
                    <span className={theme.text}>{link.platform}</span>
                  </div>

                  {/* Subtle Glow */}
                  <motion.div 
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: idx * 0.8 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${primaryColor}, transparent 80%)` }}
                  />
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vibrant Mesh Background */}
      {theme.isVibrant && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-[20%] -left-[10%] w-[100%] h-[100%] rounded-full blur-[150px] opacity-20"
            style={{ background: primaryColor }}
          />
          <div 
            className="absolute bottom-[10%] -right-[10%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-15"
            style={{ background: secondaryColor }}
          />
        </div>
      )}

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-8 px-6 z-50 mt-12">
         <a 
          href={content.cta_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: primaryColor }}
          className="w-full text-white py-5 rounded-3xl font-black flex items-center justify-center gap-4 shadow-xl hover:brightness-110 active:scale-95 transition-all group"
         >
           {content.cta_label || 'Visit Shop'}
           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </a>
      </div>
    </div>
  );
}
