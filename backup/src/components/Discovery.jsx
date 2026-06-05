import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Map as MapIcon, Users, Zap, ShieldCheck } from 'lucide-react';
import SparkMap from './SparkMap';
import { fetchGlobalPulse, fetchArtisans } from '../lib/community';

export default function Discovery() {
  const [pulse, setPulse] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscovery();
  }, []);

  const loadDiscovery = async () => {
    setLoading(true);
    const [pulseData, artisanData] = await Promise.all([
      fetchGlobalPulse(),
      fetchArtisans()
    ]);
    setPulse(pulseData);
    setArtisans(artisanData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">Live Network Pulse</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] pb-2">
              Spark <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 pr-8">Discovery</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-lg">
              Mapping the expansion of the artisan intelligence fleet. Anonymized telemetry from active SparkStation nodes worldwide.
            </p>
          </div>
          <div className="flex gap-8 pb-2">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Nodes</p>
              <p className="text-3xl font-black text-white italic">{pulse.length}+</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Reach</p>
              <p className="text-3xl font-black text-white italic">{[...new Set(pulse.map(p => p.country))].length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <SparkMap taps={pulse} />

            {/* Radar Scan Animation */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-10 pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            />
            
            {/* Map Overlay Stats */}
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 flex flex-col gap-3">
               <div className="glass px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4">
                  <div className="p-1.5 md:p-2 bg-amber-500/20 rounded-lg">
                    <Zap size={12} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Activity</p>
                    <p className="text-[10px] md:text-xs font-black text-white uppercase italic">Monitoring Pulse...</p>
                  </div>
               </div>
            </div>

            <div className="absolute top-8 right-8 z-20 flex flex-col gap-2">
               <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Anonymized Data Protection Active</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Artisan Directory Section */}
      <section className="px-6 py-20 bg-slate-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none pb-1">Artisan <span className="text-slate-600">Directory</span></h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-lg">
                Discover creators, shops, and makers who have opened their doors to the network.
              </p>
            </div>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Users size={14} /> Join Directory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl" />)
            ) : (
              artisans.map((artisan, idx) => (
                <motion.div
                  key={artisan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 glass rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-4 hover:border-amber-500/30 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-amber-500 transition-all p-1">
                    <img src={artisan.logo_url} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white mb-1">{artisan.full_name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest line-clamp-2 min-h-[3.5em]">
                      {artisan.showcase_bio || 'Artisan Fleet Member'}
                    </p>
                  </div>
                  <a 
                    href={`/p/${artisan.username || artisan.id}`} 
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    View Profile
                  </a>
                </motion.div>
              ))
            )}
            {!loading && artisans.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No artisans have opted into public discovery yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer-ish Info */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Globe size={32} className="text-slate-800 mx-auto" />
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-600">Proof of Concept</h3>
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] leading-relaxed">
            The Spark Discovery Map utilizes real-time tap telemetry to visualize the artisan consciousness. Location data is approximate and anonymized to protect artisan privacy.
          </p>
        </div>
      </section>
    </div>
  );
}
