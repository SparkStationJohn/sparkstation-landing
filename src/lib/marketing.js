import { sb as supabase } from './supabase';
import { HARDWARE as fallbackHardware, MEMBERSHIPS as fallbackMemberships } from './products';

/**
 * Fetches marketing hardware from Supabase with a hardcoded fallback.
 * This enables "Zero-Build" content updates.
 */
export const getHardware = async () => {
  try {
    const { data, error } = await supabase
      .from('marketing_hardware')
      .select('*, status')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using fallback hardware data:', error?.message);
      return fallbackHardware;
    }

    return data;
  } catch (err) {
    console.error('Marketing Fetch Error (Hardware):', err);
    return fallbackHardware;
  }
};

/**
 * Fetches membership tiers from Supabase with a hardcoded fallback.
 */
export const getMemberships = async () => {
  try {
    const { data, error } = await supabase
      .from('marketing_memberships')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using fallback membership data:', error?.message);
      return fallbackMemberships;
    }

    return data;
  } catch (err) {
    console.error('Marketing Fetch Error (Memberships):', err);
    return fallbackMemberships;
  }
};

/**
 * Fetches all active marketing FAQs
 */
export const fetchMarketingFAQ = async () => {
  try {
    const { data, error } = await supabase
      .from('marketing_faq')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Marketing FAQ Fetch Error:', err);
    return [];
  }
};

/**
 * Fetches all active marketing solutions (Missions)
 */
export const fetchMarketingSolutions = async () => {
  try {
    const { data, error } = await supabase
      .from('marketing_solutions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Marketing Solutions Fetch Error:', err);
    return [];
  }
};

/**
 * Fetches all active marketing features by section
 */
export const fetchMarketingFeatures = async (section) => {
  try {
    let query = supabase
      .from('marketing_features')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Marketing Features Fetch Error:', err);
    return [];
  }
};

/**
 * Fetches global site configuration
 */
export const fetchSiteConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Site Config Fetch Error:', err);
    return null;
  }
};

/**
 * Fetches SEO data for a specific path
 */
export const fetchSEO = async (path) => {
  try {
    const { data, error } = await supabase
      .from('site_seo')
      .select('*')
      .eq('path', path)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    // If no specific SEO for path, return null to use defaults
    return null;
  }
};


