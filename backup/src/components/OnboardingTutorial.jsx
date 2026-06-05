
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Cpu, User, Bell, BarChart3, Mail, ArrowRight, X, Sparkles,
  Target, Link as LinkIcon, Settings, Package, QrCode
} from 'lucide-react';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Command Center',
    description: 'This is your SparkStation dashboard — everything in one place. Quick 2-minute tour and you\'ll know exactly how it all works.',
    bullets: null,
    icon: Zap,
    highlight: null,
    view: null,
  },
  {
    id: 'stations',
    title: 'Your Stations',
    description: 'Each card here is one physical SparkStation unit you own. This is your fleet HQ.',
    bullets: [
      'Tap count updates in real time',
      'Hit "Deploy New Station" to activate a new unit',
      'Select multiple cards to sync missions across your whole fleet at once',
    ],
    icon: Cpu,
    highlight: 'sidebar-devices',
    view: 'devices',
  },
  {
    id: 'mission-config',
    title: 'Station Missions',
    description: 'A Mission is what happens when someone taps your station. Set it per card.',
    bullets: [
      'My Profile — sends to your SparkStation profile page',
      'Custom URL — any link you want',
      'Schedule — different destinations by time of day or day of week',
      'Webhook — fire a Zapier or custom automation on every tap',
      'Hit the QR icon on any card for an instant downloadable QR code',
    ],
    icon: Target,
    highlight: 'station-config-area',
    view: 'devices',
  },
  {
    id: 'link-vault',
    title: 'Link Vault',
    description: 'Your saved URL library. Store links here once — reuse them across any station.',
    bullets: [
      'Add any link: portfolio, booking page, menu, product drop',
      'Select from a dropdown inside any station card mission',
      'Update the link here and every station using it updates instantly',
    ],
    icon: LinkIcon,
    highlight: 'sidebar-links',
    view: 'links',
  },
  {
    id: 'identity',
    title: 'Edit My Profile',
    description: 'This is the page people land on when they tap your station. Build your digital identity here.',
    bullets: [
      'Photo, name, bio, and contact buttons',
      'Social links and custom brand colors',
      'Enable Lead Capture to collect visitor contact info',
      'All changes go live instantly across your entire fleet',
    ],
    icon: User,
    highlight: 'sidebar-identity',
    view: 'identity',
  },
  {
    id: 'alerts',
    title: 'Alert Center',
    description: 'Get notified the moment any station in your fleet is tapped.',
    bullets: [
      'Push notifications — browser alerts in real time',
      'Email alerts — daily digest of fleet activity',
    ],
    icon: Bell,
    highlight: 'sidebar-notifications',
    view: 'notifications',
  },
  {
    id: 'leads',
    title: 'Leads Vault',
    description: 'Every contact form submission from your profile lands here — ready to follow up.',
    bullets: [
      'Name, email, and phone captured automatically',
      'Enable lead capture in "Edit My Profile" → Lead Capture zone',
    ],
    icon: Mail,
    highlight: 'sidebar-leads',
    view: 'leads',
  },
  {
    id: 'orders',
    title: 'Order History',
    description: 'All your hardware and subscription purchases in one place.',
    bullets: [
      'Track order status and shipping',
      'View itemized receipts for every transaction',
    ],
    icon: Package,
    highlight: 'sidebar-orders',
    view: 'orders',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'See exactly where your stations are being tapped and where your traffic comes from.',
    bullets: [
      'Global interaction map — every tap plotted by location',
      'Traffic Intelligence — Instagram, TikTok, Direct, and more',
      '7-day trend chart and 24h pulse velocity',
      'Full analytics unlocks on the Pro plan',
    ],
    icon: BarChart3,
    highlight: 'sidebar-analytics',
    view: 'analytics',
  },
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Manage your subscription and advanced settings.',
    bullets: [
      'View your active tier and upgrade anytime',
      'Open the Stripe billing portal to manage payments',
      'Configure a custom domain for your profile link',
    ],
    icon: Settings,
    highlight: 'sidebar-account',
    view: 'account',
  },
];

export default function OnboardingTutorial({ onComplete, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (step.view) {
      onNavigate(step.view);
    }
  }, [step.view, onNavigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step.highlight) {
        const element = document.querySelector(`[data-onboard="${step.highlight}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          setSpotlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            rx: rect.width / 2 + 16,
            ry: rect.height / 2 + 16,
          });
        } else {
          setSpotlightRect(null);
        }
      } else {
        setSpotlightRect(null);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [step.highlight, step.view]);

  const maskImage = spotlightRect
    ? `radial-gradient(ellipse ${spotlightRect.rx}px ${spotlightRect.ry}px at ${spotlightRect.centerX}px ${spotlightRect.centerY}px, transparent 99%, black 100%)`
    : 'none';

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Dimmed overlay with ellipse cutout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/60 pointer-events-auto"
        style={{ maskImage, WebkitMaskImage: maskImage }}
        onClick={onComplete}
      />

      {/* Spotlight border ring */}
      <AnimatePresence>
        {spotlightRect && (
          <motion.div
            key={step.id + '-spotlight'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute border-2 border-orange-500 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.35)] z-[210] pointer-events-none"
            style={{
              top: spotlightRect.top - 8,
              left: spotlightRect.left - 8,
              width: spotlightRect.width + 16,
              height: spotlightRect.height + 16,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial card — bottom-right */}
      <div className="absolute bottom-6 right-6 w-full max-w-sm pointer-events-none px-4 md:px-0">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="w-full glass border border-orange-500/30 rounded-[2rem] shadow-2xl relative pointer-events-auto overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none" />

          <div className="p-6 relative z-10">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4 pr-6">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <step.icon size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tight italic leading-tight flex items-center gap-1.5">
                  {step.title}
                  {step.highlight && <Sparkles size={11} className="text-orange-500 animate-pulse" />}
                </h2>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Bullets */}
            {step.bullets && (
              <ul className="space-y-1.5 mb-4 pl-1">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-slate-400 font-medium leading-snug">
                    <span className="mt-1 w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex gap-1 flex-wrap">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-1 transition-all duration-300 rounded-full ${i === currentStep ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/10 hover:bg-white/20'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{currentStep + 1}/{STEPS.length}</span>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  {currentStep === STEPS.length - 1 ? 'Launch' : 'Next'}
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
