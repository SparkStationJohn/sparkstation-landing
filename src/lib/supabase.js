import { createClient } from '@supabase/supabase-js';

// 1. Defensively capture variables
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safe Fallbacks (Non-functional but non-crashing)
const safeUrl = url && url.startsWith('http') ? url : 'https://placeholder.supabase.co';
const safeKey = key || 'placeholder-key';

if (!url || !key) {
  console.warn(
    "SparkStation Status: Running in DESIGN MODE (Offline). Auth/DB features will be mocked. " +
    "To enable live features, provide VITE_SUPABASE_URL in your .env or Netlify settings."
  );
}

// 3. Robust Client Initialization
export const sb = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
