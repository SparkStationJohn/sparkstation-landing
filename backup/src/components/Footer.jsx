import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Globe, Shield, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-40 pb-20 border-t border-border-subtle bg-surface">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Zap size={16} fill="white" />
            </div>
            <span className="text-lg font-black uppercase tracking-tighter text-primary">SparkStation</span>
          </div>
          <p className="text-secondary max-w-sm text-sm font-medium leading-relaxed">
            Architecting the bridge between atoms and bits. Professional NFC hardware and digital identity platform for makers, creators, and brands.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-widest">
              <Mail size={14} className="text-orange-500" />
              <a href="mailto:sales@sparkstation.link" className="hover:text-primary transition-colors">sales@sparkstation.link</a>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-widest">
              <MessageSquare size={14} className="text-blue-500" />
              <a href="mailto:support@sparkstation.link" className="hover:text-primary transition-colors">support@sparkstation.link</a>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-widest">
              <Globe size={14} className="text-orange-500" />
              <a href="https://tap.sparkstation.link/u/sparkstation" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">tap.sparkstation.link/u/sparkstation</a>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Platform</h4>
          <ul className="space-y-4 text-xs font-bold text-secondary uppercase tracking-widest">
            <li><Link to="/shop" className="hover:text-orange-500 transition-colors">SparkStore</Link></li>
            <li><Link to="/how-it-works" className="hover:text-orange-500 transition-colors">How it Works?</Link></li>
            <li><Link to="/why-sparkstation" className="hover:text-orange-500 transition-colors">Why SparkStation?</Link></li>
            <li><Link to="/how-it-works#pricing" className="hover:text-orange-500 transition-colors">Pricing & Plans</Link></li>
            <li><Link to="/identity" className="hover:text-orange-500 transition-colors">Identity Blueprint</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Legal</h4>
          <ul className="space-y-4 text-xs font-bold text-secondary uppercase tracking-widest">
            <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-orange-500 transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      {/* SECURITY TRUST BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="glass rounded-[2rem] border border-border-subtle p-8 flex flex-wrap justify-center gap-12 md:gap-20">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Stripe Verified</p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">AES-256 Encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Supabase Core</p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Postgres Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Netlify Edge</p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Global CDN Defense</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-tighter">PCI Compliant</p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">SAQ-A via Stripe</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 mt-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-30">
          &copy; 2026 SparkStation Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/u/sparkstation"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
          >
            <Globe size={14} /> Our Profile
          </Link>
          <a href="mailto:sales@sparkstation.link" className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-secondary hover:text-primary hover:bg-orange-500/10 transition-all">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
