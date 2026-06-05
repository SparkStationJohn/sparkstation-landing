// Seeded demo data for the /demo preview — no Supabase required.
// All timestamps are computed at import time relative to "now".

const ts = (msAgo) => new Date(Date.now() - msAgo).toISOString();
const h  = (hours) => ts(hours  * 3_600_000);
const d  = (days)  => ts(days   * 86_400_000);

export const DEMO_PROFILE = {
  id: 'demo',
  username: 'studioembers',
  business_name: 'Studio Ember',
  full_name: 'Morgan Keller',
  bio: 'Handcrafted ceramic goods for modern living. Every piece tells a story.',
  logo_url: '/favicon.png',
  template_id: 'connect',
  subscription_tier: 'pro',
  social_links: [
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'tiktok',    url: 'https://tiktok.com'    },
    { platform: 'x',         url: 'https://x.com'         },
  ],
};

export const DEMO_ASSETS = [
  {
    id: 'demo-1',
    serial_number: 'SS-0042',
    nickname: 'Main Counter',
    tap_count: 23,
    status: 'active',
    device_type: 'sparkcard',
    redirects: [{ destination_url: 'tap.sparkstation.link/u/studioembers', mode: 'profile', destination_url_b: null, config: null }],
  },
  {
    id: 'demo-2',
    serial_number: 'SS-0043',
    nickname: 'Featured Display',
    tap_count: 18,
    status: 'active',
    device_type: 'sparkcard',
    redirects: [{ destination_url: 'tap.sparkstation.link/u/studioembers', mode: 'profile', destination_url_b: null, config: null }],
  },
  {
    id: 'demo-3',
    serial_number: 'SS-0044',
    nickname: 'Studio Entrance',
    tap_count: 6,
    status: 'active',
    device_type: 'sparktag',
    redirects: [{ destination_url: 'squarespace.com/studioembers/booking', mode: 'url', destination_url_b: null, config: null }],
  },
];

// 38 page views spread over 7 days for a convincing chart
export const DEMO_PAGE_VIEWS = [
  // Today — 8 views
  { id: 'pv1',  created_at: h(1),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv2',  created_at: h(2),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv3',  created_at: h(3),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv4',  created_at: h(4),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv5',  created_at: h(5),   source: 'sparktag',  device_type: 'mobile'  },
  { id: 'pv6',  created_at: h(6),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv7',  created_at: h(8),   source: 'direct',    device_type: 'desktop' },
  { id: 'pv8',  created_at: h(10),  source: 'instagram', device_type: 'mobile'  },
  // Yesterday — 6 views
  { id: 'pv9',  created_at: d(1),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv10', created_at: d(1),   source: 'sparktag',  device_type: 'mobile'  },
  { id: 'pv11', created_at: d(1),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv12', created_at: d(1),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv13', created_at: d(1),   source: 'direct',    device_type: 'mobile'  },
  { id: 'pv14', created_at: d(1),   source: 'linkedin',  device_type: 'desktop' },
  // Day 2 — 5 views
  { id: 'pv15', created_at: d(2),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv16', created_at: d(2),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv17', created_at: d(2),   source: 'sparktag',  device_type: 'mobile'  },
  { id: 'pv18', created_at: d(2),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv19', created_at: d(2),   source: 'direct',    device_type: 'mobile'  },
  // Day 3 — 7 views
  { id: 'pv20', created_at: d(3),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv21', created_at: d(3),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv22', created_at: d(3),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv23', created_at: d(3),   source: 'sparktag',  device_type: 'mobile'  },
  { id: 'pv24', created_at: d(3),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv25', created_at: d(3),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv26', created_at: d(3),   source: 'direct',    device_type: 'tablet'  },
  // Day 4 — 4 views
  { id: 'pv27', created_at: d(4),   source: 'tiktok',    device_type: 'mobile'  },
  { id: 'pv28', created_at: d(4),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv29', created_at: d(4),   source: 'linkedin',  device_type: 'desktop' },
  { id: 'pv30', created_at: d(4),   source: 'sparktag',  device_type: 'mobile'  },
  // Day 5 — 3 views
  { id: 'pv31', created_at: d(5),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv32', created_at: d(5),   source: 'direct',    device_type: 'mobile'  },
  { id: 'pv33', created_at: d(5),   source: 'tiktok',    device_type: 'mobile'  },
  // Day 6 — 3 views
  { id: 'pv34', created_at: d(6),   source: 'instagram', device_type: 'mobile'  },
  { id: 'pv35', created_at: d(6),   source: 'sparktag',  device_type: 'mobile'  },
  { id: 'pv36', created_at: d(6),   source: 'tiktok',    device_type: 'mobile'  },
  // Older — 2 views
  { id: 'pv37', created_at: d(10),  source: 'instagram', device_type: 'mobile'  },
  { id: 'pv38', created_at: d(12),  source: 'direct',    device_type: 'mobile'  },
];

// 47 total taps across 3 stations — lat/lng must be numbers for SparkMap
export const DEMO_TAPS = [
  { id: 't1',  created_at: h(0.5),  lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't2',  created_at: h(2),    lat: 37.774,  lng: -122.419, city: 'San Francisco', country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't3',  created_at: h(4),    lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Featured Display', serial_number: 'SS-0043' } },
  { id: 't4',  created_at: h(6),    lat: 40.712,  lng: -74.006,  city: 'New York',      country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't5',  created_at: h(8),    lat: 34.052,  lng: -118.244, city: 'Los Angeles',   country: 'US', assets: { nickname: 'Studio Entrance',  serial_number: 'SS-0044' } },
  { id: 't6',  created_at: h(12),   lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Featured Display', serial_number: 'SS-0043' } },
  { id: 't7',  created_at: h(16),   lat: 47.606,  lng: -122.332, city: 'Seattle',       country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't8',  created_at: h(20),   lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Featured Display', serial_number: 'SS-0043' } },
  { id: 't9',  created_at: h(24),   lat: 41.878,  lng: -87.630,  city: 'Chicago',       country: 'US', assets: { nickname: 'Studio Entrance',  serial_number: 'SS-0044' } },
  { id: 't10', created_at: h(28),   lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't11', created_at: d(2),    lat: 25.774,  lng: -80.190,  city: 'Miami',         country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't12', created_at: d(2),    lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Featured Display', serial_number: 'SS-0043' } },
  { id: 't13', created_at: d(3),    lat: 45.523,  lng: -122.676, city: 'Portland',      country: 'US', assets: { nickname: 'Main Counter',     serial_number: 'SS-0042' } },
  { id: 't14', created_at: d(3),    lat: 30.267,  lng: -97.743,  city: 'Austin',        country: 'US', assets: { nickname: 'Studio Entrance',  serial_number: 'SS-0044' } },
  { id: 't15', created_at: d(4),    lat: 32.776,  lng: -96.797,  city: 'Dallas',        country: 'US', assets: { nickname: 'Featured Display', serial_number: 'SS-0043' } },
];

export const DEMO_LEADS = [
  { id: 'l1',  created_at: h(3),   name: 'Sarah Chen',    email: 'sarah@example.com',   message: 'Love your work! Do you do custom orders?' },
  { id: 'l2',  created_at: d(1),   name: 'Marcus Webb',   email: 'marcus@example.com',  message: 'Interested in a set of 4 mugs for a wedding gift.' },
  { id: 'l3',  created_at: d(1),   name: 'Jordan Lee',    email: 'jordan@example.com',  message: 'Can you make custom planters in matte black?' },
  { id: 'l4',  created_at: d(2),   name: 'Priya Sharma',  email: 'priya@example.com',   message: 'Would love to wholesale your pieces for my shop.' },
  { id: 'l5',  created_at: d(2),   name: 'Alex Kim',      email: 'alex@example.com',    message: 'Inquiring about your studio tour availability.' },
  { id: 'l6',  created_at: d(3),   name: 'Devon Park',    email: 'devon@example.com',   message: 'Saw your TikTok! How do I order a piece?' },
  { id: 'l7',  created_at: d(3),   name: 'Riley Torres',  email: 'riley@example.com',   message: 'Interested in your matte glaze collection.' },
  { id: 'l8',  created_at: d(4),   name: 'Casey Morgan',  email: 'casey@example.com',   message: 'Do you ship internationally to Canada?' },
  { id: 'l9',  created_at: d(4),   name: 'Jamie Brooks',  email: 'jamie@example.com',   message: 'Love the vases — what\'s the price range?' },
  { id: 'l10', created_at: d(5),   name: 'Drew Hoffman',  email: 'drew@example.com',    message: 'Interested in commissioning a large floor piece.' },
  { id: 'l11', created_at: d(5),   name: 'Sam Rivera',    email: 'sam@example.com',     message: 'Could you show at our local art market in June?' },
  { id: 'l12', created_at: d(6),   name: 'Taylor Webb',   email: 'taylor@example.com',  message: 'Love the work — do you sell through Etsy?' },
];
