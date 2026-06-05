import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Cpu, BarChart3, Mail, Zap, ArrowRight, Home as HomeIcon, Globe, Lock,
  Play, Download, CheckCircle2, Sparkles, User, Edit3, QrCode, Copy,
  PowerOff, ToggleLeft, Plus, Radio, Smartphone, Battery, Wifi, RefreshCw, ExternalLink, ChevronRight,
  Menu, X, Check
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
      className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
        active
          ? 'bg-orange-500/10 text-orange-500'
          : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {active && (
        <motion.div
          layoutId="demoActiveNav"
          className="absolute left-2 w-1 h-6 bg-orange-500 rounded-full"
        />
      )}
      <span className={active ? 'text-orange-500' : 'text-slate-500 group-hover:text-orange-500 transition-colors'}>
        {icon}
      </span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-orange-500' : ''}`}>{label}</span>
    </button>
  );
}

// Matches the production AssetCard layout exactly — all write actions locked
// Matches the production AssetCard layout exactly — but fully functional and editable!
function DemoAssetCard({
  asset,
  onUpdateAsset,
  onDeactivate,
  isSelected,
  onSelect,
  onCopy,
  onToast
}) {
  const initR = asset.redirects?.[0];
  const [showQR, setShowQR] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(asset.nickname || asset.serial_number);

  const [selectedMode, setSelectedMode] = useState(initR?.mode || 'profile');
  const [targetUrl, setTargetUrl] = useState(initR?.destination_url || '');

  // Keep state in sync with asset updates (e.g. from parent state changes)
  useEffect(() => {
    if (initR) {
      setSelectedMode(initR.mode || 'profile');
      setTargetUrl(initR.destination_url || '');
    }
  }, [initR]);

  const isMyProfile = selectedMode === 'profile';
  const tapUrl      = `https://tap.sparkstation.link/${asset.serial_number}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${asset.id}`);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${asset.serial_number}-QR.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSaveName = () => {
    if (!editName.trim()) return;
    onUpdateAsset(asset.id, { nickname: editName.trim() });
    setIsEditingName(false);
    onToast('⚡ Station nickname updated!', 'success');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
  };

  const handleSaveMission = () => {
    onUpdateAsset(asset.id, {
      redirects: [{
        ...initR,
        mode: selectedMode,
        destination_url: targetUrl
      }]
    });
    onToast('⚡ Station Mission saved to browser session!', 'success');
  };

  const handleCopyMission = () => {
    onCopy(asset.id, {
      mode: selectedMode,
      destination_url: targetUrl
    });
    navigator.clipboard.writeText(selectedMode === 'profile' ? 'SparkProfile' : targetUrl);
    onToast('⚡ Mission copied to clipboard!', 'success');
  };

  const handleDeactivate = () => {
    if (window.confirm(`Deactivate ${asset.nickname || asset.serial_number}? This will remove it from your simulator workspace.`)) {
      onDeactivate(asset.id);
      onToast('⚡ Station deactivated successfully!', 'success');
    }
  };

  return (
    <div className="glass p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 transition-all relative group">

      {/* Card header row */}
      <div className="flex items-start gap-3 mb-4">
        {/* Checkbox */}
        <button
          onClick={onSelect}
          className={`mt-1 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-orange-500 border-orange-500 text-white' 
              : 'border-white/10 hover:border-white/30 text-transparent'
          }`}
        >
          {isSelected && <CheckCircle2 size={12} fill="currentColor" />}
        </button>

        {/* Name + serial */}
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-1.5 border-b border-orange-500/50 pb-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-white text-sm font-black outline-none uppercase truncate"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <h3 className="text-lg font-black text-white tracking-tighter uppercase truncate">
              {asset.nickname || asset.serial_number}
            </h3>
          )}
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
            onClick={() => {
              if (isEditingName) {
                handleSaveName();
              } else {
                setIsEditingName(true);
              }
            }}
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
            onClick={() => setSelectedMode('profile')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMyProfile ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <User size={14} /><span className="text-[9px] font-black uppercase">My Profile</span>
          </button>
          <button
            onClick={() => setSelectedMode('url')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedMode === 'url' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <Globe size={14} /><span className="text-[9px] font-black uppercase">Website</span>
          </button>
          <button
            onClick={() => setSelectedMode('automate')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedMode === 'automate' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <Zap size={14} /><span className="text-[9px] font-black uppercase">Automate</span>
          </button>
          <button
            onClick={() => setSelectedMode('switch')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedMode === 'switch' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
          >
            <ToggleLeft size={14} /><span className="text-[9px] font-black uppercase">Switch</span>
          </button>
        </div>

        {/* URL display/input for modes other than profile */}
        {!isMyProfile && (
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">
              Where should this tap go?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://yourbrand.com/destination"
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-orange-400 font-mono focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Station Mission */}
      <button
        onClick={handleSaveMission}
        className="w-full bg-white text-slate-950 font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all mb-3"
      >
        Save Station Mission
      </button>

      {/* Copy Mission */}
      <button
        onClick={handleCopyMission}
        className="w-full bg-slate-800 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl flex items-center justify-center gap-3 group mb-3"
      >
        <Copy size={14} className="group-hover:scale-110 transition-transform" /> Copy Mission
      </button>

      {/* Deactivate + Tap count */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={handleDeactivate}
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

function DemoLeadRow({ lead, isExpanded, onToggleExpand, leadNotesState, onSaveNote, onReply }) {
  const [noteVal, setNoteVal] = useState(leadNotesState[lead.id] || '');

  // Keep note state sync'd when parents state updates
  useEffect(() => {
    setNoteVal(leadNotesState[lead.id] || '');
  }, [leadNotesState, lead.id]);

  return (
    <div className="group bg-slate-900/50 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all overflow-hidden">
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
            onClick={() => onReply(lead)}
            className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all uppercase text-[9px] font-black tracking-widest flex items-center gap-2"
          >
            <Mail size={14} /> Reply
          </button>
          <button
            onClick={onToggleExpand}
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
      {/* Notes panel */}
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
                value={noteVal}
                onChange={(e) => setNoteVal(e.target.value)}
                placeholder="Add notes, follow-up reminders, or context about this lead..."
                rows={3}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none resize-none font-medium focus:border-orange-500/50 transition-all"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => onSaveNote(lead.id, noteVal)}
                  className="px-6 py-2.5 bg-white text-slate-950 font-black rounded-xl text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                >
                  Save Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DemoShell() {
  const [activeView, setActiveView] = useState('simulator');
  const [toast, setToast] = useState(null);
  const [expandedDemoLeadId, setExpandedDemoLeadId] = useState(null);

  // Lazy initializers for LocalStorage persistence!
  const [demoProfileState, setDemoProfileState] = useState(() => {
    const saved = localStorage.getItem('spark_sandbox_profile');
    return saved ? JSON.parse(saved) : DEMO_PROFILE;
  });

  const [demoAssetsState, setDemoAssetsState] = useState(() => {
    const saved = localStorage.getItem('spark_sandbox_assets');
    return saved ? JSON.parse(saved) : DEMO_ASSETS;
  });

  const [leadNotesState, setLeadNotesState] = useState(() => {
    const saved = localStorage.getItem('spark_sandbox_lead_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [recentActivityState, setRecentActivityState] = useState(() => {
    const saved = localStorage.getItem('spark_sandbox_taps');
    return saved ? JSON.parse(saved) : DEMO_TAPS;
  });

  const [leadsState, setLeadsState] = useState(() => {
    const saved = localStorage.getItem('spark_sandbox_leads');
    return saved ? JSON.parse(saved) : DEMO_LEADS;
  });

  const [selectedAssetIds, setSelectedAssetIds] = useState([]);

  // Auto-sync useEffect hooks
  useEffect(() => {
    localStorage.setItem('spark_sandbox_profile', JSON.stringify(demoProfileState));
  }, [demoProfileState]);

  useEffect(() => {
    localStorage.setItem('spark_sandbox_assets', JSON.stringify(demoAssetsState));
  }, [demoAssetsState]);

  useEffect(() => {
    localStorage.setItem('spark_sandbox_lead_notes', JSON.stringify(leadNotesState));
  }, [leadNotesState]);

  useEffect(() => {
    localStorage.setItem('spark_sandbox_taps', JSON.stringify(recentActivityState));
  }, [recentActivityState]);

  useEffect(() => {
    localStorage.setItem('spark_sandbox_leads', JSON.stringify(leadsState));
  }, [leadsState]);

  // Stateful Telemetry and Simulator Data
  const [demoMode, setDemoMode] = useState('microsite');
  const [customUrl, setCustomUrl] = useState('');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [simulatingTap, setSimulatingTap] = useState(false);
  const [telemetrySpeed, setTelemetrySpeed] = useState('');
  const [latestSimulatedUrl, setLatestSimulatedUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (msg = LOCK_MSG, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const executeSimulatedTap = () => {
    if (simulatingTap) return;
    setSimulatingTap(true);
    setTelemetrySpeed('');

    const destinationUrl = demoMode === 'custom' 
      ? (customUrl || 'https://yourbrand.com') 
      : `https://welcome.sparkstation.link/u/${DEMO_PROFILE.username}`;
    setLatestSimulatedUrl(destinationUrl);

    setTimeout(() => {
      const cities = [
        { name: 'New York', country: 'US', lat: 40.7128, lng: -74.0060 },
        { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
        { name: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
        { name: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
        { name: 'Berlin', country: 'DE', lat: 52.5200, lng: 13.4050 },
        { name: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
      ];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      const newTap = {
        id: `sim-${Date.now()}`,
        asset_id: demoAssetsState[0]?.id || 'asset-1',
        created_at: new Date().toISOString(),
        city: randomCity.name,
        country: randomCity.country,
        lat: randomCity.lat,
        lng: randomCity.lng,
        device_type: ['mobile', 'tablet', 'mobile'][Math.floor(Math.random() * 3)],
        source: demoMode === 'custom' ? 'direct' : 'sparktag',
        assets: {
          id: demoAssetsState[0]?.id || 'asset-1',
          nickname: demoAssetsState[0]?.nickname || 'Spark Keychain V6',
          serial_number: demoAssetsState[0]?.serial_number || 'ST-90238-X'
        }
      };

      setRecentActivityState(prev => [newTap, ...prev]);

      setDemoAssetsState(prev => prev.map((asset, index) => {
        if (index === 0) {
          return { ...asset, tap_count: (asset.tap_count || 0) + 1 };
        }
        return asset;
      }));

      setTelemetrySpeed('180ms');
      setSimulatingTap(false);

      // Auto switch to analytics tab so the user sees the live map ping drop immediately!
      setActiveView('analytics');

      // Open the conversion modal!
      setShowConversionModal(true);
    }, 1200); // Visual signal wave delay
  };

  const handleDeployNewStation = () => {
    const nextNum = demoAssetsState.length + 1;
    const serial = `ST-${90000 + Math.floor(Math.random() * 10000)}-X`;
    const newStation = {
      id: `station-${Date.now()}`,
      serial_number: serial,
      nickname: `Custom Station ${nextNum}`,
      tap_count: 0,
      redirects: [{
        id: `r-${Date.now()}`,
        mode: 'profile',
        destination_url: ''
      }]
    };
    setDemoAssetsState(prev => [...prev, newStation]);
  };

  const handleSaveNote = (leadId, text) => {
    setLeadNotesState(prev => ({
      ...prev,
      [leadId]: text
    }));
    showToast('⚡ Client note saved to browser session!', 'success');
  };

  const handleReply = (lead) => {
    const subject = encodeURIComponent("SparkStation Connection");
    const body = encodeURIComponent(`Hi ${lead.name},\n\nThanks for tapping my SparkStation!`);
    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    showToast(`⚡ Drafted email reply to ${lead.name}!`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Date Captured', 'Notes'];
    const rows = leadsState.map(lead => [
      lead.name,
      lead.email,
      new Date(lead.created_at).toLocaleDateString(),
      leadNotesState[lead.id] || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'spark_station_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('⚡ Leads CSV exported successfully!', 'success');
  };

  return (
    <div className="dashboard-shell min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <Helmet>
        <title>Live Demo | SparkStation Command Center</title>
        <meta name="description" content="Explore the SparkStation platform with live demo data. No account required." />
        <meta name="robots" content="noindex" />
        <style>{`html,body{scrollbar-width:none;}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;}`}</style>
      </Helmet>

      {/* ── DEMO BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-[70] bg-slate-950/85 backdrop-blur-md border-b border-orange-500/20 text-white h-12 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-lg shadow-orange-500/5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden sm:inline text-slate-200">
            ⚡ Sandbox Playground. <span className="text-orange-400">Ready to secure your custom vanity handle and deploy live hardware?</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest sm:hidden text-orange-400">⚡ Sandbox Active</span>
        </div>
        <a
          href="https://tap.sparkstation.link/login"
          onClick={(e) => {
            e.preventDefault();
            const browserId = localStorage.getItem('spark_browser_session') || '';
            const username = demoProfileState?.username || '';
            let url = 'https://tap.sparkstation.link/login';
            const params = [];
            if (browserId) params.push(`browser_id=${encodeURIComponent(browserId)}`);
            if (username) params.push(`handle=${encodeURIComponent(username)}`);
            if (params.length > 0) url += `?${params.join('&')}`;
            window.location.href = url;
          }}
          className="text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-md shadow-orange-500/20 shrink-0"
        >
          Claim Your Profile & Sign Up <ArrowRight size={11} />
        </a>
      </div>

      {/* ── NAV BAR ── */}
      <nav className="fixed top-12 left-0 right-0 z-[60] glass border-b border-[var(--border-subtle)] px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="p-2.5 glass rounded-xl border border-white/5 text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all">
            <HomeIcon size={16} />
          </Link>
          <div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">SparkStation</span>
            <div className="hidden sm:block text-[9px] font-black tracking-[0.4em] text-orange-500 uppercase mt-0.5">Command Center</div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Link Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Demo Mode</span>
          </div>
          <div className="w-10 h-10 glass rounded-xl border border-white/5 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=studioembers&backgroundColor=fde68a"
              alt="Studio Ember"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2.5 glass rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 glass rounded-2xl border shadow-2xl flex items-center gap-3 whitespace-nowrap ${
              toast.type === 'success' ? 'border-green-500/30 shadow-green-500/5' : 'border-orange-500/30'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={14} className="text-green-400 shrink-0" />
            ) : (
              <Lock size={14} className="text-orange-500 shrink-0" />
            )}
            <span className="text-xs font-black text-white">{toast.msg}</span>
            <a
              href="https://tap.sparkstation.link/login"
              onClick={(e) => {
                e.preventDefault();
                const browserId = localStorage.getItem('spark_browser_session') || '';
                const username = demoProfileState?.username || '';
                let url = 'https://tap.sparkstation.link/login';
                const params = [];
                if (browserId) params.push(`browser_id=${encodeURIComponent(browserId)}`);
                if (username) params.push(`handle=${encodeURIComponent(username)}`);
                if (params.length > 0) url += `?${params.join('&')}`;
                window.location.href = url;
              }}
              className="text-[9px] font-black text-orange-500 uppercase tracking-widest underline-offset-2 underline shrink-0"
            >
              {toast.type === 'success' ? 'Make it live →' : 'Sign Up Free →'}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[57] bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <main className="mt-[9rem] min-h-[calc(100vh-9rem)] flex">

        {/* ── SIDEBAR ── */}
        <aside className={`fixed top-[9rem] bottom-0 left-0 z-[58] w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col p-8 transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-[9rem] lg:self-start lg:h-[calc(100vh-9rem)] lg:shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            <NavItem icon={<Radio size={18} />}    label="Simulator"    active={activeView === 'simulator'} onClick={() => { setActiveView('simulator'); setIsSidebarOpen(false); }} />
            <NavItem icon={<Cpu size={18} />}      label="Stations"     active={activeView === 'stations'}  onClick={() => { setActiveView('stations');  setIsSidebarOpen(false); }} />
            <NavItem icon={<Sparkles size={18} />}  label="Edit Profile" active={activeView === 'identity'}  onClick={() => { setActiveView('identity');  setIsSidebarOpen(false); }} />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics"    active={activeView === 'analytics'} onClick={() => { setActiveView('analytics'); setIsSidebarOpen(false); }} />
            <NavItem icon={<Mail size={18} />}      label="Leads"        active={activeView === 'leads'}     onClick={() => { setActiveView('leads');     setIsSidebarOpen(false); }} />
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
        <div className="flex-1 min-w-0 overflow-x-hidden">

          <div className="p-6 md:p-12 max-w-7xl mx-auto pb-16">
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
                      onClick={handleDeployNewStation}
                      className="shrink-0 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-[10px] tracking-widest flex items-center gap-2"
                    >
                      <Plus size={18} /> Deploy New Station
                    </button>
                  </header>

                  {/* Active Assets Block */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Active Assets ({demoAssetsState.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                      {demoAssetsState.map(asset => (
                        <DemoAssetCard
                          key={asset.id}
                          asset={asset}
                          isSelected={selectedAssetIds.includes(asset.id)}
                          onSelect={() => {
                            setSelectedAssetIds(prev => 
                              prev.includes(asset.id) 
                                ? prev.filter(id => id !== asset.id) 
                                : [...prev, asset.id]
                            );
                          }}
                          onUpdateAsset={(id, updates) => {
                            setDemoAssetsState(prev => 
                              prev.map(item => item.id === id ? { ...item, ...updates } : item)
                            );
                          }}
                          onDeactivate={(id) => {
                            setDemoAssetsState(prev => prev.filter(item => item.id !== id));
                            setSelectedAssetIds(prev => prev.filter(item => item.id !== id));
                          }}
                          onCopy={(id, mission) => {
                            // Copying mission redirects to other selected stations
                            if (selectedAssetIds.length > 0) {
                              setDemoAssetsState(prev =>
                                prev.map(item =>
                                  selectedAssetIds.includes(item.id)
                                    ? {
                                        ...item,
                                        redirects: [{
                                          ...item.redirects?.[0],
                                          mode: mission.mode,
                                          destination_url: mission.destination_url
                                        }]
                                      }
                                    : item
                                )
                              );
                              showToast(`⚡ Mission synced across ${selectedAssetIds.length} selected stations!`, 'success');
                            }
                          }}
                          onToast={showToast}
                        />
                      ))}
                    </div>
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

              {/* ════════════════ SIMULATOR VIEW ════════════════ */}
              {activeView === 'simulator' && (
                <motion.div
                  key="simulator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none mb-2">
                        Redirect Simulator
                      </h1>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        ENGINE STATUS: ACTIVE
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                      </p>
                    </div>
                  </header>

                  {/* Side-by-Side Split Cockpit Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-7 space-y-8">
                      {/* NFC Simulator Panel */}
                      <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 text-orange-500 mb-2">
                              <Radio size={16} className="animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Live Redirection Engine</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
                              NFC Signal Simulation Deck
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                              Test your physical routing logic. Select a redirection target, trigger a simulated hardware tap, and watch the real-time analytics loop in action.
                            </p>
                          </div>

                          {/* Mode selector */}
                          <div className="flex gap-2 p-1.5 bg-slate-950/80 border border-white/5 rounded-2xl">
                            <button
                              onClick={() => setDemoMode('microsite')}
                              className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                demoMode === 'microsite'
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                  : 'text-slate-400 hover:text-white bg-transparent'
                              }`}
                            >
                              <span className="hidden sm:inline">Microsite (Built-In)</span>
                              <span className="sm:hidden">Microsite</span>
                            </button>
                            <button
                              onClick={() => setDemoMode('custom')}
                              className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                demoMode === 'custom'
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                  : 'text-slate-400 hover:text-white bg-transparent'
                              }`}
                            >
                              <span className="hidden sm:inline">Bring Your Own Link</span>
                              <span className="sm:hidden">BYOL</span>
                            </button>
                          </div>

                          {/* BYOL Input */}
                          {demoMode === 'custom' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-2"
                            >
                              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                                Target Redirection URL
                              </label>
                              <input
                                type="url"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                placeholder="https://yourbrand.com/store"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-orange-400 font-mono focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700"
                              />
                              <p className="text-[8px] text-slate-500 font-medium">
                                Enter any external destination (Shopify, Amazon, social links). The redirect analytics operate identically.
                              </p>
                            </motion.div>
                          )}

                          {/* Simulation CTA */}
                          <button
                            onClick={executeSimulatedTap}
                            disabled={simulatingTap}
                            className={`w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 relative overflow-hidden group ${
                              simulatingTap ? '' : 'animate-[pulse_2s_infinite]'
                            }`}
                          >
                            {simulatingTap ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Transmitting NFC Pulse...</span>
                              </>
                            ) : (
                              <>
                                <Radio size={14} className="animate-ping absolute left-6 opacity-40 group-hover:scale-110" />
                                <span>Simulate Physical NFC Tap</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Stateful Simulated Mobile Phone Preview */}
                    <div className="lg:col-span-5 sticky top-6 flex justify-center">
                      <div className="w-full max-w-[310px] bg-slate-950 border-[6px] border-slate-900 rounded-[2.8rem] shadow-2xl relative overflow-hidden aspect-[9/19] flex flex-col justify-between p-2.5 ring-1 ring-white/10">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
                          <div className="w-8 h-1 bg-slate-800 rounded-full" />
                        </div>

                        {/* Top bar info */}
                        <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 font-mono px-3 pt-1">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <Wifi size={8} />
                            <span className="text-[7px]">5G</span>
                            <Battery size={10} className="text-slate-400" />
                          </div>
                        </div>

                        {/* Simulated Browser URL bar */}
                        <div className="mt-6 mb-3 px-3 py-2 bg-slate-900/90 border border-white/5 rounded-xl text-[8px] font-mono text-slate-400 flex items-center justify-between gap-2 overflow-hidden truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <Lock size={8} className="text-green-500 shrink-0" />
                            <span className="truncate">
                              {demoMode === 'microsite' 
                                ? 'welcome.sparkstation.link/studio-ember' 
                                : (customUrl ? customUrl.replace(/^https?:\/\/(www\.)?/i, '') : 'john-artisan-wood.com')}
                            </span>
                          </div>
                          <RefreshCw size={8} className="text-slate-600 shrink-0" />
                        </div>

                        {/* Simulated Mobile Viewport Screen */}
                        <div className="flex-1 rounded-[1.8rem] bg-[#020617] border border-white/5 overflow-y-auto p-4 relative flex flex-col justify-between scrollbar-none min-h-[350px]">
                          <AnimatePresence mode="wait">
                            {simulatingTap ? (
                              /* State 1: Tap loading / routing transition */
                              <motion.div
                                key="phone-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center p-2 space-y-4"
                              >
                                <div className="relative flex items-center justify-center">
                                  <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full animate-ping absolute" />
                                  <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-500 relative">
                                    <Radio size={16} className="animate-pulse" />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Intercepting NFC Tap</h4>
                                  <p className="text-[7px] text-slate-500 font-bold tracking-widest font-mono uppercase">Attributing routing array...</p>
                                </div>
                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-1/2 rounded-full animate-[progress_1s_ease-in-out_infinite]" style={{ animationDuration: '0.8s' }} />
                                </div>
                              </motion.div>
                            ) : demoMode === 'microsite' ? (
                              /* State 2: Chameleon Profile Microsite Render */
                              <motion.div
                                key="phone-microsite"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col justify-between space-y-5"
                              >
                                {/* Mini header / profile */}
                                <div className="text-center space-y-1.5 pt-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full border border-orange-500/30 flex items-center justify-center text-white font-black italic text-sm shadow-md shadow-orange-500/20 mx-auto">
                                    SE
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none">Studio Ember</h4>
                                    <p className="text-[7px] font-bold text-slate-500 tracking-wide mt-0.5">Artisan Wood & Ceramics</p>
                                  </div>
                                </div>

                                {/* Custom Link buttons */}
                                <div className="space-y-2">
                                  {[
                                    { label: '🛒 Shop Ceramics Fleet', desc: 'Handcrafted pour-overs', active: true },
                                    { label: '📸 Portfolio Gallery', desc: 'Behind the scenes logs', active: false },
                                    { label: '☕ Read Our Blog', desc: 'Roast guides & profiles', active: false }
                                  ].map((link, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-2 rounded-xl text-left border flex items-center justify-between ${
                                        link.active
                                          ? 'bg-orange-500/10 border-orange-500/30 text-white'
                                          : 'bg-white/5 border-white/5 text-slate-300'
                                      }`}
                                    >
                                      <div>
                                        <p className="text-[8px] font-black uppercase tracking-wider">{link.label}</p>
                                        <p className="text-[6px] font-bold text-slate-500 tracking-tight">{link.desc}</p>
                                      </div>
                                      <ChevronRight size={10} className="text-slate-500" />
                                    </div>
                                  ))}
                                </div>

                                {/* Mini Lead capture */}
                                <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 text-center">
                                  <p className="text-[7px] font-black text-white uppercase tracking-wider leading-none">Join the Ember Crew</p>
                                  <p className="text-[6px] text-slate-500 leading-tight font-medium">Early access wood-firing alerts direct to you.</p>
                                  <div className="flex gap-1">
                                    <input
                                      type="email"
                                      disabled
                                      placeholder="your@email.com"
                                      className="flex-1 bg-slate-950 border border-white/5 rounded px-2 py-1 text-[7px] text-slate-400 placeholder:text-slate-700 focus:outline-none"
                                    />
                                    <button disabled className="bg-orange-500 text-white px-2.5 py-1 rounded text-[7px] font-black uppercase tracking-widest">
                                      Join
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              /* State 3: BYOL Premium Redirect Resolver Gateway */
                              <motion.div
                                key="phone-byol-gateway"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col justify-between items-center text-center p-3 relative h-full w-full"
                              >
                                {/* Glowing ambient background */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none rounded-full" />
                                
                                <div className="space-y-4 w-full pt-2 z-10">
                                  {/* Target Logo/Globe indicator */}
                                  <div className="w-11 h-11 bg-slate-900 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto shadow-lg shadow-green-500/5">
                                    <Globe size={18} className="animate-[pulse_3s_infinite]" />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[6px] font-black text-green-400 uppercase tracking-widest">
                                      Attribution Secured
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase italic tracking-tight truncate max-w-[180px]">
                                      {customUrl ? customUrl.replace(/^https?:\/\/(www\.)?/i, '') : 'john-artisan-wood.com'}
                                    </h4>
                                    <p className="text-[7px] text-slate-500 font-semibold max-w-[150px] mx-auto leading-relaxed">
                                      Destination verified and physical attribution logged.
                                    </p>
                                  </div>

                                  {/* Speed Attribution Telemetry */}
                                  <div className="p-3 bg-slate-900/60 border border-white/5 rounded-2xl text-left space-y-2 font-mono text-[7px] w-full">
                                    <div className="flex justify-between border-b border-white/5 pb-1 text-slate-500">
                                      <span>LATENCY RESOLVE:</span>
                                      <span className="text-green-400 font-black">180ms (&lt;200ms Verified)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1 text-slate-500">
                                      <span>TARGET ROUTED:</span>
                                      <span className="text-orange-400 font-bold truncate max-w-[100px]">
                                        {customUrl || 'https://john-artisan-wood.com'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                      <span>MAP TELEMETRY:</span>
                                      <span className="text-blue-400 font-bold uppercase">Node Registered</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Active Redirect CTA inside the mobile screen */}
                                <div className="w-full space-y-2 pb-2 z-10">
                                  <a
                                    href={
                                      customUrl
                                        ? (customUrl.startsWith('http://') || customUrl.startsWith('https://')
                                          ? customUrl
                                          : `https://${customUrl}`)
                                        : 'https://sparkstation.link'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-slate-950 font-black rounded-xl transition-all uppercase text-[8px] tracking-widest shadow-lg shadow-green-500/20 flex items-center justify-center gap-1.5"
                                  >
                                    Test Live Redirection <ExternalLink size={10} />
                                  </a>
                                  <p className="text-[6px] text-slate-600 font-medium leading-normal max-w-[180px] mx-auto">
                                    A physical NFC tap triggers a browser new tab. Tap above to test this redirection path.
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
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
                    recentActivity={recentActivityState}
                    pageViews={DEMO_PAGE_VIEWS}
                    leads={DEMO_LEADS}
                    assets={demoAssetsState}
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
                      <Sparkles size={16} className="text-orange-500 shrink-0 animate-pulse" />
                      <span className="text-xs font-black text-slate-300">
                        Previewing the <span className="text-orange-500">Microsite Builder</span> — changes are statefully saved in your browser session!
                      </span>
                    </div>
                    <a
                      href="https://tap.sparkstation.link/login"
                      onClick={(e) => {
                        e.preventDefault();
                        const browserId = localStorage.getItem('spark_browser_session') || '';
                        const username = demoProfileState?.username || '';
                        let url = 'https://tap.sparkstation.link/login';
                        const params = [];
                        if (browserId) params.push(`browser_id=${encodeURIComponent(browserId)}`);
                        if (username) params.push(`handle=${encodeURIComponent(username)}`);
                        if (params.length > 0) url += `?${params.join('&')}`;
                        window.location.href = url;
                      }}
                      className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0 hover:underline"
                    >
                      Claim Your Handle & Go Live <ArrowRight size={11} />
                    </a>
                  </div>
                  <MicrositeEditor
                    initialData={demoProfileState}
                    onSave={(updatedData) => {
                      setDemoProfileState(updatedData);
                      showToast('⚡ Branding profile saved to browser session!', 'success');
                    }}
                    onUpgrade={() => showToast('Sign up for Pro to unlock advanced themes')}
                    linkLibrary={demoProfileState.links || []}
                    onAddLink={(link) => {
                      setDemoProfileState(prev => ({
                        ...prev,
                        links: [...(prev.links || []), link]
                      }));
                      showToast('⚡ Custom link added to sandbox profile!', 'success');
                    }}
                    onDeleteLink={(linkId) => {
                      setDemoProfileState(prev => ({
                        ...prev,
                        links: (prev.links || []).filter(l => l.id !== linkId)
                      }));
                      showToast('⚡ Link removed from sandbox profile!', 'success');
                    }}
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
                            onClick={handleExportCSV}
                            className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </header>

                      <div className="space-y-4">
                        {leadsState.map((lead) => {
                          const isExpanded = expandedDemoLeadId === lead.id;
                          return (
                            <DemoLeadRow
                              key={lead.id}
                              lead={lead}
                              isExpanded={isExpanded}
                              onToggleExpand={() => setExpandedDemoLeadId(isExpanded ? null : lead.id)}
                              leadNotesState={leadNotesState}
                              onSaveNote={handleSaveNote}
                              onReply={handleReply}
                            />
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

      {/* ── CONVERSION MODAL ── */}
      <AnimatePresence>
        {showConversionModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConversionModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg glass border border-orange-500/30 rounded-[3rem] p-8 md:p-10 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden text-center"
            >
              {/* Radial glow background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner text-orange-500 animate-bounce">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                ⚡ NFC Tap Routed & Tracked!
              </h2>

              {/* Speed Telemetry Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest font-mono">
                  Latency: 180ms (Sub-200ms Verified)
                </span>
              </div>

              {/* URL and Routing Telemetry */}
              <div className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl text-left space-y-2 mb-6 font-mono text-[10px]">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500 uppercase font-black">Destination Link:</span>
                  <span className="text-orange-400 truncate max-w-[200px]">{latestSimulatedUrl}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500 uppercase font-black">Attribution Speed:</span>
                  <span className="text-green-400 font-bold">Lightning-Fast (t &lt; 200ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-black">Geo Logging Status:</span>
                  <span className="text-blue-400 uppercase font-bold">Map Pin Dropped Live</span>
                </div>
              </div>

              {/* PDF Copy Hook */}
              <p className="text-slate-300 font-medium text-xs leading-relaxed mb-8">
                That transaction just traversed the SparkStation redirect array in 180ms, logging precise geographical analytics immediately. Imagine your audience performing this action in the physical environment using one of our handmade, ultra-rugged keychains or surface-safe tags. No matter where you route them, you possess the metrics. Let's deploy your hardware.
              </p>

              {/* High-Converting CTA Buttons */}
              <div className="space-y-3.5">
                <a
                  href="/checkout"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to Stripe Checkout for the SparkStation Starter Bundle ($48.00).");
                  }}
                  className="block w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/30 text-center"
                >
                  Grab Your SparkStation Starter Bundle →
                </a>
                <button
                  onClick={() => setShowConversionModal(false)}
                  className="block w-full py-4 glass border border-white/5 hover:border-white/20 text-slate-400 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
                >
                  Continue Testing Cockpit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
