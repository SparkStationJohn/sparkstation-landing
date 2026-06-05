import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Mail, Phone, ExternalLink, ArrowRight, Zap 
} from 'lucide-react';

const ICON_MAP = {
  instagram: <ExternalLink size={24} />,
  twitter: <ExternalLink size={24} />,
  linkedin: <ExternalLink size={24} />,
  github: <ExternalLink size={24} />,
  youtube: <ExternalLink size={24} />,
  website: <Globe size={24} />,
  email: <Mail size={24} />,
  phone: <Phone size={24} />,
  facebook: <Globe size={24} />, 
  tiktok: <Zap size={24} />, 
  whatsapp: <Globe size={24} />
};

export default function ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await sb
        .from('profiles')
        .select('business_name, bio, logo_url, social_links')
        .eq('id', userId)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 bg-orange-500 rounded-full blur-xl"
        />
      </div>
    );
  }

  if (!profile || (!profile.business_name && (profile.social_links || []).length === 0)) {
    return (
      <div className="min-h-screen bg-surface text-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 blur-[120px] rounded-full translate-y-1/2"></div>
        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 border border-orange-500/20">
          <Zap className="text-orange-500 w-10 h-10 fill-current" />
        </div>
        <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">Setting Up...</h1>
        <p className="text-slate-500 text-sm mb-12 max-w-xs leading-relaxed font-medium">
          A SparkStation owner is currently personalizing this experience. Check back in a few minutes!
        </p>
        <Link to="/" className="group flex items-center gap-3 text-orange-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
          Learn about SparkStation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-primary flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-orange-500/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <header className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full scale-110"></div>
            {profile.logo_url ? (
              <img 
                src={profile.logo_url} 
                alt={profile.business_name} 
                className="relative w-28 h-28 rounded-[2.5rem] border-2 border-white/20 object-cover shadow-2xl"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-[2.5rem] border-2 border-white/20 bg-slate-900 flex items-center justify-center text-3xl font-black text-orange-500 shadow-2xl">
                {profile.business_name?.charAt(0) || 'S'}
              </div>
            )}
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight uppercase text-center mb-3">
            {profile.business_name}
          </h1>
          <div className="h-1 w-12 bg-orange-500 rounded-full mb-4"></div>
          <p className="text-secondary text-center text-sm font-medium leading-relaxed max-w-[90%]">
            {profile.bio || 'Welcome to our digital station.'}
          </p>
        </header>

        <div className="flex flex-col gap-4 mb-24">
          <AnimatePresence>
            {(profile.social_links || []).map((link, idx) => (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-card p-4 rounded-[1.5rem] border border-white/10 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all shadow-inner">
                    {ICON_MAP[link.type.toLowerCase()] || <ExternalLink size={20} />}
                  </div>
                  <div>
                    <span className="block font-black uppercase text-[10px] tracking-widest text-slate-200">{link.label || link.type}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Click to Visit</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                  <ArrowRight size={14} className="text-slate-700 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

        <footer className="flex flex-col items-center gap-4 py-8">
          <div className="h-px w-12 bg-white/5"></div>
          <Link to="/" className="flex flex-col items-center gap-2 group">
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 group-hover:text-orange-500 transition-colors">Experience SparkStation</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] group-hover:border-orange-500/30 transition-all">
               <Zap size={10} className="text-orange-500 fill-current" />
               <span className="text-[10px] font-black tracking-tighter uppercase text-slate-400 group-hover:text-white transition-colors">Full-Stack Identity</span>
            </div>
          </Link>
        </footer>
      </motion.div>
    </div>
  );
}
