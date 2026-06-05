import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Globe, MapPin, Share2, Phone, CheckCircle2 } from 'lucide-react';
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
    accent: 'text-orange-500'
  },
  minimal: {
    bg: 'bg-white',
    card: 'bg-slate-50 border-slate-100 text-slate-900',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
    accent: 'text-orange-600'
  },
  vibrant: {
    bg: 'bg-slate-950',
    card: 'bg-white/10 border-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/70',
    accent: 'text-white',
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

const AVATAR_RADIUS_MAP = {
  sharp: 'rounded-none',
  industrial: 'rounded-xl',
  rounded: 'rounded-3xl',
  pill: 'rounded-full'
};

export default function Connect({ profile, content }) {
  const socialLinks = profile.social_links || [];
  const primaryColor = content.primary_color || '#f97316';
  const secondaryColor = content.secondary_color || '#000000';
  const fontFamily = content.font_family || 'Outfit';
  const theme = THEME_CONFIG[content.theme_style || 'glass'];
  const textureClass = SUPPORTED_TEXTURES[content.texture || 'none'];
  const blurValue = content.glass_blur !== undefined ? content.glass_blur : 20;
  const radiusClass = RADIUS_MAP[content.border_radius || 'rounded'];
  const avatarRadiusClass = AVATAR_RADIUS_MAP[content.border_radius || 'rounded'];
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

  const handleSaveContact = () => {
    const profileUrl = `${window.location.origin}/p/${profile.id}`;
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:4.0',
      'KIND:individual',
      `FN:${profile.full_name}`,
      `N:${profile.full_name.split(' ').reverse().join(';')};;;`,
      `TITLE:${content.title || ''}`,
      `ORG:${content.vcf_company || ''}`,
      `TEL;TYPE=CELL,TEXT,VOICE;VALUE=uri:tel:${content.vcf_phone || ''}`,
      `EMAIL;TYPE=WORK;VALUE=uri:mailto:${content.vcf_email || ''}`,
      `URL;TYPE=WORK:${profileUrl}`,
      `NOTE:Digital Identity powered by SparkStation.\nView full profile: ${profileUrl}\n\n${profile.bio || ''}`,
      'REV:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.full_name.replace(/\s+/g, '_')}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          source: 'ConnectTemplate'
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
      className={`min-h-screen ${theme.bg} flex flex-col items-center transition-all duration-700 relative overflow-hidden`}
      style={{ fontFamily }}
    >
      <Helmet>
        <title>{content.seo_title || `${profile.full_name} | SparkStation`}</title>
        <meta name="description" content={content.seo_description || profile.bio || "View my professional digital identity on SparkStation."} />
        {content.seo_keywords && <meta name="keywords" content={content.seo_keywords} />}
        {profile.username && <link rel="canonical" href={`https://tap.sparkstation.link/u/${profile.username}`} />}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={content.seo_title || `${profile.full_name} | SparkStation`} />
        <meta property="og:description" content={content.seo_description || profile.bio || "View my professional digital identity on SparkStation."} />
        <meta property="og:image" content={profile.logo_url || 'https://tap.sparkstation.link/spark_card_home.png'} />
        {profile.username && <meta property="og:url" content={`https://tap.sparkstation.link/u/${profile.username}`} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={content.seo_title || `${profile.full_name} | SparkStation`} />
        <meta name="twitter:description" content={content.seo_description || profile.bio || "View my professional digital identity on SparkStation."} />
        <meta name="twitter:image" content={profile.logo_url || 'https://sparkstation.link/spark_card_home.png'} />
      </Helmet>
      {/* Background Texture Overlay */}
      {textureClass && (
        <div className={`absolute inset-0 z-[1] pointer-events-none ${textureClass}`} />
      )}

      {/* Vibrant Mesh Background */}
      {theme.isVibrant && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-40 animate-pulse"
            style={{ background: primaryColor }}
          />
          <div 
            className="absolute top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-30"
            style={{ background: secondaryColor }}
          />
          <div 
            className="absolute -bottom-[10%] left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
            style={{ background: primaryColor }}
          />
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center">

      {/* Header */}
      <div 
        className="w-full h-48 relative"
        style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: `radial-gradient(circle at 20% 30%, white 0%, transparent 70%)` }} 
        />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-32 h-32 ${avatarRadiusClass} bg-white p-1 shadow-2xl overflow-hidden ring-4 ring-black/5`}
          >
            <img 
              src={profile.logo_url} 
              className={`w-full h-full object-cover ${avatarRadiusClass}`} 
              alt={profile.full_name} 
            />
          </motion.div>
        </div>
      </div>

      {/* Info Block */}
      <div className="mt-20 px-6 text-center max-w-md w-full">
        <h1 className={`text-2xl font-black ${theme.text} tracking-tight`}>{profile.full_name}</h1>
        <div className="mt-1 flex flex-col items-center">
           <p className={`${theme.subtext} font-bold text-xs uppercase tracking-widest`}>{content.title || 'Networking Expert'}</p>
           {content.vcf_company && (
             <p className={`${theme.subtext} opacity-70 font-bold text-[10px] uppercase tracking-[0.2em] mt-1`}>{content.vcf_company}</p>
           )}
        </div>
        
        <p className={`mt-6 ${theme.subtext} text-sm leading-relaxed font-medium`}>
          {profile.bio || "Connecting through SparkStation."}
        </p>

        {/* Quick Contact Info */}
        {(content.vcf_phone || content.vcf_email) && (
          <div className="mt-8 flex flex-col gap-2">
            {content.vcf_phone && (
              <div 
                className={`flex items-center gap-3 px-4 py-3 ${theme.card} ${radiusClass} border shadow-sm`}
                style={{ backdropFilter: `blur(${blurValue}px)` }}
              >
                <Phone size={14} style={{ color: primaryColor }} />
                <span className="text-[11px] font-bold">{content.vcf_phone}</span>
              </div>
            )}
            {content.vcf_email && (
              <div 
                className={`flex items-center gap-3 px-4 py-3 ${theme.card} ${radiusClass} border shadow-sm`}
                style={{ backdropFilter: `blur(${blurValue}px)` }}
              >
                <Mail size={14} style={{ color: primaryColor }} />
                <span className="text-[11px] font-bold truncate">{content.vcf_email}</span>
              </div>
            )}
          </div>
        )}

        {content.vcf_enabled && (
          <button 
            onClick={handleSaveContact}
            style={{ backgroundColor: primaryColor }}
            className={`mt-8 w-full text-white py-4 ${radiusClass} font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all`}
          >
            <UserPlus className="w-5 h-5" />
            Add to Contacts
          </button>
        )}

        {/* Lead Generation Form */}
        {content.lead_enabled && (
          <div 
            className={`mt-12 p-8 ${radiusClass} border ${theme.card} text-left`}
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
        <div className="mt-10 grid grid-cols-2 gap-3 mb-12">
          {socialLinks.map((link, idx) => (
            <motion.a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={animStyle === 'stagger' ? { opacity: 0, y: 20 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: animStyle === 'stagger' ? (idx * 0.1 * (1 - motionIntensity)) : 0, 
                duration: 0.5 * (1 - motionIntensity) 
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`${theme.card} border p-5 ${radiusClass} flex flex-col items-center gap-3 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
              style={{ backdropFilter: `blur(${blurValue}px)` }}
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors relative z-10">
                <SocialIcon platform={link.platform} style={{ color: primaryColor }} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.subtext} relative z-10`}>{link.platform}</span>
              
              {/* Subtle Animated Glow Pulse */}
              <motion.div 
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${primaryColor}, transparent 70%)` }}
              />
            </motion.a>
          ))}
        </div>
        </div>
      </div>

      {(profile?.subscription_tier !== 'pro' && profile?.subscription_tier !== 'enterprise') && (
        <footer className="mt-auto pb-8 relative z-10 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          Powered by SparkStation
        </footer>
      )}
    </div>
  );
}
