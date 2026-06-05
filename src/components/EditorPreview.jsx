import React, { useState, useMemo } from 'react';
import Connect from './templates/Connect';
import Showcase from './templates/Showcase';
import { 
  Smartphone, Save, Image, Type, Link as LinkIcon, 
  Settings, ChevronRight, UserPlus, Globe, Sparkles, Plus, Trash2, Mail, Phone, Briefcase, Palette, Camera 
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Spark Orange', hex: '#f97316' },
  { name: 'Deep Sea', hex: '#0ea5e9' },
  { name: 'Forest', hex: '#10b981' },
  { name: 'Royal', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Midnight', hex: '#0f172a' }
];

const TEMPLATE_SCHEMAS = {
  connect: {
    name: 'The Connect',
    zones: [
      { id: 'visual_theme', label: 'Visual Theme', icon: Palette },
      { id: 'profile_info', label: 'Profile Info', icon: Type },
      { id: 'social_links', label: 'Social Networks', icon: Globe },
      { id: 'networking', label: 'Contact Card (VCF)', icon: UserPlus }
    ]
  },
  showcase: {
    name: 'The Showcase',
    zones: [
      { id: 'visual_theme', label: 'Visual Theme', icon: Palette },
      { id: 'hero_media', label: 'Hero Visuals', icon: Image },
      { id: 'profile_info', label: 'Profile Info', icon: Sparkles },
      { id: 'brand_story', label: 'Brand Story', icon: Type },
      { id: 'conversion', label: 'Conversion (CTA)', icon: LinkIcon }
    ]
  }
};

export default function EditorPreview() {
  const [template, setTemplate] = useState('connect');
  const [activeZone, setActiveZone] = useState('visual_theme');
  
  const [data, setData] = useState({
    id: 'john-123',
    full_name: "John William Odell",
    bio: 'Solutions Architect & Technical Lead.',
    logo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    social_links: [
      { platform: 'LinkedIn', url: 'https://linkedin.com' },
      { platform: 'GitHub', url: 'https://github.com' }
    ],
    content_data: {
      primary_color: '#f97316',
      title: "IT Solutions Architect",
      subtitle: "Artisan Resin Maker",
      hero_images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"],
      story: "Building the future of agentic coding.",
      cta_label: "Shop Etsy Collection",
      cta_url: "https://www.etsy.com",
      vcf_enabled: true,
      vcf_phone: "+1 (555) 123-4567",
      vcf_email: "john@sparkstation.link",
      vcf_company: "SparkStation"
    }
  });

  const schema = useMemo(() => TEMPLATE_SCHEMAS[template], [template]);

  const updateField = (field, value) => {
    if (['full_name', 'bio', 'logo_url'].includes(field)) {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      setData(prev => ({
        ...prev,
        content_data: { ...prev.content_data, [field]: value }
      }));
    }
  };

  const updateSocial = (idx, field, value) => {
    const newSocials = [...data.social_links];
    newSocials[idx] = { ...newSocials[idx], [field]: value };
    setData(prev => ({ ...prev, social_links: newSocials }));
  };

  const addSocial = () => {
    setData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: 'New Link', url: '' }]
    }));
  };

  const removeSocial = (idx) => {
    setData(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== idx)
    }));
  };

  // Defensive Render: Ensures the active zone belongs to the current schema
  const currentZone = schema.zones.find(z => z.id === activeZone) || schema.zones[0];

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar: Navigation */}
      <div className="w-full lg:w-[380px] bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: data.content_data.primary_color }}>
                 <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-sm font-black text-white tracking-tighter uppercase">Spark Editor</h1>
           </div>
        </div>

        <div className="p-6 border-b border-white/5 bg-slate-900/50">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Active Template</p>
           <select 
            value={template}
            onChange={(e) => { 
               setTemplate(e.target.value); 
               // Safety: Reset to visual theme to avoid "Ghost Zones"
               setActiveZone('visual_theme'); 
            }}
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-orange-500 transition-colors"
           >
              <option value="connect">The Connect (Networking)</option>
              <option value="showcase">The Showcase (Artist)</option>
           </select>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
           {schema.zones.map((zone) => {
             const Icon = zone.icon;
             const isActive = currentZone.id === zone.id;
             return (
               <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive ? 'text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}
                style={isActive ? { backgroundColor: data.content_data.primary_color } : {}}
               >
                  <div className="flex items-center gap-4">
                     <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                     <span className="text-xs font-bold tracking-tight">{zone.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-30 ${isActive ? 'opacity-100' : ''}`} />
               </button>
             );
           })}
        </div>
      </div>

      {/* Main Editor Pane: EXHAUSTIVE RENDERER */}
      <div className="flex-1 bg-slate-950 border-r border-white/5 flex flex-col overflow-y-auto">
         <div className="p-8 max-w-2xl w-full mx-auto space-y-10 text-white">
            <header>
               <h2 className="text-3xl font-black tracking-tighter">{currentZone.label}</h2>
               <p className="text-slate-500 text-sm mt-2 font-medium italic opacity-70">Template: {schema.name}</p>
            </header>

            <div className="space-y-8">
               {/* 1. Visual Theme (Shared) */}
               {currentZone.id === 'visual_theme' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Brand Color</label>
                    <div className="grid grid-cols-3 gap-3">
                       {PRESET_COLORS.map((color) => (
                         <button
                           key={color.hex}
                           onClick={() => updateField('primary_color', color.hex)}
                           className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${data.content_data.primary_color === color.hex ? 'border-white bg-white/10' : 'border-white/5 bg-slate-900 hover:border-white/20'}`}
                         >
                            <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                            <span className="text-[10px] font-black uppercase">{color.name}</span>
                         </button>
                       ))}
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[2rem] border border-white/5">
                       <input type="color" value={data.content_data.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} className="w-10 h-10 rounded-xl bg-transparent cursor-pointer" />
                       <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Custom: {data.content_data.primary_color}</p>
                    </div>
                 </div>
               )}

               {/* 2. Hero Media (Showcase Only) */}
               {currentZone.id === 'hero_media' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="aspect-video w-full bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden relative group">
                       <img src={data.content_data.hero_images[0]} className="w-full h-full object-cover opacity-60" alt="hero" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <input 
                            type="text" 
                            value={data.content_data.hero_images[0]} 
                            onChange={(e) => updateField('hero_images', [e.target.value])}
                            className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl text-white text-xs w-2/3 text-center outline-none"
                            placeholder="Hero Image URL"
                          />
                       </div>
                    </div>
                 </div>
               )}

               {/* 3. Profile Info (Shared) */}
               {currentZone.id === 'profile_info' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-6 bg-slate-900 p-6 rounded-[2.5rem] border border-white/5">
                       <div className="relative group">
                          <img src={data.logo_url} className="w-24 h-24 rounded-3xl object-cover border-2 border-white/10 shadow-2xl" alt="avatar" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl cursor-pointer"><Camera className="w-6 h-6 text-white" /></div>
                       </div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avatar URL (120x120)</p>
                          <input type="text" value={data.logo_url} onChange={(e) => updateField('logo_url', e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] outline-none" />
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
                          <input type="text" value={data.full_name} onChange={(e) => updateField('full_name', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500 transition-all" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template === 'connect' ? 'Job Title' : 'Subtitle'}</label>
                             <input type="text" value={template === 'connect' ? data.content_data.title : data.content_data.subtitle} onChange={(e) => updateField(template === 'connect' ? 'title' : 'subtitle', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</label>
                             <input type="text" value={data.content_data.vcf_company} onChange={(e) => updateField('vcf_company', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* 4. Social Links (Connect Only) */}
               {currentZone.id === 'social_links' && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {data.social_links.map((link, idx) => (
                      <div key={idx} className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4 group/item">
                         <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xs uppercase">{link.platform[0] || '?'}</div>
                         <div className="flex-1 grid grid-cols-2 gap-4">
                            <input type="text" value={link.platform} onChange={(e) => updateSocial(idx, 'platform', e.target.value)} className="bg-transparent border-none text-white text-xs font-black uppercase outline-none" placeholder="Platform" />
                            <input type="text" value={link.url} onChange={(e) => updateSocial(idx, 'url', e.target.value)} className="bg-transparent border-none text-slate-500 text-xs outline-none" placeholder="URL" />
                         </div>
                         <button onClick={() => removeSocial(idx)} className="text-slate-800 hover:text-rose-500 transition-all p-2 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <button onClick={addSocial} className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-slate-300 transition-all flex items-center justify-center gap-3">
                       <Plus className="w-5 h-5" /> Add New Network
                    </button>
                 </div>
               )}

               {/* 5. Networking/VCF (Connect Only) */}
               {currentZone.id === 'networking' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5">
                       <div>
                          <p className="text-white text-sm font-black uppercase">vCard Generation</p>
                          <p className="text-[10px] text-slate-500 font-medium">Enable high-conversion contact sharing.</p>
                       </div>
                       <button 
                        onClick={() => updateField('vcf_enabled', !data.content_data.vcf_enabled)}
                        className={`w-14 h-8 rounded-full relative transition-all ${data.content_data.vcf_enabled ? 'bg-orange-500' : 'bg-slate-800'}`}
                        style={data.content_data.vcf_enabled ? { backgroundColor: data.content_data.primary_color } : {}}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${data.content_data.vcf_enabled ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 space-y-6">
                       <input type="text" value={data.content_data.vcf_phone} onChange={(e) => updateField('vcf_phone', e.target.value)} placeholder="Direct Phone Number" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                       <input type="text" value={data.content_data.vcf_email} onChange={(e) => updateField('vcf_email', e.target.value)} placeholder="Professional Email" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                    </div>
                 </div>
               )}

               {/* 6. Brand Story (Showcase Only) */}
               {currentZone.id === 'brand_story' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <textarea rows={10} value={data.content_data.story} onChange={(e) => updateField('story', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-[3rem] px-8 py-8 text-white outline-none leading-relaxed italic text-sm shadow-inner" placeholder="Tell your brand story..." />
                 </div>
               )}

               {/* 7. Conversion (Showcase Only) */}
               {currentZone.id === 'conversion' && (
                 <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <input type="text" value={data.content_data.cta_label} onChange={(e) => updateField('cta_label', e.target.value)} placeholder="Button Label (e.g. Shop Now)" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500" />
                    <input type="text" value={data.content_data.cta_url} onChange={(e) => updateField('cta_url', e.target.value)} placeholder="Target URL" className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500" />
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* Right Mirror */}
      <div className="hidden 2xl:flex w-[500px] bg-slate-950 flex-col items-center justify-center relative">
         <div className="relative border-8 border-slate-900 rounded-[3.5rem] shadow-[0_60px_100px_rgba(0,0,0,0.6)] w-[320px] h-[650px] bg-white overflow-hidden ring-1 ring-white/10">
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
