import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Cpu, BarChart3, Mail, Zap, ArrowRight, Home as HomeIcon, Globe, Lock,
  Play, Download, CheckCircle2, Sparkles, User, Edit3, QrCode, Copy,
  PowerOff, ToggleLeft, Plus
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Analytics from './Analytics';
import {
  DEMO_PROFILE, DEMO_ASSETS, DEMO_PAGE_VIEWS, DEMO_TAPS, DEMO_LEADS,
} from '../data/demoData';
import MicrositeEditor from './MicrositeEditor';

const LOCK_MSG = 'Create a free account to unlock this feature';

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
        active
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
          : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-500 group-hover:text-orange-500 transition-colors'}>
        {icon}
      </span>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

// Matches the production AssetCard layout exactly — all write actions locked
function DemoAssetCard({ asset, onLocked }) {
  const initR = asset.redirects?.[0];
  const [showQR, setShowQR] = useState(false);

  const isMyProfile = initR?.mode === 'profile';
  const missionUrl  = initR?.destination_url || '';
  const tapUrl      = `https://tap.sparkstation.link/${asset.serial_number}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${asset.id}`);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${asset.serial_number}-QR.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="glass p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 transition-all relative group">

      {/* Card header row */}
      <div className="flex items-start gap-3 mb-4">
        {/* Checkbox */}
        <button
          onClick={onLocked}
          className="mt-1 shrink-0 w-5 h-5 rounded-md border border-white/10 hover:border-white/30 flex items-center justify-center transition-all"
        />

        {/* Name + serial */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-white tracking-tighter uppercase truncate">
            {asset.nickname || asset.serial_number}
          </h3>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            {asset.serial_number}
          </div>
        </div>

        {/* QR + Edit + status */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowQR(v => !v)}
            className={`p-2 glass border rounded-xl transition-all active:scale-90 ${showQR ? 'border-orange-500/50 text-orange-500' : 'border-white/5 text-slate-500 hover:text-orange-500 hover:border-orange-500/50'}`}
            title="QR Code"
          >
            <QrCode size={14} />
          </button>
          <button
            onClick={onLocked}
            className="p-2 glass border border-white/5 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-500/50 transition-all active:scale-90"
            title="Rename"
          >
            <Edit3 size={14} />
          </button>
          <span className="text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/10">
            Active
          </span>
        </div>
      </div>

      {/* QR Code Panel */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center gap-4"
        >
          <div className="p-3 bg-white rounded-xl">
            <QRCodeCanvas id={`qr-${asset.id}`} value={tapUrl} size={140} bgColor="#ffffff" fgColor="#0f172a" level="H" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tap URL</p>
            <p className="text-[9px] font-mono text-orange-400 break-all">{tapUrl}</p>
          </div>
          <button
            onClick={downloadQR}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            <Download size={12} /> Download PNG
          </button>
        </motion.div>
      )}

      {/* Mission config */}
      <div className="space-y-3 mb-4">
        <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">
          Choose Station Mission
        </label>

        {/* 2×2 mode grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onLocked}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMyProfile ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <User size={14} /><span className="text-[9px] font-black uppercase">My Profile</span>
          </button>
          <button
            onClick={onLocked}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${!isMyProfile ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <Globe size={14} /><span className="text-[9px] font-black uppercase">Website</span>
          </button>
          <button
            onClick={onLocked}
            className="flex items-center gap-3 p-3 rounded-xl border bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 transition-all"
          >
            <Zap size={14} /><span className="text-[9px] font-black uppercase">Automate</span>
          </button>
          <button
            onClick={onLocked}
            className="flex items-center gap-3 p-3 rounded-xl border bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 transition-all"
          >
            <ToggleLeft size={14} /><span className="text-[9px] font-black uppercase">Switch</span>
          </button>
        </div>

        {/* URL display for Website mode */}
        {!isMyProfile && missionUrl && (
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">
              Where should this tap go?
            </label>
            <div className="flex gap-2">
              <div
                onClick={onLocked}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-orange-400 font-mono truncate cursor-pointer hover:border-orange-500/30 transition-all"
              >
                {missionUrl}
              </div>
              <button
                onClick={onLocked}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"
              >
                <Edit3 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Station Mission */}
      <button
        onClick={onLocked}
        className="w-full bg-white text-slate-950 font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all mb-3"
      >
        Save Station Mission
      </button>

      {/* Copy Mission */}
      <button
        onClick={onLocked}
        className="w-full bg-slate-800 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl flex items-center justify-center gap-3 group mb-3"
      >
        <Copy size={14} className="group-hover:scale-110 transition-transform" /> Copy Mission
      </button>

      {/* Deactivate + Tap count */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={onLocked}
          className="flex-1 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all flex items-center justify-center gap-3 group/deact"
        >
          <PowerOff size={14} className="group-hover/deact:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-widest">Deactivate</span>
        </button>
        <div className="flex-none bg-orange-500/5 text-slate-500 font-black px-4 py-4 rounded-xl text-[10px] border border-white/5 flex items-center gap-3">
          <span className="text-[7px] text-slate-600 uppercase tracking-widest">Taps</span>
          <span className="text-white font-mono">{asset.tap_count || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default function DemoShell() {
  const [activeView, setActiveView] = useState('stations');
  const [toast, setToast] = useState(null);
  const [expandedDemoLeadId, setExpandedDemoLeadId] = useState(null);

  const showToast = (msg = LOCK_MSG) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="dashboard-shell min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] overflow-x-hidden">
      <Helmet>
        <title>Live Demo | SparkStation Command Center</title>
        <meta name="description" content="Explore the SparkStation platform with live demo data. No account required." />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* ── DEMO BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-[70] bg-orange-500 text-white h-10 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Play size={11} fill="white" className="shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
            Live Demo — Explore freely, no account required
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest sm:hidden">Demo Mode</span>
        </div>
        <Link
          to="/login"
          className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-all shrink-0"
        >
          Create Free Account <ArrowRight size={11} />
        </Link>
      </div>

      {/* ── NAV BAR ── */}
      <nav className="fixed top-10 left-0 right-0 z-[60] glass border-b border-[var(--border-subtle)] px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="p-2.5 glass rounded-xl border border-white/5 text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
            <HomeIcon size={16} />
          </Link>
          <div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">SparkStation</span>
            <div className="text-[9px] font-black tracking-[0.4em] text-orange-500 uppercase mt-0.5">Command Center</div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Link Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Demo Mode</span>
          </div>
          <div className="w-10 h-10 glass rounded-xl border border-white/5 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=studioembers&backgroundColor=fde68a"
              alt="Studio Ember"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 glass rounded-2xl border border-orange-500/30 shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <Lock size={14} className="text-orange-500 shrink-0" />
            <span className="text-xs font-black text-white">{toast}</span>
            <Link to="/login" className="text-[9px] font-black text-orange-500 uppercase tracking-widest underline-offset-2 underline shrink-0">
              Sign Up Free →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <main className="mt-[7.5rem] h-[calc(100vh-7.5rem)] flex overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:flex w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex-col p-8 shrink-0">
          {/* Profile chip */}
          <div className="mb-8 p-4 glass rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=studioembers&backgroundColor=fde68a"
                alt="Studio Ember"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white uppercase tracking-tight truncate">{DEMO_PROFILE.business_name}</p>
              <p className="text-[9px] font-bold text-slate-500 truncate">@{DEMO_PROFILE.username}</p>
            </div>
            <div className="ml-auto shrink-0 px-2 py-1 bg-orange-500/10 rounded-lg">
              <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Pro</span>
            </div>
          </div>

          {/* Nav items */}
          <div className="space-y-1.5 flex-1">
            <NavItem icon={<Cpu size={18} />}      label="Stations"     active={activeView === 'stations'}  onClick={() => setActiveView('stations')}  />
            <NavItem icon={<Sparkles size={18} />}  label="Edit Profile" active={activeView === 'identity'}  onClick={() => setActiveView('identity')}  />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics"    active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
            <NavItem icon={<Mail size={18} />}      label="Leads"        active={activeView === 'leads'}     onClick={() => setActiveView('leads')}     />
          </div>

          {/* Fleet bar + CTA */}
          <div className="space-y-4 pt-6">
            <div className="p-5 glass rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fleet Usage</span>
                <span className="text-xs font-black text-orange-500">{DEMO_ASSETS.length} / 100</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div style={{ width: `${(DEMO_ASSETS.length / 100) * 100}%` }} className="h-full bg-orange-500 rounded-full" />
              </div>
              <p className="text-[8px] text-slate-600 mt-2 font-bold">Spark PRO · 100 Station Limit</p>
            </div>
            <Link
              to="/login"
              className="block w-full text-center py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all uppercase text-[9px] tracking-widest shadow-xl shadow-orange-500/20"
            >
              Create Free Account →
            </Link>
          </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <div className="flex-1 min-w-0 overflow-y-auto">

          {/* Mobile tab bar */}
          <div className="lg:hidden sticky top-0 z-10 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] px-4 flex gap-1 py-3">
            {[
              { id: 'stations',  icon: <Cpu size={15} />,      label: 'Stations' },
              { id: 'identity',  icon: <Sparkles size={15} />,  label: 'Profile'  },
              { id: 'analytics', icon: <BarChart3 size={15} />, label: 'Analytics'},
              { id: 'leads',     icon: <Mail size={15} />,      label: 'Leads'    },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeView === tab.id ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-white bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
            <AnimatePresence mode="wait">

              {/* ════════════════ STATIONS VIEW ════════════════ */}
              {activeView === 'stations' && (
                <motion.div
                  key="stations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none mb-2">
                        Active Fleet
                      </h1>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        System Health: Optimal
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                      </p>
                    </div>
                    <button
                      onClick={() => showToast()}
                      className="shrink-0 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-[10px] tracking-widest flex items-center gap-2"
                    >
                      <Plus size={18} /> Deploy New Station
                    </button>
                  </header>

                  {/* Station cards — identical layout to production */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 items-start">
                    {DEMO_ASSETS.map(asset => (
                      <DemoAssetCard key={asset.id} asset={asset} onLocked={() => showToast()} />
                    ))}
                  </div>

                  {/* Unlock CTA */}
                  <div className="p-10 rounded-[3rem] bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 text-center space-y-5">
                    <Sparkles size={32} className="text-orange-500 mx-auto" />
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Ready to Run Your Own Fleet?</h3>
                    <p className="text-slate-400 font-medium max-w-md mx-auto text-sm">
                      Start free — connect your first 2 stations, build your microsite, and start capturing leads today. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                        to="/login"
                        className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-[10px] tracking-widest flex items-center gap-2"
                      >
                        Start Free <ArrowRight size={14} />
                      </Link>
                      <Link
                        to="/shop"
                        className="px-10 py-4 glass border border-white/10 text-slate-300 font-black rounded-2xl transition-all hover:border-orange-500/30 uppercase text-[10px] tracking-widest"
                      >
                        Get the Hardware
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════════════════ ANALYTICS VIEW ════════════════ */}
              {activeView === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-orange-500 shrink-0" />
                      <span className="text-xs font-black text-slate-300">
                        Showing live analytics for <span className="text-orange-500">Studio Ember</span> — 7 days of real interaction data.
                      </span>
                    </div>
                    <Link to="/login" className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0 hover:underline">
                      Connect Your Hardware <ArrowRight size={11} />
                    </Link>
                  </div>
                  <Analytics
                    recentActivity={DEMO_TAPS}
                    pageViews={DEMO_PAGE_VIEWS}
                    leads={DEMO_LEADS}
                    assets={DEMO_ASSETS}
                  />
                </motion.div>
              )}

              {/* ════════════════ IDENTITY / MICROSITE BUILDER VIEW ════════════════ */}
              {activeView === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-orange-500 shrink-0" />
                      <span className="text-xs font-black text-slate-300">
                        Previewing the <span className="text-orange-500">Microsite Builder</span> — changes are not saved in demo mode.
                      </span>
                    </div>
                    <Link to="/login" className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0 hover:underline">
                      Sign Up to Save <ArrowRight size={11} />
                    </Link>
                  </div>
                  <MicrositeEditor
                    initialData={DEMO_PROFILE}
                    onSave={() => showToast('Sign up to save your profile changes')}
                    onUpgrade={() => showToast('Sign up for Pro to unlock this feature')}
                    linkLibrary={[]}
                    onAddLink={() => showToast()}
                    onDeleteLink={() => showToast()}
                  />
                </motion.div>
              )}

              {/* ════════════════ LEADS VIEW ════════════════ */}
              {activeView === 'leads' && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="glass p-12 rounded-[3rem] border border-white/5">
                      <header className="flex justify-between items-center mb-12">
                        <div>
                          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Leads Vault</h2>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Client Acquisition Data</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Captures</p>
                            <p className="text-2xl font-black text-white italic">{DEMO_LEADS.length}</p>
                          </div>
                          <button
                            onClick={() => showToast('Sign up to export your leads as CSV')}
                            className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </header>

                      <div className="space-y-4">
                        {DEMO_LEADS.map((lead) => {
                          const isExpanded = expandedDemoLeadId === lead.id;
                          return (
                            <div
                              key={lead.id}
                              className="group bg-slate-900/50 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all overflow-hidden"
                            >
                              {/* Main row */}
                              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-orange-500 transition-colors shrink-0">
                                    <User size={32} />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-black text-white uppercase italic leading-none mb-1">{lead.name}</h4>
                                    <p className="text-sm font-bold text-slate-500 tracking-tight">{lead.email}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col md:items-end shrink-0">
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
                                    {new Date(lead.created_at).toLocaleDateString()}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">No Phone</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => showToast('Sign up to reply to leads from your dashboard')}
                                    className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all uppercase text-[9px] font-black tracking-widest flex items-center gap-2"
                                  >
                                    <Mail size={14} /> Reply
                                  </button>
                                  <button
                                    onClick={() => setExpandedDemoLeadId(isExpanded ? null : lead.id)}
                                    className={`p-4 rounded-xl border transition-all uppercase text-[9px] font-black tracking-widest ${
                                      isExpanded
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500 hover:text-white'
                                    }`}
                                  >
                                    View Notes
                                  </button>
                                </div>
                              </div>
                              {/* Locked notes panel */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4 space-y-3">
                                      <textarea
                                        readOnly
                                        onClick={() => showToast('Sign up to save notes on your leads')}
                                        placeholder="Add notes, follow-up reminders, or context about this lead..."
                                        rows={3}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none resize-none font-medium cursor-pointer"
                                      />
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() => showToast('Sign up to save notes on your leads')}
                                          className="px-6 py-2.5 bg-orange-500/20 text-orange-500/50 font-black rounded-xl text-[9px] uppercase tracking-widest flex items-center gap-2 cursor-not-allowed"
                                        >
                                          <Lock size={12} /> Save Note
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                  </div>

                  {/* Unlock CTA */}
                  <div className="p-10 rounded-[3rem] border border-orange-500/20 bg-orange-500/5 text-center space-y-4">
                    <CheckCircle2 size={28} className="text-green-400 mx-auto" />
                    <h3 className="text-xl font-black uppercase italic">Every Tap Can Become a Lead</h3>
                    <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">
                      Enable tap-to-lead on any station. Visitors tap your card and instantly submit their contact info — no app, no friction.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-[10px] tracking-widest"
                    >
                      Start Free <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
