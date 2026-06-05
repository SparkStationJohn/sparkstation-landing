import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, ChevronRight, CheckCircle2, QrCode } from 'lucide-react';
import { sb } from '../lib/supabase';

export default function Setup() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const assetID = searchParams.get('id');

  useEffect(() => {
    if (!assetID) {
      setError('Invalid setup link. Please tap your device again.');
      setLoading(false);
      return;
    }

    const checkAsset = async () => {
      const { data, error } = await sb
        .from('assets')
        .select('*')
        .eq('serial_number', assetID)
        .single();

      if (error || !data) {
        setError('Device not found in our registry. Please contact support.');
      } else {
        setAsset(data);
      }
      setLoading(false);
    };

    checkAsset();
  }, [assetID]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-bold">Setup Error</h2>
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto glow-orange rotate-3">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Activate Your {asset.device_type}</h1>
          <p className="text-slate-400">Welcome to the SparkStation ecosystem. Let's get your hardware ready.</p>
        </div>

        {/* Status Card */}
        <div className="glass rounded-3xl p-8 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Cpu className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Device Identified</p>
                <p className="font-mono text-sm text-slate-300">{asset.serial_number}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Verified</div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-4">
            <SetupStep 
              num="1" 
              title="Create Your Identity" 
              desc="Set up your professional profile that will be shared when you tap." 
              active={step === 1}
              done={step > 1}
            />
            <SetupStep 
              num="2" 
              title="Link Hardware" 
              desc="Anchor this physical device to your digital account." 
              active={step === 2}
              done={step > 2}
            />
            <SetupStep 
              num="3" 
              title="Deploy" 
              desc="Your SparkStation is live and ready for the world." 
              active={step === 3}
              done={step > 3}
            />
          </div>
        </div>

        <button 
          onClick={() => navigate('/login?redirect=setup&id=' + assetID)}
          className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 text-lg group"
        >
          Begin Activation
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-slate-500">
          By activating, you agree to our <a href="/terms" className="text-slate-300 underline">Terms of Service</a>.
        </p>
      </motion.div>
    </div>
  );
}

function SetupStep({ num, title, desc, active, done }) {
  return (
    <div className={`flex gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-white/5 ring-1 ring-white/10' : 'opacity-50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${done ? 'bg-green-500 text-white' : active ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-500'}`}>
        {done ? <CheckCircle2 size={16} /> : num}
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
