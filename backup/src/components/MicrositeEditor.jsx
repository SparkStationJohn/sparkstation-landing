import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Connect from './templates/Connect';
import Showcase from './templates/Showcase';
import MediaUploader from './MediaUploader';
import SocialIcon from './SocialIcon';
import { 
  Smartphone, Save, Image, Type, Link as LinkIcon, 
  Settings, ChevronRight, UserPlus, Globe, Sparkles, Plus, Trash2, Mail, Phone, Briefcase, Palette, Camera, ExternalLink, CheckCircle2, AlertCircle,
  Zap, Edit3, X, Copy, Check, Loader2
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Spark Orange', hex: '#f97316' },
  { name: 'Deep Sea', hex: '#0ea5e9' },
  { name: 'Forest', hex: '#10b981' },
  { name: 'Royal', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Midnight', hex: '#0f172a' }
];

const SUPPORTED_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', baseUrl: 'https://instagram.com/', placeholder: 'username' },
  { id: 'linkedin', label: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', placeholder: 'username-or-id' },
  { id: 'twitter', label: 'X (Twitter)', baseUrl: 'https://x.com/', placeholder: 'username' },
  { id: 'facebook', label: 'Facebook', baseUrl: 'https://facebook.com/', placeholder: 'username' },
  { id: 'youtube', label: 'YouTube', baseUrl: 'https://youtube.com/@', placeholder: 'channel' },
  { id: 'github', label: 'GitHub', baseUrl: 'https://github.com/', placeholder: 'username' },
  { id: 'whatsapp', label: 'WhatsApp', baseUrl: 'https://wa.me/', placeholder: '1234567890' },
  { id: 'telegram', label: 'Telegram', baseUrl: 'https://t.me/', placeholder: 'username' },
  { id: 'email', label: 'Email', baseUrl: 'mailto:', placeholder: 'hello@brand.com' },
  { id: 'phone', label: 'Phone', baseUrl: 'tel:', placeholder: '+1234567890' },
  { id: 'website', label: 'Website', baseUrl: '', placeholder: 'https://your-site.com' }
];

const TEMPLATE_SCHEMAS = {
  connect: {
    name: 'The Connect',
    description: 'High-impact networking and contact exchange.',
    zones: [
      { id: 'visual_theme', label: 'Theme & Color', icon: Palette },
      { id: 'artisan_style', label: 'Artisan Style', icon: Sparkles },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'profile_info', label: 'Profile Info', icon: UserPlus },
      { id: 'social_links', label: 'Social Network', icon: LinkIcon },
      { id: 'lead_vault', label: 'Lead Capture', icon: Mail },
      { id: 'seo_settings', label: 'SEO & Marketing', icon: Globe }
    ]
  },
  showcase: {
    name: 'The Showcase',
    description: 'Portfolio-first layout for makers and creators.',
    zones: [
      { id: 'visual_theme', label: 'Theme & Color', icon: Palette },
      { id: 'artisan_style', label: 'Artisan Style', icon: Sparkles },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'profile_info', label: 'Profile Info', icon: UserPlus },
      { id: 'hero_media', label: 'Brand Gallery', icon: Image },
      { id: 'why_us', label: 'Why Us?', icon: CheckCircle2 },
      { id: 'brand_story', label: 'Brand Story', icon: Type },
      { id: 'social_links', label: 'Social Network', icon: LinkIcon },
      { id: 'conversion', label: 'Action Area', icon: Zap },
      { id: 'lead_vault', label: 'Lead Capture', icon: Mail },
      { id: 'seo_settings', label: 'SEO & Marketing', icon: Globe }
    ]
  }
};

const SUPPORTED_TEXTURES = [
  { id: 'none', label: 'None', class: '' },
  { id: 'noise', label: 'Industrial Noise', class: 'industrial-noise' },
  { id: 'grid', label: 'Tactical Grid', class: 'tactical-grid' },
  { id: 'dots', label: 'Micro Dots', class: 'dots-pattern' }
];

export default function MicrositeEditor({ initialData, onSave, onUpgrade, linkLibrary = [], onAddLink, onDeleteLink }) {
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const userTier = initialData?.subscription_tier || 'free';
  const isPro = userTier === 'pro' || userTier === 'enterprise';

  // Ensure we have a valid template or fallback to 'connect'
  const initialTemplate = (initialData?.template_id && TEMPLATE_SCHEMAS[initialData.template_id]) 
    ? initialData.template_id 
    : 'connect';

  const [template, setTemplate] = useState(initialTemplate);
  const [viewMode, setViewMode] = useState('editor'); // 'editor' or 'preview'
  const [activeZone, setActiveZone] = useState('visual_theme');
  const [saving, setSaving] = useState(false);
  const [isSelectingSocial, setIsSelectingSocial] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle, checking, available, taken, invalid
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [domainError, setDomainError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [data, setData] = useState({
    ...initialData,
    social_links: initialData?.social_links || [],
    is_public: initialData?.is_public || false,
    notification_settings: initialData?.notification_settings || { email_enabled: false, push_enabled: false },
    content_data: {
      primary_color: initialData.content_data?.primary_color || '#f97316',
      title: initialData.content_data?.title || "",
      subtitle: initialData.content_data?.subtitle || "",
      hero_images: initialData.content_data?.hero_images || ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"],
      story: initialData.content_data?.story || "",
      cta_label: initialData.content_data?.cta_label || "Visit Website",
      cta_url: initialData.content_data?.cta_url || "",
      why_us: initialData.content_data?.why_us || [],
      vcf_enabled: initialData.content_data?.vcf_enabled !== false,
      vcf_phone: initialData.content_data?.vcf_phone || "",
      vcf_email: initialData.content_data?.vcf_email || "",
      vcf_company: initialData.content_data?.vcf_company || "",
      theme_style: initialData.content_data?.theme_style || "glass",
      font_family: initialData.content_data?.font_family || "Outfit",
      secondary_color: initialData.content_data?.secondary_color || "#000000",
      lead_enabled: initialData.content_data?.lead_enabled || false,
      lead_title: initialData.content_data?.lead_title || "Get in Touch",
      lead_button: initialData.content_data?.lead_button || "Send Message",
      texture: initialData.content_data?.texture || "none",
      glass_blur: initialData.content_data?.glass_blur || 20,
      border_radius: initialData.content_data?.border_radius || "rounded",
      seo_title: initialData.content_data?.seo_title || "",
      seo_description: initialData.content_data?.seo_description || "",
      animation_style: initialData.content_data?.animation_style || "stagger",
      motion_intensity: initialData.content_data?.motion_intensity || 0.5,
    }
  });

  const schema = useMemo(() => TEMPLATE_SCHEMAS[template], [template]);

  const updateField = (field, value) => {
    if (['full_name', 'bio', 'logo_url', 'notification_settings', 'username', 'custom_domain', 'is_public'].includes(field)) {
      setData(prev => ({ ...prev, [field]: value }));
      
      if (field === 'username') {
        setUsernameStatus('idle');
      }
      
      if (field === 'custom_domain') {
        setData(prev => ({ ...prev, domain_verified: false }));
        setDomainError(null);
      }
    } else {
      setData(prev => ({
        ...prev,
        content_data: { ...prev.content_data, [field]: value }
      }));
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus('invalid');
      return;
    }

    const regex = /^[a-z0-9_]+$/;
    if (!regex.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setIsCheckingUsername(true);
    setUsernameStatus('checking');

    try {
      const { data: existing, error } = await sb
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', data.id) // Don't flag their own username as taken
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (existing) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    } catch (err) {
      console.error('Username check failed:', err);
      setUsernameStatus('idle');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const updateSocial = (idx, field, value) => {
    const newSocials = [...data.social_links];
    newSocials[idx] = { ...newSocials[idx], [field]: value };
    setData(prev => ({ ...prev, social_links: newSocials }));
  };

  const addSocial = () => {
    setIsSelectingSocial(true);
  };

  const handlePlatformSelect = (platform) => {
    setData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: platform.label, url: platform.baseUrl }]
    }));
    setIsSelectingSocial(false);
  };

  const handleSmartUrlPaste = (idx, rawUrl) => {
    const url = rawUrl.toLowerCase();
    let platform = 'website';

    if (url.includes('instagram.com')) platform = 'Instagram';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'X (Twitter)';
    else if (url.includes('linkedin.com')) platform = 'LinkedIn';
    else if (url.includes('facebook.com')) platform = 'Facebook';
    else if (url.includes('youtube.com')) platform = 'YouTube';
    else if (url.includes('tiktok.com')) platform = 'TikTok';
    else if (url.includes('wa.me')) platform = 'WhatsApp';
    else if (url.includes('t.me')) platform = 'Telegram';
    else if (url.includes('mailto:')) platform = 'Email';
    else if (url.includes('tel:')) platform = 'Phone';

    const newSocials = [...data.social_links];
    newSocials[idx] = { ...newSocials[idx], url: rawUrl, platform };
    setData(prev => ({ ...prev, social_links: newSocials }));
  };

  const removeSocial = (idx) => {
    setData(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== idx)
    }));
  };

  const handleAddLink = async () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    setIsAddingLink(true);
    await onAddLink?.({ label: newLinkLabel.trim(), url: newLinkUrl.trim() });
    setNewLinkLabel('');
    setNewLinkUrl('');
    setIsAddingLink(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...data,
      template_id: template
    });
    setSaving(false);
  };

  const handleCopyLink = () => {
    const link = data.username 
      ? `${window.location.origin}/u/${data.username}`
      : `${window.location.origin}/p/${data.id}`;
    
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyDomain = async () => {
    if (!data.custom_domain) return;
    
    setIsVerifyingDomain(true);
    setDomainError(null);
    
    try {
      const { data: res, error } = await sb.functions.invoke('manage-domains', {
        body: { domain: data.custom_domain, action: 'verify' }
      });

      if (error || res?.error) throw new Error(error?.message || res?.error);

      setData(prev => ({ ...prev, domain_verified: true }));
    } catch (err) {
      console.error('Domain Verification Error:', err);
      setDomainError(err.message);
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const currentZone = (schema && schema.zones) 
    ? (schema.zones.find(z => z.id === activeZone) || schema.zones[0])
    : { id: 'visual_theme', label: 'Visual Theme', icon: Palette };

  return (
    <div className="flex flex-col xl:flex-row bg-slate-900/40 rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[600px] xl:min-h-[800px] relative">
      
      {/* Mobile View Toggle (Floating) */}
      <div className="xl:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl">
         <button 
          onClick={() => setViewMode('editor')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'editor' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400'}`}
         >
           <Edit3 size={14} /> Edit
         </button>
         <button 
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400'}`}
         >
           <Smartphone size={14} /> Mirror
         </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`${viewMode === 'preview' ? 'hidden' : 'flex'} w-full xl:w-[320px] bg-slate-900/60 border-b xl:border-b-0 xl:border-r border-white/5 flex-col p-4`}>
        <div className="p-4 mb-4">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Template Engine</p>
           <div className="grid grid-cols-2 gap-4">
                   {Object.entries(TEMPLATE_SCHEMAS).map(([id, templateSchema]) => {
                    const isLocked = id === 'showcase' && !isPro;
                    return (
                      <button 
                        key={id}
                        disabled={isLocked}
                        onClick={() => { setTemplate(id); setActiveZone('visual_theme'); }}
                        className={`p-6 rounded-[2.5rem] border text-left transition-all relative group ${template === id ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 bg-slate-950 hover:border-white/10'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{templateSchema.name}</h4>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                           {id === 'connect' ? 'Digital Business Card' : 'Artisan Portfolio'}
                         </p>
                         
                         {isLocked && (
                           <div className="absolute top-4 right-4 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">PRO</div>
                         )}
                         
                         <div className={`mt-4 w-4 h-4 rounded-full border-2 transition-all ${template === id ? 'border-orange-500 flex items-center justify-center' : 'border-white/10'}`}>
                            {template === id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                         </div>
                      </button>
                    );
                  })}
               </div>
               {!isPro && (
                 <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Upgrade to Spark PRO</p>
                      <p className="text-[9px] text-slate-500 font-medium">Unlock The Showcase and Artisan themes</p>
                    </div>
                    <button 
                      onClick={onUpgrade}
                      className="bg-orange-500 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest"
                    >
                      Upgrade
                    </button>
                 </div>
               )}
        </div>

        <div className="flex xl:flex-col overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 gap-1 scrollbar-hide">
           {schema && schema.zones && schema.zones.map((zone) => {
             const Icon = zone.icon;
             const isZoneLocked = zone.id === 'artisan_style' && !isPro;
             const isActive = currentZone.id === zone.id;
             return (
               <button
                key={zone.id}
                disabled={isZoneLocked}
                onClick={() => setActiveZone(zone.id)}
                className={`flex-shrink-0 xl:flex-shrink w-auto xl:w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive ? 'text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'} ${isZoneLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={isActive ? { backgroundColor: data.content_data.primary_color } : {}}
               >
                  <div className="flex items-center gap-4">
                     <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                     <span className="text-xs font-bold tracking-tight whitespace-nowrap">{zone.label}</span>
                  </div>
                  <ChevronRight className={`hidden xl:block w-4 h-4 opacity-30 ${isActive ? 'opacity-100' : ''}`} />
               </button>
             );
           })}
        </div>

        <div className="hidden xl:flex p-4 mt-auto border-t border-white/5 flex-col gap-3">
           <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
           >
              <Save size={16} /> {saving ? 'Syncing...' : 'Publish Site'}
           </button>
           <button 
            onClick={handleCopyLink}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
           >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />} 
              {copied ? 'Copied!' : 'Copy Bio Link'}
           </button>
           <a 
            href={data.username ? `/u/${data.username}` : `/p/${data.id}`} 
            target="_blank" 
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
           >
              <ExternalLink size={16} /> View Live
           </a>
        </div>
      </div>

      {/* Editor Main Area */}
      <div className={`${viewMode === 'preview' ? 'hidden' : 'block'} flex-1 p-6 lg:p-12 overflow-y-auto pb-32 xl:pb-12`}>
         <div className="max-w-xl mx-auto space-y-8">
            <header>
               <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{currentZone.label}</h2>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Micro-CMS Configuration</p>
            </header>

            <div className="space-y-6">
               {/* Zone Content: Profile Info */}
               {currentZone.id === 'profile_info' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-inner space-y-5">
                       <div className="flex items-center gap-3 mb-1">
                         <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                           <LinkIcon size={14} className="text-orange-500" />
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">Claim Your Vanity Handle</p>
                           <p className="text-[9px] text-slate-500 font-bold mt-0.5">Your permanent short link for business cards, bios &amp; social profiles</p>
                         </div>
                       </div>

                       <div className="flex gap-3 text-[9px] font-black uppercase tracking-wider">
                         <div className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-900 rounded-2xl border border-white/5 text-center">
                           <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">1</span>
                           <span className="text-slate-400 leading-tight">Type your handle below</span>
                         </div>
                         <div className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-900 rounded-2xl border border-white/5 text-center">
                           <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">2</span>
                           <span className="text-slate-400 leading-tight">Confirm it shows Available</span>
                         </div>
                         <div className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-900 rounded-2xl border border-white/5 text-center">
                           <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">3</span>
                           <span className="text-slate-400 leading-tight">Hit Save — it's live instantly</span>
                         </div>
                       </div>

                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Handle</p>
                          {usernameStatus === 'available' && <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">✓ Available</span>}
                          {usernameStatus === 'taken' && <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">✗ Already Taken</span>}
                          {usernameStatus === 'invalid' && <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Letters, numbers &amp; _ only</span>}
                       </div>
                       
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                             <span className="text-sm font-black text-slate-700">tap.sparkstation.link/u/</span>
                          </div>
                          <input 
                            type="text" 
                            value={data.username || ''} 
                            onChange={(e) => updateField('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            onBlur={(e) => checkUsernameAvailability(e.target.value)}
                            placeholder="yourhandle" 
                            className={`w-full bg-slate-900 border ${usernameStatus === 'available' ? 'border-green-500/50' : usernameStatus === 'taken' ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl pl-[210px] pr-12 py-5 text-white text-sm font-black outline-none focus:border-orange-500 transition-all`} 
                          />
                          {isCheckingUsername && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                               <div className="w-4 h-4 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                            </div>
                          )}
                          {usernameStatus === 'available' && !isCheckingUsername && (
                             <div className="absolute right-6 top-1/2 -translate-y-1/2">
                               <CheckCircle2 size={18} className="text-green-500" />
                            </div>
                          )}
                       </div>

                       {data.username && usernameStatus !== 'taken' && (
                         <div className="flex items-center gap-3 p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                           <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Your link:</span>
                           <span className="text-[10px] font-black text-orange-400 font-mono">tap.sparkstation.link/u/{data.username}</span>
                         </div>
                       )}

                       <div className="pt-4 border-t border-white/5 mt-4">
                          <div className="flex items-center justify-between p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                             <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Community Discovery</p>
                                <p className="text-[9px] text-slate-500 font-bold mt-0.5">Show my profile in the Artisan Directory</p>
                             </div>
                             <button
                                onClick={() => updateField('is_public', !data.is_public)}
                                className={`relative w-12 h-6 rounded-full transition-all ${data.is_public ? 'bg-orange-500' : 'bg-white/10'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${data.is_public ? 'left-7' : 'left-1'}`} />
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-inner space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Profile Media (Avatar)</p>
                       <MediaUploader 
                          currentUrl={data.logo_url} 
                          onUpload={(url) => updateField('logo_url', url)} 
                          zoneId="avatar"
                          userId={data.id}
                       />
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
                          <input type="text" value={data.full_name} onChange={(e) => updateField('full_name', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template === 'connect' ? 'Job Title' : 'Subtitle'}</label>
                             <input type="text" value={template === 'connect' ? data.content_data.title : data.content_data.subtitle} onChange={(e) => updateField(template === 'connect' ? 'title' : 'subtitle', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</label>
                             <input type="text" value={data.content_data.vcf_company} onChange={(e) => updateField('vcf_company', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Bio</label>
                          <textarea rows={4} value={data.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[2rem] px-6 py-5 text-white outline-none text-sm" />
                       </div>
                    </div>
                 </div>
               )}

               {/* Visual Theme & Advanced Color */}
               {currentZone.id === 'visual_theme' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Display Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                           {[
                             { id: 'glass', label: 'Glass', icon: Sparkles },
                             { id: 'minimal', label: 'Minimal', icon: Palette },
                             { id: 'vibrant', label: 'Vibrant', icon: Zap }
                           ].map(mode => (
                             <button 
                               key={mode.id}
                               onClick={() => updateField('theme_style', mode.id)}
                               className={`px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${data.content_data.theme_style === mode.id ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'}`}
                             >
                                <mode.icon size={16} />
                                {mode.label}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Primary Brand Color</label>
                        <div className="grid grid-cols-3 gap-3">
                           {PRESET_COLORS.map((color) => (
                             <button key={color.hex} onClick={() => updateField('primary_color', color.hex)} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${data.content_data.primary_color === color.hex ? 'border-white bg-white/10' : 'border-white/5 bg-slate-950 hover:border-white/20'}`}>
                                <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                                <span className="text-[10px] font-black uppercase text-white/60">{color.name}</span>
                             </button>
                           ))}
                        </div>
                        <div className="flex items-center gap-4 bg-slate-950 p-6 rounded-[2rem] border border-white/5">
                           <input type="color" value={data.content_data.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} className="w-10 h-10 rounded-xl bg-transparent cursor-pointer" />
                           <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Brand Code: {data.content_data.primary_color}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Secondary Accent</label>
                        <div className="flex items-center gap-4 bg-slate-950 p-6 rounded-[2rem] border border-white/5">
                           <input type="color" value={data.content_data.secondary_color} onChange={(e) => updateField('secondary_color', e.target.value)} className="w-10 h-10 rounded-xl bg-transparent cursor-pointer" />
                           <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Accent Code: {data.content_data.secondary_color}</p>
                        </div>
                     </div>

                     <div className="space-y-4 bg-slate-950 p-8 rounded-[3rem] border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motion Engine Intensity</label>
                           <span className="text-[10px] font-black text-orange-500">{Math.round(data.content_data.motion_intensity * 100)}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.1"
                          value={data.content_data.motion_intensity || 0.5}
                          onChange={(e) => updateField('motion_intensity', parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="grid grid-cols-3 gap-2 mt-4">
                           {['fade', 'stagger', 'slide'].map(style => (
                             <button 
                               key={style}
                               onClick={() => updateField('animation_style', style)}
                               className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${data.content_data.animation_style === style ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-900 text-slate-500 border-white/5'}`}
                             >
                               {style}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* Typography Selection */}
               {currentZone.id === 'typography' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Curated Artisan Typefaces</p>
                     <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'Outfit', name: 'Outfit', type: 'Modern Sans', class: 'font-sans', premium: false },
                          { id: 'Playfair Display', name: 'Playfair', type: 'Elegant Serif', class: 'font-serif', premium: true },
                          { id: 'Inter', name: 'Inter', type: 'Precision Sans', class: 'font-inter', premium: true },
                          { id: 'JetBrains Mono', name: 'JetBrains', type: 'Technical Mono', class: 'font-mono', premium: true }
                        ].map(font => {
                          const isLocked = font.premium && !isPro;
                          return (
                            <button 
                              key={font.id}
                              disabled={isLocked}
                              onClick={() => updateField('font_family', font.id)}
                              className={`p-6 rounded-[2rem] border transition-all text-left flex items-center justify-between group ${data.content_data.font_family === font.id ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 bg-slate-950 hover:border-white/10'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                               <div>
                                  <div className={`text-xl font-bold text-white mb-1 ${font.class}`} style={{ fontFamily: font.id }}>{font.name}</div>
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{font.type}</div>
                               </div>
                               <div className="flex items-center gap-4">
                                  {isLocked && <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">PRO</span>}
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${data.content_data.font_family === font.id ? 'border-orange-500' : 'border-white/10 group-hover:border-white/20'}`}>
                                    {data.content_data.font_family === font.id && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                                  </div>
                               </div>
                            </button>
                          );
                        })}
                     </div>
                     <p className="text-[9px] text-slate-600 font-medium text-center italic mt-4">Fonts are dynamically applied to your entire digital identity profile.</p>
                  </div>
               )}

               {/* Social Networks */}
               {currentZone.id === 'social_links' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <AnimatePresence mode="wait">
                     {isSelectingSocial ? (
                       <motion.div
                         key="picker"
                         initial={{ opacity: 0, y: 8 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -8 }}
                         transition={{ duration: 0.18 }}
                         className="bg-slate-950 rounded-[2.5rem] border border-white/10 p-8"
                       >
                         <div className="flex items-center justify-between mb-8">
                           <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Platform</h3>
                           <button onClick={() => setIsSelectingSocial(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                             <X size={16} />
                           </button>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                           {SUPPORTED_PLATFORMS.map((p) => (
                             <button
                               key={p.id}
                               onClick={() => handlePlatformSelect(p)}
                               className="aspect-square bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all group active:scale-95 hover:border-white/20"
                             >
                               <div className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                 <SocialIcon platform={p.id} size={28} />
                               </div>
                               <span className="text-[8px] font-black text-slate-500 group-hover:text-slate-300 uppercase tracking-widest">{p.label}</span>
                             </button>
                           ))}
                         </div>
                       </motion.div>
                     ) : (
                       <motion.div
                         key="list"
                         initial={{ opacity: 0, y: 8 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -8 }}
                         transition={{ duration: 0.18 }}
                         className="space-y-4"
                       >
                         {data.social_links.map((link, idx) => {
                           const pConfig = SUPPORTED_PLATFORMS.find(p => p.label === link.platform);
                           return (
                             <div key={idx} className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4 group/item">
                               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
                                 <SocialIcon platform={link.platform} size={24} />
                               </div>
                               <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{link.platform}</span>
                                 </div>
                                 <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl px-4 py-2 border border-white/5">
                                   {pConfig?.baseUrl && (
                                     <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{pConfig.baseUrl.replace('https://', '')}</span>
                                   )}
                                   <input
                                     type="text"
                                     value={pConfig ? link.url.replace(pConfig.baseUrl, '') : link.url}
                                     onChange={(e) => {
                                       const val = e.target.value;
                                       if (val.includes('http')) {
                                         handleSmartUrlPaste(idx, val);
                                       } else {
                                         updateSocial(idx, 'url', pConfig ? pConfig.baseUrl + val : val);
                                       }
                                     }}
                                     className="bg-transparent border-none text-white text-xs outline-none w-full"
                                     placeholder={pConfig?.placeholder || "URL OR PASTE LINK"}
                                   />
                                 </div>
                               </div>
                               <button onClick={() => removeSocial(idx)} className="text-slate-800 hover:text-rose-500 transition-all p-2 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-5 h-5" /></button>
                             </div>
                           );
                         })}

                         {(!isPro && data.social_links.length >= 3) ? (
                           <div className="p-6 rounded-[2.5rem] bg-orange-500/5 border border-dashed border-orange-500/20 text-center">
                             <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Social Link Limit Reached</p>
                             <p className="text-[9px] text-slate-500 font-medium mb-4">Upgrade to PRO for unlimited profile links</p>
                             <button onClick={onUpgrade} className="bg-orange-500 text-white text-[9px] font-black px-6 py-2 rounded-xl uppercase tracking-widest">
                               Upgrade Now
                             </button>
                           </div>
                         ) : (
                           <button onClick={addSocial} className="w-full py-6 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-slate-300 hover:border-white/20 transition-all flex items-center justify-center gap-3">
                             <Plus className="w-5 h-5" /> Add Profile Link
                           </button>
                         )}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               )}

               {/* Why Us? Zone */}
               {currentZone.id === 'why_us' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Value Propositions</p>
                       <button 
                         onClick={() => {
                           const current = data.content_data.why_us || [];
                           updateField('why_us', [...current, { title: 'NEW VALUE', description: 'Briefly explain this benefit...' }]);
                         }}
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-colors group"
                       >
                          <Plus className="w-3 h-3 text-white group-hover:scale-125 transition-transform" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Add Item</span>
                       </button>
                    </div>

                    <div className="space-y-4">
                       {(data.content_data.why_us || []).map((item, idx) => (
                         <div key={idx} className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/5 space-y-4 group">
                            <div className="flex items-center justify-between">
                               <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                  <Sparkles className="w-4 h-4 text-slate-500" />
                               </div>
                               <button 
                                 onClick={() => {
                                   const next = [...(data.content_data.why_us || [])];
                                   next.splice(idx, 1);
                                   updateField('why_us', next);
                                 }}
                                 className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-all"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                            <div className="space-y-3">
                               <input 
                                 type="text" 
                                 value={item.title} 
                                 onChange={(e) => {
                                   const next = (data.content_data.why_us || []).map((it, i) => 
                                     i === idx ? { ...it, title: e.target.value.toUpperCase() } : it
                                   );
                                   updateField('why_us', next);
                                 }}
                                 placeholder="FEATURE TITLE"
                                 className="w-full bg-transparent border-b border-white/5 pb-2 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-white/20 transition-colors"
                               />
                               <textarea 
                                 value={item.description}
                                 onChange={(e) => {
                                   const next = (data.content_data.why_us || []).map((it, i) => 
                                     i === idx ? { ...it, description: e.target.value } : it
                                   );
                                   updateField('why_us', next);
                                 }}
                                 placeholder="Describe this value proposition..."
                                 rows={2}
                                 className="w-full bg-transparent text-slate-500 text-[10px] font-medium leading-relaxed outline-none resize-none"
                               />
                            </div>
                         </div>
                       ))}

                       {(!data.content_data.why_us || data.content_data.why_us.length === 0) && (
                         <div className="text-center py-12 bg-slate-950/50 rounded-[3rem] border-2 border-dashed border-white/5">
                            <Sparkles className="w-8 h-8 text-slate-800 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Define your competitive edge</p>
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {currentZone.id === 'hero_media' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showcase Gallery</p>
                       <button 
                         onClick={() => {
                           const current = data.content_data.hero_images || [];
                           updateField('hero_images', [...current, ""]);
                         }}
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-colors group"
                       >
                          <Plus className="w-3 h-3 text-white group-hover:scale-125 transition-transform" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Add Image</span>
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                       {(data.content_data.hero_images || []).map((img, idx) => (
                         <div key={idx} className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/5 space-y-4 group">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Slide {idx + 1}</span>
                               <button 
                                 onClick={() => {
                                   const next = [...(data.content_data.hero_images || [])];
                                   next.splice(idx, 1);
                                   updateField('hero_images', next);
                                 }}
                                 className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-all"
                                >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                            <MediaUploader 
                               currentUrl={img} 
                               onUpload={(url) => {
                                 const next = [...(data.content_data.hero_images || [])];
                                 next[idx] = url;
                                 updateField('hero_images', next);
                               }} 
                               zoneId={`hero_${idx}`}
                               userId={data.id}
                            />
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {currentZone.id === 'brand_story' && (
                  <textarea rows={10} value={data.content_data.story} onChange={(e) => updateField('story', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[3rem] px-8 py-8 text-white outline-none leading-relaxed italic text-sm" placeholder="The story behind your craft..." />
               )}

               {currentZone.id === 'conversion' && (
                  <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <input type="text" value={data.content_data.cta_label} onChange={(e) => updateField('cta_label', e.target.value)} placeholder="Button Label" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
                     <input type="text" value={data.content_data.cta_url} onChange={(e) => updateField('cta_url', e.target.value)} placeholder="Destination URL" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
                  </div>
               )}

               {currentZone.id === 'artisan_style' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Background Texture</label>
                        <div className="grid grid-cols-2 gap-3">
                           {SUPPORTED_TEXTURES.map(t => (
                             <button 
                               key={t.id}
                               onClick={() => updateField('texture', t.id)}
                               className={`px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center gap-2 ${data.content_data.texture === t.id ? 'bg-white text-black border-white shadow-xl shadow-white/10' : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'}`}
                             >
                                <div className="w-full h-8 rounded-lg bg-slate-900 overflow-hidden relative border border-white/5">
                                   {t.id !== 'none' && <div className={`absolute inset-0 opacity-50 ${t.class}`} />}
                                </div>
                                {t.label}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4 bg-slate-950 p-8 rounded-[3rem] border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Glass Blur Intensity</label>
                           <span className="text-[10px] font-black text-orange-500">{data.content_data.glass_blur || 20}px</span>
                        </div>
                        <input 
                          type="range" min="0" max="40" step="1"
                          value={data.content_data.glass_blur || 20}
                          onChange={(e) => updateField('glass_blur', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <p className="text-[8px] text-slate-600 font-medium italic">Adjust the subsurface scattering effect of card backgrounds.</p>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Corner Radius Profile</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['sharp', 'industrial', 'rounded', 'pill'].map(r => (
                             <button 
                               key={r}
                               onClick={() => updateField('border_radius', r)}
                               className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${data.content_data.border_radius === r ? 'bg-white text-black border-white' : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'}`}
                             >
                                {r}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {currentZone.id === 'lead_vault' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between bg-slate-950 p-8 rounded-[2.5rem] border border-white/5">
                        <div>
                           <p className="text-white text-sm font-black uppercase">Lead Capture Block</p>
                           <p className="text-[10px] text-slate-500 font-medium">Activate a secure contact form on your site.</p>
                        </div>
                        <button 
                         onClick={() => updateField('lead_enabled', !data.content_data.lead_enabled)}
                         className={`w-14 h-8 rounded-full relative transition-all ${data.content_data.lead_enabled ? 'bg-orange-500' : 'bg-slate-800'}`}
                         style={data.content_data.lead_enabled ? { backgroundColor: data.content_data.primary_color } : {}}
                        >
                           <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${data.content_data.lead_enabled ? 'left-7' : 'left-1'}`} />
                        </button>
                     </div>
                     
                     {data.content_data.lead_enabled && (
                        <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 space-y-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Form Header</label>
                              <input type="text" value={data.content_data.lead_title} onChange={(e) => updateField('lead_title', e.target.value)} placeholder="Get in Touch" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Button Label</label>
                              <input type="text" value={data.content_data.lead_button} onChange={(e) => updateField('lead_button', e.target.value)} placeholder="Send Message" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
                           </div>
                           <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest text-center italic mt-4">Leads will be stored in your dashboard vault</p>
                        </div>
                     )}
                  </div>
               )}

                {currentZone.id === 'seo_settings' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Custom Domain Engine */}
                    <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 shadow-inner space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                             <Globe size={16} className="text-orange-500" />
                          </div>
                          <div>
                             <h3 className="text-sm font-black text-white">Custom Domain</h3>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Automated DNS + SSL Provisioning</p>
                          </div>
                          {data.domain_verified && (
                            <span className="ml-auto flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-wider">
                              <CheckCircle2 size={14} /> Live
                            </span>
                          )}
                       </div>

                       {!data.domain_verified && (
                         <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">How It Works</p>
                           <div className="space-y-2">
                             {[
                               { n: '1', title: 'Enter your domain below', sub: 'e.g. cards.yourbusiness.com' },
                               { n: '2', title: 'Add the CNAME record shown', sub: 'In your domain registrar (GoDaddy, Cloudflare, etc.)' },
                               { n: '3', title: 'Click Verify & Connect', sub: 'We check DNS, add your domain, and provision SSL automatically' },
                             ].map(step => (
                               <div key={step.n} className="flex items-start gap-3 p-3 bg-slate-900 rounded-2xl border border-white/5">
                                 <span className="w-5 h-5 shrink-0 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-black mt-0.5">{step.n}</span>
                                 <div>
                                   <p className="text-[10px] font-black text-white uppercase tracking-tight">{step.title}</p>
                                   <p className="text-[9px] text-slate-500 font-bold mt-0.5">{step.sub}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       <div className="space-y-4">
                          <div className="relative">
                             <input 
                               type="text" 
                               value={data.custom_domain || ''} 
                               onChange={(e) => updateField('custom_domain', e.target.value.toLowerCase().trim())}
                               placeholder="yourdomain.com" 
                               className={`w-full bg-slate-900 border ${data.domain_verified ? 'border-green-500/50' : 'border-white/5'} rounded-2xl px-6 py-5 text-white text-sm font-black outline-none focus:border-orange-500 transition-all`} 
                             />
                             {data.domain_verified && (
                               <div className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase">Verified</span>
                                  <CheckCircle2 size={18} />
                               </div>
                             )}
                          </div>

                          {!data.domain_verified && data.custom_domain && (
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-orange-500/10 space-y-4">
                               <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">Step 2 — Add This DNS Record</p>
                               <div className="space-y-2">
                                  <div className="grid grid-cols-3 gap-2 text-[9px]">
                                    <div className="bg-slate-950 p-3 rounded-xl border border-white/5 text-center">
                                      <p className="text-slate-600 font-bold uppercase mb-1">Type</p>
                                      <p className="text-white font-black">CNAME</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-white/5 text-center">
                                      <p className="text-slate-600 font-bold uppercase mb-1">Host</p>
                                      <p className="text-white font-black">@ or www</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-white/5 text-center">
                                      <p className="text-slate-600 font-bold uppercase mb-1">Points To</p>
                                      <p className="text-orange-400 font-black font-mono text-[8px]">tap.sparkstation.link</p>
                                    </div>
                                  </div>
                               </div>
                               <p className="text-[8px] text-slate-600 font-bold uppercase leading-relaxed">DNS changes can take up to 24 hours to propagate. Once set, click verify below.</p>
                               
                               <button 
                                 onClick={handleVerifyDomain}
                                 disabled={isVerifyingDomain}
                                 className="w-full bg-white text-slate-950 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                               >
                                  {isVerifyingDomain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap size={14} fill="currentColor" />}
                                  {isVerifyingDomain ? 'Checking DNS & Provisioning SSL...' : 'Step 3 — Verify & Connect Domain'}
                               </button>

                               {domainError && (
                                 <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3">
                                    <AlertCircle size={14} className="text-rose-500 flex-shrink-0" />
                                    <p className="text-[9px] text-rose-500 font-bold leading-tight">{domainError}</p>
                                 </div>
                               )}
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Page Title (Meta)</label>
                          <input 
                            type="text" 
                            value={data.content_data.seo_title} 
                            onChange={(e) => updateField('seo_title', e.target.value)} 
                            placeholder="Brand Name | Profession" 
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/20 transition-all" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Meta Description</label>
                          <textarea 
                            rows={4}
                            value={data.content_data.seo_description} 
                            onChange={(e) => updateField('seo_description', e.target.value)} 
                            placeholder="Brief description for search engines and social sharing..." 
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/20 transition-all resize-none" 
                          />
                       </div>
                       <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10">
                          <div className="flex items-center gap-3 mb-2">
                             <Globe size={14} className="text-blue-500" />
                             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Search Result Preview</span>
                          </div>
                          <p className="text-blue-400 text-xs font-bold truncate mb-1">{data.content_data.seo_title || data.full_name}</p>
                          <p className="text-slate-500 text-[10px] leading-tight line-clamp-2">{data.content_data.seo_description || "Discover the craft behind the digital identity."}</p>
                       </div>
                    </div>
                  </div>
               )}


            </div>
         </div>
      </div>

      {/* Right Mobile Preview (Sticky) */}
      <div className={`${viewMode === 'editor' ? 'hidden xl:flex' : 'flex'} flex-1 xl:w-[480px] bg-slate-950/40 items-center justify-center p-4 lg:p-8 relative`}>
         <div className="absolute top-8 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
               <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="flex items-center gap-2 opacity-30">
               <Smartphone size={14} className="text-white" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Device Mirror</span>
            </div>
         </div>
         <div className="relative border-8 border-slate-900 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] w-full max-w-[320px] h-[640px] bg-white overflow-hidden ring-1 ring-white/10">
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
               {template === 'connect' ? (
                 <Connect profile={data} content={data.content_data} />
               ) : (
                 <Showcase profile={data} content={data.content_data} />
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
