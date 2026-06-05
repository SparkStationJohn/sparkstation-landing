import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Settings, LogOut, Plus, Link as LinkIcon, Cpu, CheckCircle2, AlertCircle, Edit3, 
  BarChart3, Activity, Zap, Home, Globe, TrendingUp, Trophy, RefreshCw, 
  Download, User, Share2, Trash2, Save, Mail, Phone, ExternalLink, ChevronDown, 
  PlusCircle, Smartphone, HelpCircle, Menu, X, Bell, Sun, Moon, Copy, LayoutDashboard,
  Loader2, Filter, Search, Terminal as TerminalIcon, Radio, Shield, Wifi, AlertTriangle, Package,
  Calendar, ToggleLeft, PowerOff, QrCode
} from 'lucide-react';
import { sb } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import SocialIcon from './SocialIcon';
import { useTheme } from '../context/ThemeContext';
import { QRCodeCanvas } from 'qrcode.react';

// Sub-components
import ActivationModal from './ActivationModal';
import SparkMap from './SparkMap';
import Analytics from './Analytics';
import MicrositeEditor from './MicrositeEditor';
import OnboardingTutorial from './OnboardingTutorial';

const NavButton = ({ active, onClick, icon, label, dataOnboard }) => (
  <button 
    data-onboard={dataOnboard}
    onClick={onClick}
    className={`sidebar-nav-btn relative w-full flex items-center gap-4 px-6 py-2.5 lg:py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-orange-500/10 text-orange-500 shadow-sm' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="activeNav"
        className="absolute left-2 w-1 h-6 bg-orange-500 rounded-full"
      />
    )}
    <div className={`${active ? 'text-orange-500' : 'text-slate-500 group-hover:text-orange-500'} transition-colors`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-orange-500' : ''}`}>{label}</span>
  </button>
);

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('devices');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showMicrositeEditor, setShowMicrositeEditor] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [customDomain, setCustomDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reintegrated State from useDashboardData
  const [assets, setAssets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [linkLibrary, setLinkLibrary] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [leads, setLeads] = useState([]);
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [leadNotes, setLeadNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fleet Sync State
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [syncSource, setSyncSource] = useState(null);

  // Identity / Notifications / Orders State
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [notifSettings, setNotifSettings] = useState({ push_enabled: true, email_enabled: false });
  const [isSavingNotif, setIsSavingNotif] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async (silent = false) => {
    if (!user?.id) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      // 1. Fetch Assets
      const { data: assetData } = await sb
        .from('assets')
        .select('id, serial_number, owner_id, model_version, nickname, tap_count, status, device_type, redirects(id, destination_url, destination_url_b, mode, webhook_url, config)')
        .eq('owner_id', user.id);
      setAssets(assetData || []);

      // 2. Fetch Profile
      const { data: profileData } = await sb
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile({ ...profileData, social_links: profileData.social_links || [] });
      } else {
        setProfile({ id: user.id, business_name: '', bio: '', social_links: [] });
      }

      // 3. Fetch Link Library
      const { data: libraryData } = await sb
        .from('link_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const socialLinks = (profileData?.social_links || [])
        .filter(s => s.url)
        .map(s => ({
          id: `__social__${s.platform}`,
          url: s.url,
          label: s.platform,
          platform: s.platform,
          source: 'social',
        }));
      setLinkLibrary([...socialLinks, ...(libraryData || [])]);

      // 4. Fetch Taps
      const { data: tapData } = await sb
        .from('taps')
        .select(`id, created_at, lat, lng, city, country, metadata, assets!inner(id, serial_number, nickname, owner_id)`)
        .eq('assets.owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);
      setRecentActivity(tapData || []);

      // 5. Fetch Leads
      const { data: leadsData } = await sb
        .from('leads')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      setLeads(leadsData || []);
      const notesMap = {};
      (leadsData || []).forEach(l => { if (l.notes) notesMap[l.id] = l.notes; });
      setLeadNotes(notesMap);

      // 6. Fetch Page Views
      const { data: pageViewData } = await sb
        .from('page_views')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1000);
      setPageViews(pageViewData || []);

      // 7. Fetch Orders
      const { data: ordersData } = await sb
        .from('purchases')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(ordersData || []);

    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Realtime Uplink
  useEffect(() => {
    if (!user?.id || !assets.length) return;

    const channel = sb
      .channel('live-mission-control')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'taps' },
        (payload) => {
          const asset = assets.find(a => a.id === payload.new.asset_id);
          if (asset) {
            const location = payload.new.city ? `${payload.new.city}, ${payload.new.country}` : 'Location Unknown';
            showToast(`LIVE INTERACTION: ${asset.nickname || asset.serial_number} in ${location}`, 'success');
            fetchAll(true);
          }
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [user?.id, assets]);

  const updateAssetMission = async (assetId, missionData) => {
    try {
      const { data: existing } = await sb
        .from('redirects')
        .select('id')
        .eq('asset_id', assetId)
        .single();

      let error;
      if (existing) {
        ({ error } = await sb
          .from('redirects')
          .update({ ...missionData })
          .eq('id', existing.id));
      } else {
        ({ error } = await sb
          .from('redirects')
          .insert({ asset_id: assetId, ...missionData }));
      }

      if (error) throw error;
      showToast('MISSION DATA UPLINKED', 'success');
      fetchAll(true);
      return true;
    } catch (err) {
      console.error('Update Mission Error:', err);
      showToast('MISSION UPLINK FAILED', 'error');
      return false;
    }
  };

  const handleCopyMission = (id, missionData) => {
    setSyncSource({ id, missionData });
    showToast('MISSION COPIED TO CLIPBOARD', 'success');
  };

  const toggleAssetSelection = (id) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSyncFleet = async () => {
    if (!syncSource || !selectedAssets.length) return;
    
    setIsRefreshing(true);
    showToast(`DEPLOYING MISSION TO ${selectedAssets.length} STATIONS...`, 'success');
    
    try {
      for (const assetId of selectedAssets) {
        const { data: existing } = await sb
          .from('redirects')
          .select('id')
          .eq('asset_id', assetId)
          .single();

        if (existing) {
          await sb.from('redirects').update({
            ...syncSource.missionData
          }).eq('id', existing.id);
        } else {
          await sb.from('redirects').insert({
            asset_id: assetId,
            ...syncSource.missionData
          });
        }
      }
      showToast('FLEET SYNCHRONIZED SUCCESSFULLY', 'success');
      setSelectedAssets([]);
      setSyncSource(null);
      fetchAll(true);
    } catch (err) {
      showToast('FLEET SYNC FAILED', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const addLibraryLink = async (linkData) => {
    try {
      const { error } = await sb
        .from('link_library')
        .insert({ user_id: user.id, ...linkData });
      
      if (error) throw error;
      showToast('LINK SECURED IN VAULT', 'success');
      fetchAll(true);
      return true;
    } catch (err) {
      showToast('VAULT UPLINK FAILED', 'error');
      return false;
    }
  };

  const deleteLibraryLink = async (linkId) => {
    try {
      const { error } = await sb
        .from('link_library')
        .delete()
        .eq('id', linkId);
      
      if (error) throw error;
      showToast('LINK REMOVED FROM VAULT', 'success');
      fetchAll(true);
      return true;
    } catch (err) {
      showToast('DELETION FAILED', 'error');
      return false;
    }
  };

  useEffect(() => {
    if (profile?.custom_domain) {
      setCustomDomain(profile.custom_domain);
    }
  }, [profile?.custom_domain]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        business_name: profile.business_name || '',
        bio: profile.bio || '',
        username: profile.username || '',
        logo_url: profile.logo_url || '',
      });
      setNotifSettings(profile.notification_settings || { push_enabled: true, email_enabled: false });
    }
  }, [profile?.id]);

  const saveProfile = async () => {
    if (!profileForm) return;
    setIsSavingProfile(true);
    try {
      const { error } = await sb.from('profiles').update({
        business_name: profileForm.business_name,
        bio: profileForm.bio,
        username: profileForm.username,
        logo_url: profileForm.logo_url,
      }).eq('id', user.id);
      if (error) throw error;
      showToast('IDENTITY UPLINKED', 'success');
      fetchAll(true);
    } catch {
      showToast('SAVE FAILED', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const deactivateAsset = async (asset) => {
    if (!window.confirm(`Deactivate ${asset.nickname || asset.serial_number}? This will disable all taps.`)) return;
    setIsDeactivating(asset.id);
    try {
      const { error } = await sb.from('assets').update({ status: 'inactive' }).eq('id', asset.id);
      if (error) throw error;
      showToast('STATION DEACTIVATED', 'success');
      fetchAll(true);
    } catch {
      showToast('DEACTIVATION FAILED', 'error');
    } finally {
      setIsDeactivating(null);
    }
  };

  const handleSaveMicrosite = async (profileData) => {
    try {
      const { error } = await sb.from('profiles').update({
        template_id: profileData.template_id,
        social_links: profileData.social_links,
        notification_settings: profileData.notification_settings,
        username: profileData.username,
        bio: profileData.bio,
        full_name: profileData.full_name,
        logo_url: profileData.logo_url,
        content_data: profileData.content_data,
        custom_domain: profileData.custom_domain,
        is_public: profileData.is_public,
      }).eq('id', user.id);
      
      if (error) {
        if (error.code === '23505') throw new Error('HANDLE_TAKEN');
        throw error;
      }

      showToast('IDENTITY UPLINKED', 'success');
      fetchAll(true);
    } catch (err) {
      if (err.message === 'HANDLE_TAKEN') {
        showToast('HANDLE ALREADY CLAIMED', 'error');
      } else {
        showToast('SAVE FAILED', 'error');
      }
    }
  };

  const saveLeadNote = async (leadId) => {
    setSavingNoteId(leadId);
    try {
      await sb.from('leads').update({ notes: leadNotes[leadId] || '' }).eq('id', leadId);
      showToast('Note saved', 'success');
    } catch (e) {
      showToast('Failed to save note', 'error');
    } finally {
      setSavingNoteId(null);
    }
  };

  const saveNotifications = async () => {
    setIsSavingNotif(true);
    try {
      const { error } = await sb.from('profiles').update({
        notification_settings: notifSettings
      }).eq('id', user.id);
      if (error) throw error;
      showToast('PREFERENCES SAVED', 'success');
    } catch {
      showToast('SAVE FAILED', 'error');
    } finally {
      setIsSavingNotif(false);
    }
  };

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'enterprise';
  const fleetLimit = profile?.subscription_tier === 'enterprise' ? Infinity : profile?.subscription_tier === 'pro' ? 100 : profile?.subscription_tier === 'automate' ? 25 : 2;

  const handleBillingPortal = async () => {
    try {
      showToast('ESTABLISHING SECURE BILLING LINK...', 'success');
      const response = await fetch('/.netlify/functions/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch (err) {
      showToast('PORTAL LINK FAILED', 'error');
    }
  };

  const handleVerifyDomain = async () => {
    if (!customDomain) return;
    setIsVerifying(true);
    try {
      const { error } = await sb
        .from('profiles')
        .update({ custom_domain: customDomain, domain_verified: false })
        .eq('id', user.id);
      
      if (error) throw error;
      showToast('DOMAIN LINKED. AWAITING PROPAGATION.', 'success');
    } catch (err) {
      showToast('DOMAIN UPLINK FAILED', 'error');
    } finally {
      setIsVerifying(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        <Zap className="text-orange-500 animate-pulse mb-4" size={48} />
        <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Establishing Uplink</div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] selection:bg-orange-500/30 overflow-x-hidden transition-colors duration-300">
      <Helmet>
        <title>Command Center | SparkStation</title>
        <meta name="description" content="Manage your smart hardware fleet and real-time interaction telemetry." />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-[var(--border-subtle)] px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="p-3 glass rounded-2xl border border-white/5 text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all" title="Home">
            <Home size={18} />
          </Link>
          <div className="flex flex-col cursor-pointer" onClick={() => setActiveView('devices')}>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">SparkStation</span>
              <div className={`w-1.5 h-1.5 rounded-full lg:hidden ${isRefreshing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
            <span className="text-[9px] font-black tracking-[0.4em] text-orange-500 uppercase mt-1 px-0.5">Command Center</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 px-6 py-2 bg-white/5 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Link Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-3 glass rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-all">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative group">
            <button className="w-12 h-12 glass rounded-2xl border border-white/5 p-1 transition-all hover:border-orange-500/50 overflow-hidden">
              <img 
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-xl"
              />
            </button>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-4 text-white">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <main className="mt-24 h-[calc(100vh-6rem)] flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:h-full lg:shrink-0 lg:overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-[100dvh]`}>
          <div className="px-6 pt-4 lg:pt-6 pb-6 h-full flex flex-col overflow-hidden">
            {profile && (
            <div className="mb-6 p-4 glass rounded-2xl border border-white/5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                <img
                  src={profile.logo_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}&backgroundColor=1e293b`}
                  alt={profile.business_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white uppercase tracking-tight truncate leading-none mb-0.5">
                  {profile.business_name || user.email?.split('@')[0] || 'My Account'}
                </p>
                {profile.username && (
                  <p className="text-[9px] font-bold text-slate-500 truncate">@{profile.username}</p>
                )}
              </div>
              <div className="shrink-0 px-2 py-1 bg-orange-500/10 rounded-lg border border-orange-500/10">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">
                  {profile.subscription_tier || 'free'}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              <NavButton dataOnboard="sidebar-devices" active={activeView === 'devices'} onClick={() => { setActiveView('devices'); setIsSidebarOpen(false); }} icon={<Cpu size={18} />} label="Stations" />
              <NavButton dataOnboard="sidebar-identity" active={activeView === 'identity'} onClick={() => { setActiveView('identity'); setIsSidebarOpen(false); }} icon={<User size={18} />} label="Edit My Profile" />
              <NavButton dataOnboard="sidebar-notifications" active={activeView === 'notifications'} onClick={() => { setActiveView('notifications'); setIsSidebarOpen(false); }} icon={<Bell size={18} />} label="Alert Center" />
              <NavButton dataOnboard="sidebar-orders" active={activeView === 'orders'} onClick={() => { setActiveView('orders'); setIsSidebarOpen(false); }} icon={<Package size={18} />} label="Order History" />
              <NavButton dataOnboard="sidebar-leads" active={activeView === 'leads'} onClick={() => { setActiveView('leads'); setIsSidebarOpen(false); }} icon={<Mail size={18} />} label="Leads" />
              <NavButton dataOnboard="sidebar-links" active={activeView === 'links'} onClick={() => { setActiveView('links'); setIsSidebarOpen(false); }} icon={<LinkIcon size={18} />} label="Link Vault" />
              <NavButton dataOnboard="sidebar-analytics" active={activeView === 'analytics'} onClick={() => { if (isPro) { setActiveView('analytics'); setIsSidebarOpen(false); } else { showToast('UPGRADE TO PRO FOR ANALYTICS', 'error'); } }} icon={<BarChart3 size={18} />} label="Analytics" />
              <NavButton dataOnboard="sidebar-account" active={activeView === 'account'} onClick={() => { setActiveView('account'); setIsSidebarOpen(false); }} icon={<Settings size={18} />} label="Account & Billing" />
            </div>

            <div className="shrink-0 space-y-3 lg:space-y-6 pt-4 lg:pt-6 border-t border-white/5">
              <div className="p-4 lg:p-6 glass rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet Usage</span>
                  <span className="text-xs font-black text-orange-500">{assets.length}/{fleetLimit === Infinity ? '∞' : fleetLimit}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div style={{ width: `${(assets.length / fleetLimit) * 100}%` }} className="h-full bg-orange-500" />
                </div>
              </div>
              <button onClick={() => setShowOnboarding(true)} className="w-full flex items-center gap-4 px-6 py-2.5 lg:py-4 text-slate-500 hover:text-white transition-all rounded-2xl hover:bg-white/5">
                <HelpCircle size={18} />
                <span className="text-sm font-bold">Interactive Guide</span>
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-2.5 lg:py-4 text-slate-500 hover:text-red-400 transition-all rounded-2xl hover:bg-red-500/5">
                <LogOut size={18} />
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 md:p-12 max-w-7xl mx-auto pb-32">
            <AnimatePresence mode="wait">
              {activeView === 'devices' && (
                <motion.div key="devices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                   <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none mb-2">Active Fleet</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                           System Health: Optimal <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </p>
                      </div>
                      <button onClick={() => setIsModalOpen(true)} className="shrink-0 px-6 md:px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <Plus size={18} /> Deploy New Station
                      </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 items-start">
                      {assets.map(asset => (
                        <AssetCard 
                          key={asset.id} 
                          asset={asset} 
                          updateAssetMission={updateAssetMission}
                          linkLibrary={linkLibrary}
                          isSelected={selectedAssets.includes(asset.id)}
                          onSelect={() => toggleAssetSelection(asset.id)}
                          onCopyMission={handleCopyMission}
                          subscriptionTier={profile?.subscription_tier || 'free'}
                          onDeactivate={deactivateAsset}
                          onToast={showToast}
                        />
                      ))}
                    </div>

                    {/* Fleet Command Bar (Clipboard Logic) */}
                    <AnimatePresence>
                      {(selectedAssets.length > 0 || syncSource) && (
                        <motion.div 
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 100, opacity: 0 }}
                          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6"
                        >
                          <div className="glass p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-orange-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Target Fleet</span>
                                   <span className="text-2xl font-black text-white italic">{selectedAssets.length} Stations</span>
                                </div>
                                {syncSource && (
                                   <div className="h-10 w-px bg-white/10" />
                                )}
                                {syncSource && (
                                   <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mission Clipboard</span>
                                      <span className="text-sm font-bold text-white truncate max-w-[150px]">
                                         {syncSource.missionData.mode === 'profile' ? 'SparkProfile' : syncSource.missionData.destination_url}
                                      </span>
                                   </div>
                                )}
                             </div>

                             <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button 
                                  onClick={() => { setSelectedAssets([]); setSyncSource(null); }}
                                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white font-black rounded-xl transition-all uppercase text-[9px] tracking-widest"
                                >
                                   Clear
                                </button>
                                <button 
                                  disabled={!syncSource || selectedAssets.length === 0 || isRefreshing}
                                  onClick={handleSyncFleet}
                                  className={`px-8 py-4 font-black rounded-xl transition-all uppercase text-[10px] tracking-widest flex items-center gap-2 ${
                                    !syncSource || selectedAssets.length === 0 || isRefreshing
                                      ? 'bg-white/5 text-slate-700 cursor-not-allowed'
                                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20'
                                  }`}
                                >
                                   {isRefreshing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />} Deploy Mission
                                </button>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </motion.div>
              )}

              {activeView === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Analytics
                    recentActivity={recentActivity}
                    pageViews={pageViews}
                    leads={leads}
                    assets={assets}
                  />
                </motion.div>
              )}

              {activeView === 'links' && (
                <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div data-onboard="link-vault-area" className="glass p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px]" />
                      <div className="relative z-10">
                        <header className="flex justify-between items-center mb-12">
                           <div>
                              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Link Vault</h2>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Managed Hardware Redirect Assets</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Assets</p>
                              <p className="text-2xl font-black text-white italic">{linkLibrary.length}</p>
                           </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                           <div className="lg:col-span-1">
                              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6 sticky top-8">
                                 <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <PlusCircle size={14} className="text-orange-500" /> Secure New Asset
                                 </h4>
                                 <div className="space-y-4">
                                    <div>
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Asset Title</label>
                                       <input 
                                          id="new-link-title"
                                          type="text" 
                                          placeholder="E.G. MAIN PORTFOLIO"
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                                       />
                                    </div>
                                    <div>
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Destination URL</label>
                                       <input 
                                          id="new-link-url"
                                          type="text" 
                                          placeholder="HTTPS://..."
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                                       />
                                    </div>
                                    <button 
                                       onClick={async () => {
                                          const label = document.getElementById('new-link-title').value;
                                          const url = document.getElementById('new-link-url').value;
                                          if (label && url) {
                                             const success = await addLibraryLink({ label, url });
                                             if (success) {
                                                document.getElementById('new-link-title').value = '';
                                                document.getElementById('new-link-url').value = '';
                                             }
                                          } else {
                                             showToast('MISSING INTEL', 'error');
                                          }
                                       }}
                                       className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20"
                                    >
                                       Lock In Vault
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="lg:col-span-2 space-y-4">
                              {linkLibrary.map((link) => (
                                 <div key={link.id} className="group bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all flex justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 min-w-0">
                                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-orange-500 transition-colors shrink-0">
                                          <LinkIcon size={20} />
                                       </div>
                                       <div className="min-w-0">
                                          <h4 className="text-sm font-black text-white uppercase italic leading-none mb-1 truncate">{link.label}</h4>
                                          <p className="text-[10px] font-bold text-slate-500 tracking-tight truncate">{link.url}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button 
                                          onClick={() => {
                                             navigator.clipboard.writeText(link.url);
                                             showToast('COPIED TO CLIPBOARD');
                                          }}
                                          className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-all"
                                       >
                                          <Copy size={16} />
                                       </button>
                                       <button 
                                          onClick={() => deleteLibraryLink(link.id)}
                                          className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-500 hover:text-red-500 transition-all"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </div>
                              ))}

                              {linkLibrary.length === 0 && (
                                 <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                    <LinkIcon size={48} className="text-slate-800 mx-auto mb-6" />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vault Empty • No Assets Secured</p>
                                 </div>
                              )}
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeView === 'leads' && (
                <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="glass p-12 rounded-[3rem] border border-white/5">
                        <header className="flex justify-between items-center mb-12">
                           <div>
                              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Leads Vault</h2>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Client Acquisition Data</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Captures</p>
                                 <p className="text-2xl font-black text-white italic">{leads.length}</p>
                              </div>
                              <button className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all">
                                 <Download size={20} />
                              </button>
                           </div>
                        </header>

                        <div className="space-y-4">
                           {leads.map((lead, i) => {
                             const isExpanded = expandedLeadId === lead.id;
                             return (
                               <div key={lead.id || i} className="group bg-slate-900/50 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all overflow-hidden">
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
                                     <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{new Date(lead.created_at).toLocaleDateString()}</p>
                                     <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{lead.metadata?.phone || 'NO PHONE'}</p>
                                   </div>
                                   <div className="flex items-center gap-2 shrink-0">
                                     <a
                                       href={`mailto:${lead.email}?subject=${encodeURIComponent(`Following up — ${lead.name}`)}`}
                                       className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all uppercase text-[9px] font-black tracking-widest flex items-center gap-2"
                                     >
                                       <Mail size={14} /> Reply
                                     </a>
                                     <button
                                       onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
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
                                           value={leadNotes[lead.id] || ''}
                                           onChange={e => setLeadNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                           placeholder="Add notes, follow-up reminders, or context about this lead..."
                                           rows={3}
                                           className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 resize-none transition-all font-medium"
                                         />
                                         <div className="flex justify-end">
                                           <button
                                             onClick={() => saveLeadNote(lead.id)}
                                             disabled={savingNoteId === lead.id}
                                             className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                                           >
                                             {savingNoteId === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                             Save Note
                                           </button>
                                         </div>
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>
                             );
                           })}
                           
                           {leads.length === 0 && (
                             <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                <Mail size={48} className="text-slate-800 mx-auto mb-6" />
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vault Empty • Awaiting Incoming Leads</p>
                             </div>
                           )}
                        </div>
                   </div>
                </motion.div>
              )}

              {activeView === 'identity' && profile && (
                <motion.div key="identity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} data-onboard="profile-editor-area">
                  <header className="mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Edit My Profile</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Microsite Builder & Identity Engine</p>
                  </header>
                  <MicrositeEditor
                    initialData={profile}
                    onSave={handleSaveMicrosite}
                    onUpgrade={handleBillingPortal}
                    linkLibrary={linkLibrary}
                    onAddLink={addLibraryLink}
                    onDeleteLink={deleteLibraryLink}
                  />
                </motion.div>
              )}

              {activeView === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl space-y-8">
                  <div className="glass p-12 rounded-[3rem] border border-white/5">
                      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Alert Center</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-12">Real-Time Interaction Notifications</p>
                      <div className="space-y-4">
                        {[
                          { key: 'push_enabled', label: 'Push Notifications', desc: 'Browser push alerts when your fleet is tapped' },
                          { key: 'email_enabled', label: 'Email Alerts', desc: 'Email digest of daily fleet interactions' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all">
                            <div>
                              <p className="text-sm font-black text-white uppercase">{label}</p>
                              <p className="text-[10px] text-slate-500 font-bold mt-1">{desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifSettings(n => ({...n, [key]: !n[key]}))}
                              className={`relative w-14 h-7 rounded-full transition-all ${notifSettings[key] ? 'bg-orange-500' : 'bg-white/10'}`}
                            >
                              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200 ${notifSettings[key] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button onClick={saveNotifications} disabled={isSavingNotif} className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-2">
                          {isSavingNotif ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Preferences
                        </button>
                      </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="glass p-12 rounded-[3rem] border border-white/5">
                      <header className="flex justify-between items-center mb-12">
                        <div>
                          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Order History</h2>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware & Subscription Purchases</p>
                        </div>
                        <p className="text-2xl font-black text-white italic">{orders.length}</p>
                      </header>
                      <div className="space-y-4">
                        {orders.map((order, i) => (
                          <div key={i} className="group bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                                  <Package size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-white uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{Array.isArray(order.items) ? order.items.length : 0} item(s)</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 flex-wrap">
                                {order.tracking_number && (
                                  <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tracking</p>
                                    <p className="text-xs font-bold text-white">{order.tracking_number}</p>
                                  </div>
                                )}
                                <div className="text-right">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total</p>
                                  <p className="text-lg font-black text-white italic">${order.total_amount}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  {order.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <Package size={48} className="text-slate-800 mx-auto mb-6" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Orders Yet • Visit the Shop</p>
                          </div>
                        )}
                      </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'account' && (
                <motion.div key="account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl space-y-8">
                   <div className="glass p-12 rounded-[3rem] border border-white/5">
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Command Intelligence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                           <div className="space-y-6">
                              <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Tier</div>
                                 <div className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">{(profile?.subscription_tier || 'free').toUpperCase()}</div>
                                 <button onClick={handleBillingPortal} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all border border-white/5 uppercase text-[10px] tracking-widest">
                                    Manage Subscription
                                 </button>
                              </div>
                           </div>
                           <div className="space-y-6">
                               <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Custom Domain</div>
                                  <div className="space-y-4">
                                     <div className="flex items-center gap-2 mb-2">
                                        <Globe size={18} className="text-orange-500" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">
                                          {profile?.custom_domain || 'None Configured'}
                                        </span>
                                        {profile?.domain_verified && (
                                          <CheckCircle2 size={14} className="text-green-500" />
                                        )}
                                     </div>
                                     <input 
                                        type="text" 
                                        value={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                                        placeholder="EX: LINKS.YOURBRAND.COM"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                                     />
                                     <button 
                                        onClick={handleVerifyDomain}
                                        disabled={isVerifying || !isPro}
                                        className={`w-full py-4 font-black rounded-xl transition-all uppercase text-[10px] tracking-widest ${
                                          isPro ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                        }`}
                                     >
                                        {isVerifying ? 'Verifying...' : 'Link Domain'}
                                     </button>
                                     {!isPro && (
                                       <p className="text-[8px] font-bold text-orange-500/50 uppercase tracking-widest text-center mt-2">
                                         Requires Pro Subscription
                                       </p>
                                     )}
                                  </div>
                               </div>
                            </div>
                        </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ActivationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => fetchAll(true)} userId={user.id} />
      
      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} onNavigate={setActiveView} />}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 right-8 z-[110]">
            <div className={`glass px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              {toast.type === 'error' ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}
              <span className="font-bold text-sm tracking-tight text-white">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LinkSelect({ value, onChange, linkLibrary = [], placeholder = '— Select Link —' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    ...linkLibrary.map(l => ({ value: l.url, label: l.label })),
    { value: '__custom__', label: '+ Enter Custom URL' },
  ];
  const selected = options.find(o => o.value === value && value !== '__custom__');

  const getLabel = (l) => l.label || (() => { try { return new URL(l.url).hostname; } catch { return l.url; } })();

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-left font-black uppercase outline-none focus:border-orange-500 flex items-center justify-between gap-2 transition-colors hover:border-white/20"
      >
        <span style={{ color: selected ? '#fb923c' : '#94a3b8' }}>{selected ? getLabel(linkLibrary.find(l => l.url === value) || {}) : placeholder}</span>
        <ChevronDown size={12} style={{ color: '#94a3b8' }} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {linkLibrary.length === 0 && (
            <div className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest italic" style={{ color: '#94a3b8' }}>No links in vault yet</div>
          )}
          {linkLibrary.map(l => (
            <button key={l.id} type="button"
              onClick={() => { onChange(l.url); setOpen(false); }}
              className="w-full px-4 py-3 text-left text-[10px] font-black uppercase transition-all hover:bg-white/10 flex items-center gap-2"
              style={{ color: value === l.url ? '#fb923c' : '#f1f5f9' }}>
              {l.platform
                ? <SocialIcon platform={l.platform} size={12} className="shrink-0" style={{ color: '#94a3b8' }} />
                : <LinkIcon size={10} className="shrink-0" style={{ color: '#94a3b8' }} />
              }
              {getLabel(l)}
            </button>
          ))}
          <button type="button"
            onClick={() => { onChange('__custom__'); setOpen(false); }}
            className="w-full px-4 py-3 text-left text-[10px] font-black uppercase hover:bg-white/10 transition-all border-t border-white/10 flex items-center gap-2"
            style={{ color: '#cbd5e1' }}>
            <Plus size={10} className="shrink-0" />Enter Custom URL
          </button>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset, updateAssetMission, linkLibrary, isSelected, onSelect, onCopyMission, subscriptionTier = 'free', onDeactivate, onToast }) {
  const initR = asset.redirects?.[0];
  const profileUrl = `/p/${asset.owner_id || ''}`;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nickname, setNickname] = useState(asset.nickname || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const [missionMode, setMissionMode] = useState(initR?.mode || 'static');
  const [missionUrl, setMissionUrl] = useState(initR?.destination_url || '');
  const [missionUrlB, setMissionUrlB] = useState(initR?.destination_url_b || '');
  const [webhookUrl, setWebhookUrl] = useState(initR?.webhook_url || '');
  const [scheduleConfig, setScheduleConfig] = useState(initR?.config || { start_hour: 18, end_hour: 6, target_days: [] });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showCustomInputB, setShowCustomInputB] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const isAdvanced = subscriptionTier === 'automate' || subscriptionTier === 'pro' || subscriptionTier === 'enterprise';
  const isMyProfile = missionMode === 'static' && missionUrl === profileUrl;

  const handleModeSelect = (mode) => {
    if (!isAdvanced && (mode === 'night_shift' || mode === 'weekend' || mode === 'webhook')) {
      onToast?.('Advanced Modes require AUTOMATE Tier', 'error');
      return;
    }
    setMissionMode(mode);
  };

  const saveName = async () => {
    setIsSavingName(true);
    try { await sb.from('assets').update({ nickname }).eq('id', asset.id); }
    catch (e) { console.error(e); }
    finally { setIsSavingName(false); setIsEditingName(false); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAssetMission(asset.id, {
        mode: missionMode,
        destination_url: missionUrl,
        destination_url_b: missionUrlB,
        webhook_url: webhookUrl,
        config: scheduleConfig,
      });
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const toggleDay = (i) => {
    const days = scheduleConfig.target_days || [];
    setScheduleConfig(p => ({ ...p, target_days: days.includes(i) ? days.filter(d => d !== i) : [...days, i] }));
  };

  const hourLabel = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

  return (
    <div className={`glass p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border transition-all relative group ${
      isSelected ? 'border-orange-500 bg-orange-500/5' : 'border-white/5'
    }`}>
      {/* Card header row */}
      <div className="flex items-start gap-3 mb-4">
        {/* Checkbox */}
        <button onClick={onSelect} className={`mt-1 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          isSelected ? 'bg-orange-500 border-orange-500' : 'border-white/10 hover:border-white/30'
        }`}>
          {isSelected && <CheckCircle2 size={12} className="text-white" />}
        </button>

        {/* Name + serial */}
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text" value={nickname} autoFocus
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveName(); } if (e.key === 'Escape') { setNickname(asset.nickname || ''); setIsEditingName(false); } }}
                className="bg-slate-950 border border-orange-500/50 rounded-lg px-3 py-1 text-lg font-black text-white uppercase outline-none w-full min-w-0"
              />
              <button onClick={saveName} disabled={isSavingName} className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-black text-[10px] font-black uppercase rounded-lg transition-colors whitespace-nowrap">Save</button>
              <button onClick={() => { setNickname(asset.nickname || ''); setIsEditingName(false); }} className="p-2 text-slate-500 hover:text-white shrink-0"><X size={14} /></button>
            </div>
          ) : (
            <h3 className="text-lg font-black text-white tracking-tighter uppercase truncate">{asset.nickname || asset.serial_number}</h3>
          )}
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{asset.serial_number}</div>
        </div>

        {/* Actions: QR + Edit + status */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setShowQR(v => !v)} className={`p-2 glass border rounded-xl transition-all active:scale-90 ${showQR ? 'border-orange-500/50 text-orange-500' : 'border-white/5 text-slate-500 hover:text-orange-500 hover:border-orange-500/50'}`} title="QR Code">
            <QrCode size={14} />
          </button>
          <button onClick={() => setIsEditingName(true)} className="p-2 glass border border-white/5 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-500/50 transition-all active:scale-90" title="Rename">
            <Edit3 size={14} />
          </button>
          {(asset.tap_count || 0) === 0
            ? <span className="text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10">Fresh</span>
            : <span className="text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/10">Active</span>
          }
        </div>
      </div>

      {/* QR Code Panel */}
      {showQR && (() => {
        const tapUrl = `https://tap.sparkstation.link/${asset.serial_number}`;
        const downloadQR = () => {
          const canvas = document.getElementById(`qr-${asset.id}`);
          if (!canvas) return;
          const link = document.createElement('a');
          link.download = `${asset.serial_number}-QR.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        return (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-5 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center gap-4">
            <div className="p-3 bg-white rounded-xl">
              <QRCodeCanvas id={`qr-${asset.id}`} value={tapUrl} size={140} bgColor="#ffffff" fgColor="#0f172a" level="H" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tap URL</p>
              <p className="text-[9px] font-mono text-orange-400 break-all">{tapUrl}</p>
            </div>
            <button onClick={downloadQR} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
              <Download size={12} /> Download PNG
            </button>
          </motion.div>
        );
      })()}

      {/* Mission config */}
      <div data-onboard="station-config-area" className="space-y-3 mb-4">
        <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Choose Station Mission</label>

        {/* 2×2 mode grid */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setMissionMode('static'); setMissionUrl(profileUrl); setShowCustomInput(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMyProfile ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}>
            <User size={14} /><span className="text-[9px] font-black uppercase">My Profile</span>
          </button>
          <button onClick={() => { setMissionMode('static'); if (isMyProfile) setMissionUrl(''); setShowCustomInput(true); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${!isMyProfile && missionMode === 'static' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}>
            <Globe size={14} /><span className="text-[9px] font-black uppercase">Website</span>
          </button>
          <button onClick={() => handleModeSelect('webhook')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${missionMode === 'webhook' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}>
            <Zap size={14} /><span className="text-[9px] font-black uppercase">Automate</span>
          </button>
          <button onClick={() => handleModeSelect(missionMode === 'weekend' ? 'weekend' : 'night_shift')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${(missionMode === 'night_shift' || missionMode === 'weekend') ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}>
            <ToggleLeft size={14} /><span className="text-[9px] font-black uppercase">Switch</span>
          </button>
        </div>

        {/* Webhook / Automate config */}
        {missionMode === 'webhook' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-orange-500" />
              <label className="text-[9px] font-black text-white uppercase tracking-widest">Automation Trigger (URL)</label>
            </div>
            <input type="text" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-orange-400 font-mono outline-none focus:border-orange-500 transition-all" />
            <p className="text-[8px] text-slate-500 font-bold uppercase leading-tight italic">Tapping this tag fires a background POST to this endpoint with tap telemetry.</p>
          </motion.div>
        )}

        {/* Switch sub-options */}
        {(missionMode === 'night_shift' || missionMode === 'weekend') && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Switch Logic</label>
            <div className="flex gap-2">
              <button onClick={() => setMissionMode('night_shift')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${missionMode === 'night_shift' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}>
                <Moon size={14} /><span className="text-[8px] font-black uppercase">Time Based</span>
              </button>
              <button onClick={() => setMissionMode('weekend')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${missionMode === 'weekend' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}>
                <Calendar size={14} /><span className="text-[8px] font-black uppercase">Day Based</span>
              </button>
            </div>
            <p className="text-[8px] text-slate-600 font-bold uppercase leading-tight italic">
              {missionMode === 'night_shift' ? 'Station switches destinations based on your custom time window.' : 'Station switches destinations based on your selected days.'}
            </p>
            {missionMode === 'night_shift' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block mb-2">Shift Start</label>
                  <select value={scheduleConfig.start_hour ?? 18} onChange={e => setScheduleConfig(p => ({ ...p, start_hour: parseInt(e.target.value) }))}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white font-bold outline-none">
                    {[...Array(24)].map((_, i) => <option key={i} value={i}>{hourLabel(i)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block mb-2">Shift End</label>
                  <select value={scheduleConfig.end_hour ?? 6} onChange={e => setScheduleConfig(p => ({ ...p, end_hour: parseInt(e.target.value) }))}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white font-bold outline-none">
                    {[...Array(24)].map((_, i) => <option key={i} value={i}>{hourLabel(i)}</option>)}
                  </select>
                </div>
              </div>
            )}
            {missionMode === 'weekend' && (
              <div className="space-y-2">
                <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Active Switch Days</label>
                <div className="flex justify-between gap-1">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <button key={i} onClick={() => toggleDay(i)}
                      className={`w-8 h-8 rounded-lg text-[9px] font-black transition-all ${(scheduleConfig.target_days || []).includes(i) ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-600 border border-white/5'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Primary URL (not for webhook, not for My Profile) */}
        {missionMode !== 'webhook' && !isMyProfile && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">
              {missionMode === 'static' ? 'Where should this tap go?' : missionMode === 'night_shift' ? 'Daytime Destination (6AM–6PM)' : 'Weekday Destination (Mon–Fri)'}
            </label>
            {showCustomInput ? (
              <div className="space-y-1">
                <input type="text" autoFocus value={missionUrl} onChange={e => setMissionUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setShowCustomInput(false); }}
                  placeholder="https://..." className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-orange-400 font-mono outline-none focus:border-orange-500 transition-all" />
                <button onClick={() => setShowCustomInput(false)} className="text-[8px] text-slate-500 hover:text-white uppercase font-black">Cancel</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <LinkSelect
                  value={missionUrl}
                  onChange={v => v === '__custom__' ? setShowCustomInput(true) : setMissionUrl(v)}
                  linkLibrary={linkLibrary}
                />
                <button onClick={() => setShowCustomInput(true)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Edit3 size={14} /></button>
              </div>
            )}
          </motion.div>
        )}

        {/* Secondary URL (night_shift / weekend) */}
        {(missionMode === 'night_shift' || missionMode === 'weekend') && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">
              {missionMode === 'night_shift' ? 'Nighttime Destination' : 'Weekend Destination'}
            </label>
            {showCustomInputB ? (
              <div className="space-y-1">
                <input type="text" autoFocus value={missionUrlB} onChange={e => setMissionUrlB(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setShowCustomInputB(false); }}
                  placeholder="https://..." className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-orange-400 font-mono outline-none focus:border-orange-500 transition-all" />
                <button onClick={() => setShowCustomInputB(false)} className="text-[8px] text-slate-500 hover:text-white uppercase font-black">Cancel</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <LinkSelect
                  value={missionUrlB}
                  onChange={v => v === '__custom__' ? setShowCustomInputB(true) : setMissionUrlB(v)}
                  linkLibrary={linkLibrary}
                  placeholder="— Night/Weekend Destination —"
                />
                <button onClick={() => setShowCustomInputB(true)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Edit3 size={14} /></button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Save Station Mission */}
      <button onClick={handleSave} disabled={isSaving}
        className="w-full bg-white text-slate-950 font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 mb-3">
        {isSaving ? 'Synchronizing...' : 'Save Station Mission'}
      </button>

      {/* Copy Mission */}
      {onCopyMission && (
        <button
          onClick={() => onCopyMission(asset.id, { mode: missionMode, destination_url: missionUrl, destination_url_b: missionUrlB, webhook_url: webhookUrl, config: scheduleConfig })}
          className="w-full bg-slate-800 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl flex items-center justify-center gap-3 group mb-3">
          <Copy size={14} className="group-hover:scale-110 transition-transform" /> Copy Mission
        </button>
      )}

      {/* Deactivate + Tap Count */}
      <div className="flex gap-2 mt-1">
        <button onClick={() => onDeactivate?.(asset)}
          className="flex-1 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all flex items-center justify-center gap-3 group/deact"
          title="Deactivate Station">
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
