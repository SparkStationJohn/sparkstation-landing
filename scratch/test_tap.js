import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testTap() {
  console.log('Testing increment_tap for DEV001...');
  const { data, error } = await sb.rpc('increment_tap', {
    target_serial_number: 'DEV001',
    p_lat: 40.7128,
    p_lng: -74.0060,
    p_city: 'New York',
    p_country: 'USA',
    p_metadata: { source: 'debug_test' }
  });

  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('RPC Success:', data);
  }
}

testTap();
