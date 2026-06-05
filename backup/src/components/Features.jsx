import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, Shield, Cpu, Layers, Activity, Smartphone, 
  Terminal, Database, HardDrive, ArrowRight, CheckCircle2,
  Lock, Wifi, Gauge, Globe
} from 'lucide-react';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-surface min-h-screen text-primary selection:bg-orange-500/30">
      <Helmet>
        <title>Features | SparkStation Intelligence Platform</title>
        <meta name="description" content="Explore SparkStation's full feature set — NFC hardware, artisan microsites, analytics, webhooks, and the full Switchboard automation engine." />
        <link rel="canonical" href="https://tap.sparkstation.link/features" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Features | SparkStation Intelligence Platform" />
        <meta property="og:description" content="Explore SparkStation's full feature set — NFC hardware, artisan microsites, analytics, webhooks, and more." />
        <meta property="og:image" content="https://tap.sparkstation.link/spark_card_home.png" />
        <meta property="og:url" content="https://tap.sparkstation.link/features" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Features | SparkStation Intelligence Platform" />
        <meta name="twitter:image" content="https://tap.sparkstation.link/spark_card_home.png" />
      </Helmet>
      
      {/* TECH HERO */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Terminal size={14} /> Specification Sheet v1.4
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic pb-2"
            >
              Precision <br/>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 pr-8">Engineering</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-400 max-w-xl font-medium leading-relaxed"
            >
              SparkStation is built on a foundation of speed, security, and physical-digital parity. Explore the engine that powers every tap.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-square rounded-[3rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-4 text-orange-500 shadow-2xl">
               <Gauge size={48} />
               <div className="text-center">
                 <div className="text-2xl font-black italic tracking-tighter">50ms</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Latency</div>
               </div>
            </div>
            <div className="aspect-square rounded-[3rem] bg-orange-500 text-white flex flex-col items-center justify-center gap-4 shadow-2xl shadow-orange-500/20">
               <Lock size={48} />
               <div className="text-center">
                 <div className="text-2xl font-black italic tracking-tighter">AES-256</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-orange-100">Encryption</div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECHNICAL PILLARS */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Wifi />, title: "Dual-Band NFC", desc: "Compatible with ISO 14443 and NDEF protocols for universal mobile support." },
            { icon: <Database />, title: "Supabase Sync", desc: "Real-time edge computing ensures your taps are recorded and routed instantly." },
            { icon: <Shield />, title: "Auth Bridge", desc: "Secure Google OAuth handshakes for total user session integrity." },
            { icon: <Activity />, title: "Live Telemetry", desc: "Heatmaps and interaction data streamed directly to your workshop." }
          ].map((pill, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 hover:border-orange-500/50 transition-all">
              <div className="text-orange-500 mb-6">{pill.icon}</div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">{pill.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">{pill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE ENGINE (SOFTWARE STACK) */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-12 relative">
             {/* Background glow */}
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
             
             <div className="space-y-4">
                <div className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">Software Architecture</div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none pb-2">The <span className="inline-block text-orange-500 pr-4">Engine</span></h2>
             </div>
            
            <div className="space-y-6">
               {[
                 { title: "Dynamic Redirection", desc: "Instantly remap your station's destination without ever touching the hardware. Zero downtime, zero friction.", icon: <Zap size={18} /> },
                 { title: "Physical Webhooks", desc: "Trigger Zapier, Make, or custom API endpoints with a single tap. Bridge the gap between physical touch and digital workflow.", icon: <Cpu size={18} /> },
                 { title: "Deep Telemetry", desc: "Go beyond simple clicks. Capture device intelligence, location context, and interaction heatmaps in real-time.", icon: <Activity size={18} /> },
                 { title: "Fleet Orchestration", desc: "Manage 1 or 1,000 stations from a single artisan dashboard. Global control for the scaling brand.", icon: <Globe size={18} /> }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-tight text-white">{feature.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm">{feature.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
               {/* Terminal Header */}
               <div className="h-10 bg-white/5 border-b border-white/5 px-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  <div className="ml-4 text-[8px] font-mono text-slate-500 uppercase tracking-widest">engine_core.js</div>
               </div>
               
               {/* Code Mockup */}
               <div className="flex-1 p-8 font-mono text-[10px] md:text-xs leading-relaxed overflow-hidden">
                  <div className="flex gap-4">
                    <span className="text-slate-700">01</span>
                    <span className="text-blue-400">async function</span> <span className="text-orange-400">handleRedirect</span>(tap) &#123;
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">02</span>
                    <span className="ml-4 text-slate-500">// Fetch dynamic destination</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">03</span>
                    <span className="ml-4 text-blue-400">const</span> target = <span className="text-blue-400">await</span> engine.<span className="text-amber-400">lookup</span>(tap.serial);
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">04</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">05</span>
                    <span className="ml-4 text-slate-500">// Fire physical webhooks</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">06</span>
                    <span className="ml-4 text-blue-400">await</span> engine.<span className="text-amber-400">dispatch</span>(&#123;
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">07</span>
                    <span className="ml-8 text-white">event:</span> <span className="text-emerald-400">'STATION_TAP'</span>,
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">08</span>
                    <span className="ml-8 text-white">metadata:</span> tap.deviceInfo
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">09</span>
                    <span className="ml-4 text-white">&#125;);</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">10</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">11</span>
                    <span className="ml-4 text-blue-400">return</span> Response.<span className="text-amber-400">redirect</span>(target.url);
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-700">12</span>
                    <span>&#125;</span>
                  </div>
                  
                  {/* Glowing Pulse */}
                  <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-500/20 blur-[40px] rounded-full animate-pulse" />
               </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-orange-500/5 rounded-[4rem] -rotate-3 -z-10" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-tight pb-4">Build on a <br/> <span className="inline-block text-orange-500 font-black pr-8">Solid Foundation</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/shop"
              className="w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-orange-500 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_60px_rgba(249,115,22,0.4)]"
            >
              Visit SparkStore <ArrowRight size={20} />
            </Link>
            <Link 
              to="/identity"
              className="w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Explore Identity
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
