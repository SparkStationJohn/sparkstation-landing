import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, ExternalLink, User, Search, Sparkles } from 'lucide-react';
import { fetchShowcase } from '../lib/community';

export default function Showcase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadShowcase();
  }, []);

  const loadShowcase = async () => {
    setLoading(true);
    const data = await fetchShowcase();
    setItems(data);
    setLoading(false);
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.profiles?.full_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface text-primary">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Artisan Showcase</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] pb-2"
          >
            The Collective <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 pr-8">Consciousness</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-secondary font-bold uppercase tracking-widest text-[10px] leading-relaxed"
          >
            A curated gallery of the world's most innovative SparkStation missions. 
            From interactive retail to digital artifacts.
          </motion.p>
        </div>
      </section>

      {/* Discovery Tools */}
      <section className="sticky top-24 z-30 px-6 py-4 bg-slate-950/80 backdrop-blur-md border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Artisans or Projects..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Latest</button>
            <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Trending</button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10 }}
                    className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 glass"
                  >
                    {/* Background Image */}
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/50 shadow-lg shadow-amber-500/20">
                            <img src={item.profiles?.logo_url} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 drop-shadow-md">
                            {item.profiles?.full_name}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-md leading-none">
                          {item.title}
                        </h3>
                        
                        <p className="text-[10px] font-bold text-slate-300 line-clamp-2 uppercase tracking-wide md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </p>
                        
                        <div className="pt-2 flex items-center justify-between md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors">
                              <Heart size={14} className={item.likes_count > 0 ? 'text-amber-500' : ''} /> {item.likes_count}
                            </button>
                            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors">
                              <Share2 size={14} /> Share
                            </button>
                          </div>
                          {item.mission_url && (
                            <a 
                              href={item.mission_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 transition-all"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-40">
              <User size={64} className="text-slate-900 mx-auto mb-6" />
              <h2 className="text-2xl font-black uppercase text-slate-800">No artisans found</h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] border border-white/5 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight pb-2">Ready to join <br /> <span className="inline-block text-amber-500 pr-4">The Consciousness?</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-lg mx-auto">
            Get your SparkStation online, build your mission, and apply for the collective gallery.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-white/5">
              Get Your Station
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
              Apply to Showcase
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
