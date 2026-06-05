import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, TrendingUp, Users, Zap, Target,
  Smartphone, Monitor, BarChart3, MapPin, Radio, Tablet
} from 'lucide-react';
import SparkMap from './SparkMap';
import SocialIcon from './SocialIcon';

const KNOWN_SOURCES = ['instagram', 'tiktok', 'x', 'linkedin', 'facebook', 'sparktag', 'direct'];

const SOURCE_CONFIG = [
  { id: 'sparktag',  label: 'SparkTag',    color: '#f97316' },
  { id: 'instagram', label: 'Instagram',   color: '#E1306C' },
  { id: 'tiktok',    label: 'TikTok',      color: '#69C9D0' },
  { id: 'x',         label: 'X / Twitter', color: '#1DA1F2' },
  { id: 'linkedin',  label: 'LinkedIn',    color: '#0077b5' },
  { id: 'facebook',  label: 'Facebook',    color: '#1877F2' },
  { id: 'direct',    label: 'Direct / QR', color: '#64748b' },
  { id: 'other',     label: 'Other',       color: '#a855f7' },
];

export default function Analytics({ recentActivity, pageViews, leads, assets }) {
  const [trafficWindow, setTrafficWindow] = useState('7d');

  // ── KPIs ─────────────────────────────────────────────────────────────
  const totalTaps = useMemo(
    () => assets.reduce((sum, a) => sum + (a.tap_count || 0), 0),
    [assets]
  );
  const totalViews  = pageViews.length;
  const totalLeads  = leads.length;
  const conversion  = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0.0';

  // ── 7-Day Pulse ───────────────────────────────────────────────────────
  const pulseData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const data = days.map(day => ({
      date: day,
      shortLabel: new Date(`${day}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }),
      count: pageViews.filter(v => v.created_at.startsWith(day)).length,
    }));

    const today     = data[6]?.count || 0;
    const yesterday = data[5]?.count || 0;
    const diff      = today - yesterday;
    const trend     = yesterday === 0 ? (today > 0 ? 100 : 0) : Math.round((diff / yesterday) * 100);
    return { data, trend, diff };
  }, [pageViews]);

  // ── Source Attribution ────────────────────────────────────────────────
  const { sourceStats, sourceTotal } = useMemo(() => {
    const windows = { '24h': 86_400_000, '7d': 604_800_000 };
    const cutoff  = trafficWindow === 'all' ? null : new Date(Date.now() - windows[trafficWindow]).toISOString();
    const slice   = trafficWindow === 'all' ? pageViews : pageViews.filter(v => v.created_at >= cutoff);

    const stats = slice.reduce((acc, v) => {
      const src = (v.source || 'direct').toLowerCase();
      const key = KNOWN_SOURCES.includes(src) ? src : 'other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return { sourceStats: stats, sourceTotal: Object.values(stats).reduce((a, b) => a + b, 0) || 1 };
  }, [pageViews, trafficWindow]);

  // ── Device Split ──────────────────────────────────────────────────────
  const deviceStats = useMemo(() =>
    pageViews.reduce((acc, v) => {
      const d = (v.device_type || 'desktop').toLowerCase();
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {}),
    [pageViews]
  );
  const deviceTotal = Object.values(deviceStats).reduce((a, b) => a + b, 0) || 1;

  // ── Station Ranking ───────────────────────────────────────────────────
  const stationRanking = useMemo(() =>
    [...assets].filter(a => (a.tap_count || 0) > 0)
               .sort((a, b) => b.tap_count - a.tap_count)
               .slice(0, 6),
    [assets]
  );

  // ── UTM Campaigns ─────────────────────────────────────────────────────
  const campaignStats = useMemo(() =>
    Object.entries(
      pageViews.filter(v => v.utm_campaign).reduce((acc, v) => {
        acc[v.utm_campaign] = (acc[v.utm_campaign] || 0) + 1;
        return acc;
      }, {})
    ).sort(([, a], [, b]) => b - a).slice(0, 8),
    [pageViews]
  );

  return (
    <div className="space-y-8">

      {/* ── KPI HEADER ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Taps',     value: totalTaps.toLocaleString(), sub: 'All-time NFC activations',  icon: Zap,       color: 'text-orange-500', bg: 'bg-orange-500/10'  },
          { label: 'Profile Views',  value: totalViews.toLocaleString(), sub: 'Microsite visits logged',  icon: Users,     color: 'text-blue-400',   bg: 'bg-blue-500/10'    },
          { label: 'Leads Captured', value: totalLeads.toLocaleString(), sub: 'Contact submissions',      icon: Target,    color: 'text-green-400',  bg: 'bg-green-500/10'   },
          { label: 'Conversion Rate',value: `${conversion}%`,           sub: 'Views → lead captures',    icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className={`text-3xl font-black ${color} leading-none`}>{value}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT — 2/3 */}
        <div className="lg:col-span-2 space-y-8">

          {/* INTERACTION MAP */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Interaction Map</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Last {recentActivity.length} hardware activations
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <MapPin size={18} className="text-orange-500" />
              </div>
            </div>
            <SparkMap taps={recentActivity} />
          </div>

          {/* CONVERSION FUNNEL */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 blur-[60px] pointer-events-none" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Conversion Funnel</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tap → View → Lead</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <Target size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Hardware Taps',  count: totalTaps,  color: '#f97316', note: 'Physical NFC activations' },
                { label: 'Profile Views',  count: totalViews, color: '#60a5fa', note: 'Landed on microsite'       },
                { label: 'Lead Captures',  count: totalLeads, color: '#4ade80', note: 'Submitted contact info'    },
              ].map((stage, i) => {
                const pct = totalTaps > 0 ? Math.min(100, Math.round((stage.count / totalTaps) * 100)) : 0;
                return (
                  <div key={stage.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[9px] font-black text-slate-600 shrink-0 w-4">{i + 1}</span>
                        <span className="text-sm font-black text-white">{stage.label}</span>
                        <span className="text-[9px] text-slate-500 hidden md:block truncate">{stage.note}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-2xl font-black" style={{ color: stage.color }}>{stage.count.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-slate-600 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRAFFIC INTELLIGENCE */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] pointer-events-none" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Traffic Intelligence</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Source-Based Attribution</p>
              </div>
              <div className="flex items-center gap-1.5">
                {['24h', '7d', 'all'].map(w => (
                  <button
                    key={w}
                    onClick={() => setTrafficWindow(w)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      trafficWindow === w ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-500 hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SOURCE_CONFIG.map(source => {
                const count = sourceStats[source.id] || 0;
                if (source.id === 'other' && count === 0) return null;
                const pct = Math.round((count / sourceTotal) * 100);
                return (
                  <div key={source.id} className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 overflow-hidden">
                        <SocialIcon platform={source.id === 'sparktag' ? 'website' : source.id} size={16} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600">{pct}%</span>
                    </div>
                    <div className="text-2xl font-black text-white leading-none">{count}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{source.label}</div>
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: source.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THIS WEEK */}
            <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-sm font-black text-white">This Week</h4>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5">Profile views · last 7 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                    pulseData.diff >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {pulseData.diff >= 0 ? '+' : ''}{pulseData.trend}% today
                  </div>
                  <TrendingUp size={14} className="text-orange-500" />
                </div>
              </div>

              <div className="flex items-end gap-2">
                {(() => {
                  const max = Math.max(...pulseData.data.map(x => x.count)) || 1;
                  return pulseData.data.map((d, i) => {
                    const barPx = Math.max(Math.round((d.count / max) * 56), 8);
                    const isToday = i === 6;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[9px] font-black leading-none ${
                          isToday ? 'text-orange-500' : d.count > 0 ? 'text-slate-400' : 'text-slate-700'
                        }`}>
                          {d.count > 0 ? d.count : '·'}
                        </span>
                        <div
                          className={`w-full rounded-t-md transition-all duration-700 ${
                            isToday
                              ? 'bg-orange-500 shadow-sm shadow-orange-500/40'
                              : 'bg-orange-500/25 hover:bg-orange-500/50'
                          }`}
                          style={{ height: `${barPx}px` }}
                        />
                        <span className={`text-[8px] font-bold uppercase tracking-tight ${
                          isToday ? 'text-orange-500' : 'text-slate-600'
                        }`}>
                          {d.shortLabel}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* UTM CAMPAIGN INTELLIGENCE — conditional */}
          {campaignStats.length > 0 && (
            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic">Campaign Intelligence</h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">UTM Campaign Attribution</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <BarChart3 size={18} className="text-orange-500" />
                </div>
              </div>
              <div className="space-y-3">
                {campaignStats.map(([campaign, count]) => {
                  const pct = Math.round((count / totalViews) * 100);
                  return (
                    <div key={campaign} className="flex items-center gap-4">
                      <div className="text-sm font-black text-white flex-1 truncate">{campaign}</div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-28 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-orange-500 w-6 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — 1/3 */}
        <div className="space-y-6">

          {/* LIVE FEED */}
          <div className="glass p-6 rounded-[2.5rem] border border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
              <h3 className="text-base font-black text-white uppercase italic">Live Feed</h3>
            </div>
            <div className="space-y-2">
              {recentActivity.length === 0 && (
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-6">
                  Awaiting first tap…
                </p>
              )}
              {recentActivity.slice(0, 10).map((tap, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                      <Radio size={13} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{tap.assets?.nickname || tap.assets?.serial_number}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase truncate">
                        {tap.city || 'Unknown'}{tap.country ? `, ${tap.country}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] font-black text-slate-500 italic shrink-0 ml-2">
                    {new Date(tap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATION RANKING */}
          {stationRanking.length > 0 && (
            <div className="glass p-6 rounded-[2.5rem] border border-white/5">
              <h3 className="text-base font-black text-white uppercase italic mb-5">Station Ranking</h3>
              <div className="space-y-3">
                {stationRanking.map((asset, i) => {
                  const maxTaps = stationRanking[0]?.tap_count || 1;
                  const pct     = Math.round((asset.tap_count / maxTaps) * 100);
                  return (
                    <div key={asset.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] font-black text-slate-600 shrink-0">{i + 1}</span>
                          <span className="text-xs font-black text-white truncate">{asset.nickname || asset.serial_number}</span>
                        </div>
                        <span className="text-sm font-black text-orange-500 shrink-0 ml-2">{asset.tap_count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500/50 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEVICE SPLIT */}
          {totalViews > 0 && (
            <div className="glass p-6 rounded-[2.5rem] border border-white/5">
              <h3 className="text-base font-black text-white uppercase italic mb-5">Device Split</h3>
              <div className="space-y-3">
                {[
                  { key: 'mobile',  label: 'Mobile',  icon: Smartphone, color: '#f97316' },
                  { key: 'desktop', label: 'Desktop', icon: Monitor,    color: '#60a5fa' },
                  { key: 'tablet',  label: 'Tablet',  icon: Tablet,     color: '#a78bfa' },
                ].map(({ key, label, icon: Icon, color }) => {
                  const count = deviceStats[key] || 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / deviceTotal) * 100);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <Icon size={14} style={{ color }} className="shrink-0" />
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                          <span className="text-[10px] font-black" style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
