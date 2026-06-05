import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, AlertCircle, Cpu, Zap, 
  Search, Shield, Smartphone, ArrowRight, RefreshCw,
  Info, Lock, Target
} from 'lucide-react';
import { sb } from '../lib/supabase';

export default function ActivationModal({ isOpen, onClose, onSuccess, userId, fleetLimit, currentCount }) {
  const [step, setStep] = useState('initial');
  const [unitType, setUnitType] = useState(null); // 'official' | 'legacy'
  const [serial, setSerial] = useState('');
  const [suffix, setSuffix] = useState(''); // last 4 chars for official units
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('initial');
      setUnitType(null);
      setSerial('');
      setSuffix('');
      setNickname('');
      setError(null);
    }
  }, [isOpen]);

  const handleManualActivate = async (e) => {
    e.preventDefault();
    if (currentCount >= fleetLimit) {
      setError('FLEET CAPACITY REACHED. UPGRADE REQUIRED.');
      return;
    }

    const isOfficial = unitType === 'official';
    const finalSerial = isOfficial ? `SPARK-${suffix.toUpperCase()}` : serial.toUpperCase();

    if (isOfficial && suffix.length !== 4) {
      setError('ENTER THE 4-CHARACTER CODE FROM YOUR UNIT.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceType = isOfficial ? 'SparkStation' : 'SparkTag';

      // Perform Activation
      const { data, error: actError } = await sb
        .from('assets')
        .update({
          owner_id: userId,
          nickname: nickname || (isOfficial ? `SparkStation ${suffix.toUpperCase()}` : 'Legacy Unit'),
          status: 'active'
        })
        .eq('serial_number', finalSerial)
        .select()
        .single();

      if (actError) throw actError;

      // Initialize Default Redirect
      await sb.from('redirects').insert({
        asset_id: data.id,
        mode: 'profile',
        destination_url: '',
        config: { theme: 'artisan' }
      });

      setSerial(finalSerial);
      setStep('success');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'LINKING FAILED. VERIFY SERIAL.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" 
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
      >
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="p-12">
          <header className="flex justify-between items-start mb-12">
            <div>
               <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Station Activation</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Fleet Enrollment</p>
            </div>
            <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
              <X size={20} />
            </button>
          </header>

          <AnimatePresence mode="wait">
            {step === 'initial' && (
              <motion.div key="initial" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setUnitType('official'); setStep('manual'); }}
                      className="p-8 glass rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group flex flex-col items-center text-center"
                    >
                       <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                          <Cpu size={24} />
                       </div>
                       <span className="text-xs font-black text-white uppercase tracking-widest mb-1">Official Hardware</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter italic">SparkStation Unit</span>
                    </button>
                    <button 
                      onClick={() => { setUnitType('legacy'); setStep('manual'); }}
                      className="p-8 glass rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group flex flex-col items-center text-center"
                    >
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                          <Smartphone size={24} />
                       </div>
                       <span className="text-xs font-black text-white uppercase tracking-widest mb-1">Legacy Tag</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter italic">BYO NFC Hardware</span>
                    </button>
                 </div>
                 
                 <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10 flex items-start gap-4">
                    <Info className="text-orange-500 shrink-0" size={18} />
                    <p className="text-[10px] font-bold text-orange-500/80 leading-relaxed uppercase tracking-wide">
                       Authorized units link instantly via serial authentication. Legacy BYO tags require manual entry of our pairing payload.
                    </p>
                 </div>
              </motion.div>
            )}

            {step === 'manual' && (
              <motion.form key="manual" onSubmit={handleManualActivate} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block px-2">Station Serial</label>
                       {unitType === 'official' ? (
                         <div className="flex items-stretch">
                           <div className="flex items-center px-5 bg-orange-500/10 border border-orange-500/30 border-r-0 rounded-l-2xl">
                             <span className="text-base font-black text-orange-400 tracking-widest select-none">SPARK-</span>
                           </div>
                           <input
                             autoFocus
                             type="text"
                             required
                             maxLength={4}
                             placeholder="XXXX"
                             value={suffix}
                             onChange={(e) => setSuffix(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())}
                             className="flex-1 bg-white/5 border border-white/10 rounded-r-2xl px-6 py-5 text-lg text-white font-black uppercase placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all tracking-[0.3em]"
                           />
                         </div>
                       ) : (
                         <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                           <input 
                             autoFocus
                             type="text" 
                             required
                             placeholder="ENTER FULL SERIAL"
                             value={serial}
                             onChange={(e) => setSerial(e.target.value)}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-lg text-white font-black uppercase placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                           />
                         </div>
                       )}
                    </div>

                    <div className="relative">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block px-2">Unit Nickname</label>
                       <input 
                         type="text" 
                         placeholder="E.G. FRONT DESK TAG"
                         value={nickname}
                         onChange={(e) => setNickname(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white font-bold uppercase placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                       />
                    </div>
                 </div>

                 {error && (
                   <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center gap-3 text-red-500">
                      <AlertCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep('initial')} className="px-8 py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading || (unitType === 'official' ? suffix.length !== 4 : !serial)}
                      className="flex-1 px-8 py-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />} Establish Uplink
                    </button>
                 </div>
              </motion.form>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                 <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                    <CheckCircle2 size={48} className="relative z-10" />
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Uplink Established</h3>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Station Serial {serial} is now active</p>
                 <button 
                   onClick={onClose}
                   className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02]"
                 >
                   Access Mission Control <ArrowRight size={18} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
