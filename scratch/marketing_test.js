import { sb as supabase } from './supabase_test_client.js';
import { HARDWARE as fallbackHardware, MEMBERSHIPS as fallbackMemberships } from '../src/lib/products.js';

export const getHardware = async () => {
  try {
    const { data, error } = await supabase
      .from('marketing_hardware')
      .select('*')
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
