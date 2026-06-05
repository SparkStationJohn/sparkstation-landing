import React, { useState } from 'react';
import Connect from './templates/Connect';
import Showcase from './templates/Showcase';
import { Smartphone, Layout, ChevronDown } from 'lucide-react';

export default function Preview() {
  const [selected, setSelected] = useState('connect');

  const johnData = {
    full_name: 'John William Odell',
    bio: 'Solutions Architect & Technical Lead. Building the future of agentic coding and digital identity.',
    logo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    template_id: 'connect',
    content_data: { title: 'IT Solutions Architect' },
    social_links: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'GitHub', url: '#' }
    ]
  };

  const jessieData = {
    full_name: "Jessie's Resin Realm",
    bio: 'Crafting one-of-a-kind resin art, jewelry, and home decor inspired by the Pacific Northwest.',
    logo_url: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=200',
    template_id: 'showcase',
    content_data: {
      subtitle: "Artisan Resin Maker",
      hero_images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"],
      story: "What started as a hobby in a small garage in Seattle has blossomed into a full-time passion. I believe that resin captures moments in time, turning fluid colors into permanent treasures.",
      cta_label: "Shop Etsy Collection",
      cta_url: "https://www.etsy.com"
    }
  };

  const currentProfile = selected === 'connect' ? johnData : jessieData;

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center">
      {/* Navbar Selector */}
      <div className="w-full bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100] p-4 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
             <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tighter">SPARK LAB</h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Template Previewer</p>
          </div>
        </div>

        <div className="relative group">
          <select 
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="appearance-none bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-white/10 outline-none cursor-pointer hover:border-orange-500 transition-colors pr-10"
          >
            <option value="connect">The Connect (John)</option>
            <option value="showcase">The Showcase (Jessie)</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 w-full flex items-center justify-center p-8 py-12">
         {/* Mobile Phone Mockup */}
         <div className="relative mx-auto border-8 border-slate-800 rounded-[3rem] shadow-2xl w-[375px] h-[812px] bg-white overflow-hidden ring-1 ring-white/10">
            {/* Status Bar Mock */}
            <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-[60] flex items-center justify-between px-8 pt-4">
               <span className="text-[10px] font-bold text-slate-400">9:41</span>
               <div className="flex gap-1.5 items-center">
                  <div className="w-3 h-3 bg-slate-400 rounded-full" />
                  <div className="w-3 h-3 bg-slate-400 rounded-full opacity-50" />
               </div>
            </div>

            {/* Content Scroller */}
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
              {selected === 'connect' ? (
                <Connect profile={johnData} content={johnData.content_data} />
              ) : (
                <Showcase profile={jessieData} content={jessieData.content_data} />
              )}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full z-[60]" />
         </div>

         {/* Context Sidebar (Desktop Only) */}
         <div className="hidden xl:block absolute right-12 top-32 w-80 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
               <h3 className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">Template Intel</h3>
               <h4 className="text-white font-bold text-lg leading-tight">{selected === 'connect' ? 'Networking Hub' : 'Artisan Showcase'}</h4>
               <p className="text-slate-400 text-sm mt-3 leading-relaxed font-medium">
                  {selected === 'connect' 
                    ? 'Optimized for one-tap contact saving and social mapping. Perfect for entrepreneurs and IT professionals.' 
                    : 'A media-heavy story engine designed for makers. Features immersive hero visuals and high-conversion CTAs.'}
               </p>
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center gap-4">
               <Smartphone className="w-8 h-8 text-slate-700" />
               <div>
                  <p className="text-white text-xs font-black uppercase">Live View</p>
                  <p className="text-slate-500 text-[10px] font-medium italic">Simulating iPhone 15 Pro</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
