import { sb } from './supabase';

/**
 * Fetches all approved showcase items
 */
export const fetchShowcase = async () => {
  const { data, error } = await sb
    .from('community_showcase')
    .select('*, profiles(full_name, logo_url, showcase_bio)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching showcase:', error);
    return [];
  }
  return data;
};

/**
 * Fetches the current platform spotlight
 */
export const fetchSpotlight = async () => {
  // First get the spotlight ID from config
  const { data: config, error: configError } = await sb
    .from('site_config')
    .select('spotlight_showcase_id')
    .single();

  if (configError || !config?.spotlight_showcase_id) return null;

  // Then get the showcase item
  const { data, error } = await sb
    .from('community_showcase')
    .select('*, profiles(full_name, logo_url, showcase_bio)')
    .eq('id', config.spotlight_showcase_id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Fetches anonymized tap data for the global map
 */
export const fetchGlobalPulse = async (limit = 100) => {
  const { data, error } = await sb
    .from('taps')
    .select('id, lat, lng, city, country, created_at')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching global pulse:', error);
    return [];
  }
  return data;
};

/**
 * Fetches public artisan directory
 */
export const fetchArtisans = async () => {
  const { data, error } = await sb
    .from('discoverable_profiles')
    .select('id, username, full_name, logo_url, showcase_bio')
    .order('full_name');

  if (error) {
    console.error('Error fetching artisans:', error);
    return [];
  }
  return data;
};
/**
 * Fetches a public profile by its username
 */
export const fetchProfileByUsername = async (username) => {
  const { data, error } = await sb
    .from('profiles')
    .select('*, social_links')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};
