import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Map as MapIcon, Users, Zap, ShieldCheck, Search, Heart, Share2, ExternalLink, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import SparkMap from './SparkMap';
import { sb } from '../lib/supabase';
import { fetchGlobalPulse, fetchArtisans, fetchShowcase } from '../lib/community';

export default function Community() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [pulse, setPulse] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Apply Modal State
  const [session, setSession] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [applyForm, setApplyForm] = useState({ title: '', description: '' });
  const [joinForm, setJoinForm] = useState({ bio: '' });
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => setSession(session));
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [pulseData, artisanData, showcaseData] = await Promise.all([
        fetchGlobalPulse(),
        fetchArtisans(),
        fetchShowcase()
      ]);
      setPulse(pulseData || []);
      setArtisans(artisanData || []);
      setShowcaseItems(showcaseData || []);
    } catch (err) {
      console.error('Error loading community data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
      setUserProfile(profile);
      setApplyForm({
        title: profile?.business_name || profile?.full_name || '',
        description: profile?.showcase_bio || profile?.bio || ''
      });
      setIsApplyModalOpen(true);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await sb.from('community_showcase').insert([{
        profile_id: session.user.id,
        title: applyForm.title,
        description: applyForm.description,
        image_url: userProfile?.logo_url,
        mission_url: `https://tap.sparkstation.link/u/${userProfile?.username || userProfile?.id}`,
        status: 'pending'
      }]);

      if (error) throw error;
      setSubmissionSuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSubmissionSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Showcase Submission Error:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinClick = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
      setUserProfile(profile);
      setJoinForm({ bio: profile?.showcase_bio || profile?.bio || '' });
      setIsJoinModalOpen(true);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await sb.from('profiles').update({
        is_public: true,
        showcase_bio: joinForm.bio
      }).eq('id', session.user.id);

      if (error) throw error;
      setSubmissionSuccess(true);
      
      // Refresh directory
      loadCommunityData();
      
      setTimeout(() => {
        setIsJoinModalOpen(false);
        setSubmissionSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Join Directory Error:', err);
      alert('Failed to join directory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredShowcase = showcaseItems.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.profiles?.full_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-orange-500/30">
      {/* HERO SECTION */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">The Consciousness</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] pb-2">
              Spark <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 pr-8">Community</span>
            </h1>
            <p className="text-xl text-secondary font-medium max-w-2xl leading-relaxed">
              Explore the global network of artisans, discover live interaction telemetry, and browse the curated gallery of physical-digital missions.
            </p>
          </div>

          <div className="flex p-1.5 bg-surface-alt rounded-3xl border border-border-subtle shrink-0">
             <button 
               onClick={() => setActiveTab('discovery')}
               className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'discovery' ? 'bg-orange-500 text-white shadow-lg' : 'text-secondary hover:text-primary'}`}
             >
                Network Map
             </button>
             <button 
               onClick={() => setActiveTab('showcase')}
               className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'showcase' ? 'bg-orange-500 text-white shadow-lg' : 'text-secondary hover:text-primary'}`}
             >
                Artisan Gallery
             </button>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === 'discovery' ? (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-32 pb-32"
          >
            {/* Map Section */}
            <section className="px-6">
              <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3.5rem] overflow-hidden border border-border-subtle bg-surface-alt">
                  <SparkMap taps={pulse} />
                  
                  {/* Map Overlay Stats */}
                  <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                     <div className="glass px-6 py-4 rounded-2xl border border-border-subtle flex items-center gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-xl">
                          <Zap size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Global Active Hubs</p>
                          <p className="text-2xl font-black text-primary italic">{pulse.length}+</p>
                        </div>
                     </div>
                  </div>

                  {/* Radar Scan Animation */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-10 pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  />
                </div>
              </div>
            </section>

            {/* Artisan Directory Section */}
            <section className="px-6 py-20 bg-surface-alt border-y border-border-subtle">
              <div className="max-w-7xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none pb-1 text-primary">Artisan <span className="text-secondary">Directory</span></h2>
                    <p className="text-xl text-secondary font-medium leading-relaxed max-w-xl">
                      Discover creators, shops, and makers who have opened their doors to the network.
                    </p>
                  </div>
                  <button 
                    onClick={handleJoinClick}
                    className="px-10 py-5 bg-surface border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 text-primary"
                  >
                    <Users size={18} /> Join Directory
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-64 bg-surface animate-pulse rounded-[2.5rem] border border-border-subtle" />)
                  ) : (
                    artisans.map((artisan, idx) => (
                      <motion.div
                        key={artisan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-10 glass rounded-[3rem] border border-border-subtle flex flex-col items-center text-center space-y-6 hover:border-orange-500/30 transition-all group shadow-2xl"
                      >
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-subtle group-hover:border-orange-500 transition-all p-1">
                            <img src={artisan.logo_url} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-4 border-surface flex items-center justify-center">
                             <Zap size={10} fill="white" className="text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-black uppercase tracking-tight text-primary">{artisan.full_name}</h3>
                          <p className="text-[10px] font-black text-secondary uppercase tracking-widest line-clamp-2 min-h-[3.5em] leading-relaxed">
                            {artisan.showcase_bio || 'Artisan Fleet Member'}
                          </p>
                        </div>
                        <a 
                          href={`/p/${artisan.username || artisan.id}`} 
                          className="w-full py-4 bg-surface hover:bg-orange-500 text-secondary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-border-subtle"
                        >
                          View Profile
                        </a>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="showcase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-32"
          >
            {/* Search Tools */}
            <section className="sticky top-24 z-30 px-6 py-8 bg-surface/80 backdrop-blur-md border-y border-border-subtle mb-16">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="relative w-full md:w-[450px] group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search Artisans or Projects..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-card border border-border-subtle rounded-2xl pl-16 pr-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-orange-500/50 transition-all text-primary"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="px-10 py-5 bg-card border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all text-primary">Latest</button>
                  <button className="px-10 py-5 bg-card border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all text-primary">Trending</button>
                </div>
              </div>
            </section>

            {/* Gallery Grid */}
            <section className="px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {loading ? (
                    [1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/5] bg-card animate-pulse rounded-[3.5rem] border border-border-subtle" />)
                  ) : (
                    filteredShowcase.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -15 }}
                        className="group relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-border-subtle shadow-2xl"
                      >
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                        <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-xl">
                              <img src={item.profiles?.logo_url} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-500 drop-shadow-md">
                              {item.profiles?.full_name}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-primary drop-shadow-md leading-[0.9]">
                              {item.title}
                            </h3>
                            <p className="text-xs font-medium text-secondary line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <div className="flex gap-6">
                              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-orange-500 transition-colors">
                                <Heart size={16} /> {item.likes_count}
                              </button>
                              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-orange-500 transition-colors">
                                <Share2 size={16} /> Share
                              </button>
                            </div>
                            {item.mission_url && (
                              <a 
                                href={item.mission_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all group/btn"
                              >
                                <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL FOOTER CTA */}
      <section className="px-6 py-40 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-16">
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] pb-4">
              Join the <br/> <span className="inline-block text-orange-500 pr-8 italic">Collective</span>
           </h2>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                to="/shop"
                className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] bg-orange-500 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[0_0_80px_rgba(249,115,22,0.4)]"
              >
                 Get Your Station
              </Link>
              <button 
                onClick={handleApplyClick}
                className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] bg-orange-500 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[0_0_80px_rgba(249,115,22,0.4)]"
              >
                 Apply to Showcase
              </button>
           </div>
        </div>
      </section>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-surface/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[3.5rem] border border-white/10 p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />
              
              {submissionSuccess ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Application Sent!</h2>
                  <p className="text-secondary opacity-60 font-bold uppercase tracking-widest text-[10px]">Our curators will review your mission and notify you via email shortly.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[8px] font-black uppercase tracking-[0.2em]">
                      <Sparkles size={12} /> Curated Entry
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Join the <br/> <span className="text-orange-500">Collective</span></h2>
                    <p className="text-secondary opacity-60 font-bold uppercase tracking-widest text-[10px]">Apply to feature your mission in our global community gallery.</p>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Showcase Title</label>
                       <input 
                         required
                         type="text"
                         value={applyForm.title}
                         onChange={(e) => setApplyForm({...applyForm, title: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-orange-500 transition-all text-white"
                         placeholder="Your Store or Project Name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Curator Description</label>
                       <textarea 
                         required
                         value={applyForm.description}
                         onChange={(e) => setApplyForm({...applyForm, description: e.target.value})}
                         rows={4}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-orange-500 transition-all text-white resize-none"
                         placeholder="Tell the community what makes this mission unique..."
                       />
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6">
                       <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 p-1">
                          <img src={userProfile?.logo_url} className="w-full h-full object-cover rounded-full" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Profile</p>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">{userProfile?.business_name || userProfile?.full_name}</p>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-5 bg-orange-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                         {isSubmitting ? 'Submitting...' : 'Submit Application'} <ArrowRight size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                      >
                         Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOIN DIRECTORY MODAL */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass rounded-[3.5rem] border border-white/10 p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
              
              {submissionSuccess ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">You're on the Map!</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your profile is now public in the Artisan Directory.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[8px] font-black uppercase tracking-[0.2em]">
                      <Globe size={12} /> Global Directory
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">Public <br/> <span className="text-blue-500">Presence</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Enable your profile visibility on the global network map.</p>
                  </div>

                  <form onSubmit={handleJoinConfirm} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Directory Bio</label>
                       <textarea 
                         required
                         value={joinForm.bio}
                         onChange={(e) => setJoinForm({...joinForm, bio: e.target.value})}
                         rows={4}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-white resize-none"
                         placeholder="A short sentence about what you create..."
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.3)]"
                      >
                         {isSubmitting ? 'Joining...' : 'Publish Profile'} <ArrowRight size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsJoinModalOpen(false)}
                        className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                      >
                         Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
