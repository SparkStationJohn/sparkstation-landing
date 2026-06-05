import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ShoppingBag, User, ArrowRight, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { fetchSiteConfig } from '../lib/marketing';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState(null);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => setSession(session));

    // Fetch site configuration
    fetchSiteConfig().then(config => {
      if (config) setSiteConfig(config);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'SparkStore', path: '/shop' },
    { label: 'Community', path: '/community' },
    { label: 'How it Works?', path: '/how-it-works' },
    { label: 'Vision', path: '/why-sparkstation' },
    { label: 'Identity', path: '/identity' },
  ];

  const isActive = (path) => location.pathname === path;

  // HIDE HEADER ON DASHBOARD to avoid clashing with dashboard sidebar/header
  if (location.pathname === '/dashboard') return null;

  // CONTEXTUAL THEMING:
  // If not scrolled, we force 'white' text because the hero sections have dark backgrounds.
  // If scrolled, we use 'primary' to follow the user's Light/Dark mode choice.
  const headerTextColor = !scrolled ? 'text-white' : 'text-primary';
  const headerSecondaryColor = !scrolled ? 'text-white/60' : 'text-secondary';
  const headerIconColor = !scrolled ? 'text-white' : 'text-primary';
  const headerBgHover = !scrolled ? 'hover:bg-white/10' : 'hover:bg-surface-alt';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-6'
    }`}>
      {/* GLOBAL BANNER */}
      <AnimatePresence>
        {siteConfig?.banner_active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="w-full bg-orange-500 overflow-hidden"
          >
            <Link 
              to={siteConfig.banner_link || '#'} 
              className="flex items-center justify-center gap-4 py-2.5 px-6 text-center group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {siteConfig.banner_text}
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Learn More</span>
                <ArrowRight size={12} className="text-white/80" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between p-4 rounded-[2rem] border transition-all duration-500 ${
          scrolled 
            ? 'glass shadow-2xl border-border-subtle' 
            : 'bg-transparent border-transparent'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <Zap size={20} fill="white" />
            </div>
            <span className={`text-xl font-black tracking-tighter uppercase hidden sm:block ${headerTextColor}`}>
              Spark<span className="text-orange-500">Station</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-orange-500 ${
                  isActive(link.path) ? 'text-orange-500' : headerSecondaryColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-colors group ${headerBgHover}`}
            >
              {theme === 'dark' ? <Sun size={20} className={`${headerIconColor} group-hover:scale-110 transition-transform`} /> : <Moon size={20} className={`${headerIconColor} group-hover:scale-110 transition-transform`} />}
            </button>

            {/* Bag */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`p-3 rounded-xl text-primary transition-colors relative group ${headerBgHover} ${headerIconColor}`}
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 text-[8px] font-black flex items-center justify-center border border-slate-950">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth/Account */}
            <div className="h-8 w-[1px] bg-border-subtle mx-2 hidden sm:block" />
            
            {session ? (
              <Link 
                to="/dashboard"
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border border-border-subtle hover:bg-orange-500 hover:text-white transition-all group ${!scrolled ? 'bg-white/10' : 'bg-surface-alt'}`}
              >
                <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <LayoutDashboard size={14} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:block group-hover:text-white ${headerTextColor}`}>Workshop</span>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="px-6 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2"
              >
                Login <ArrowRight size={14} />
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-3 rounded-xl transition-colors ${headerBgHover} ${headerIconColor}`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full px-6 py-4"
          >
            <div className="glass rounded-[2rem] p-8 space-y-6 shadow-2xl">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-border-subtle flex flex-col gap-4">
                {session ? (
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-surface-alt border border-border-subtle text-[10px] font-black uppercase tracking-widest text-primary"
                  >
                    <LayoutDashboard size={16} /> My Workshop
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 rounded-2xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
