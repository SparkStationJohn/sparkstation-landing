export const HARDWARE = [
  {
    id: 'modular-stand-v1',
    name: 'SparkStation Modular Stand',
    category: 'Hardware',
    hero: true,
    comingSoon: true,
    description: 'The flagship artisan carrier plate. Rugged, modular signage system designed for boutique retail environments.',
    longDescription: 'Engineered for presence. The SparkStation Modular Stand is the definitive physical anchor for your digital identity. Featuring a "Zero-Hole" retention system and a high-fidelity artisan carrier plate, it provides a robust, professional mounting solution for 5x7 signage.',
    image_url: '/assets/stand.png',
    tag: 'Halo Series',
    features: [
      'Artisan Carrier Plate Engineering',
      'Spring-Bridge Retention System',
      'Magnetic Quick-Swap Interface',
      'Integrated SparkStation NFC Core'
    ],
    specs: {
      material: 'Industrial Grade Polymer / Metal',
      dimensions: '150mm x 200mm x 120mm',
      weight: '850g',
      nfc: 'NTAG215 High-Performance'
    }
  },
  {
    id: 'sparktag-sticker',
    name: 'SparkStation SparkTag',
    category: 'Accessories',
    price: 29.00,
    description: 'The flagship phygital gateway. Turn any surface, stand, or display into an interactive operational channel. 3mm Basswood inlay seated in a high-density 3D-printed industrial housing.',
    image_url: '/assets/sparktag_clean.png',
    tag: "Founder's Access",
    features: [
      'Artisan Basswood Inlay',
      'Zero-Damage Deploy — Magnetic + Adhesive',
      'NTAG215 Deep Telemetry',
      'Zero Friction — No App, No Battery'
    ]
  },
  {
    id: 'sparkcard-standard',
    name: 'SparkStation SparkCard',
    category: 'Accessories',
    comingSoon: true,
    description: 'Precision-laminated networking. Matte PVC core with a high-durability artisan vinyl overlay. Next production run in progress.',
    image_url: '/assets/sparkcard.png',
    tag: 'Coming Soon',
    features: ['High-Durability Vinyl', 'Hand-Assembled Quality', 'Instant Tap-to-Profile']
  },
  {
    id: 'sparkcard-pro',
    name: 'SparkStation SparkCard Pro',
    category: 'Accessories',
    comingSoon: true,
    description: 'Laser-engraved metal networking. The definitive first impression for the artisan brand.',
    image_url: '/assets/sparkcard_pro.png',
    tag: 'Future Drop',
    features: ['Weighted Aerospace Grade Metal', 'Precision Laser Engraving', 'Lifetime Tap Guarantee']
  },
  {
    id: 'sparkgo-keychain',
    name: 'SparkStation SparkGO',
    category: 'Accessories',
    price: 19.00,
    description: 'Your identity, always in motion. The ultra-slim, keychain-ready professional gateway — only 4mm thick with an integrated tactical loop. Engineered for the daily carry.',
    image_url: '/assets/sparkgo_clean.png',
    tag: "Founder's Access",
    features: [
      'Slimline 4mm Profile',
      'Tactical Carry Loop — Standard Keyring Compatible',
      'Dynamic Routing — Update on the Fly',
      'Premium Wood-and-Steel Aesthetic'
    ]
  }
];

export const MEMBERSHIPS = [
  {
    id: 'tier_free',
    name: 'Spark Free',
    price_monthly: 0,
    price_yearly: 0,
    description: 'Core microsite features and basic redirection for the rising brand.',
    tag: 'Starter',
    features: [
      'Manual Redirection', 
      'The Connect Template', 
      'Standard Attribution', 
      '3 Social Links', 
      '2 Active Stations',
      'SparkStation Watermark'
    ]
  },
  {
    id: 'tier_automate',
    name: 'Spark AUTOMATE',
    price_monthly: 9.00,
    price_yearly: 90.00,
    stripe_product_id: 'prod_UV6oqQhFbAG7Lc',
    stripe_price_id_monthly: 'price_1TW6aoIuPD1nOyYWmXutUQa2',
    stripe_price_id_yearly: 'price_1TW6bJIuPD1nOyYWkxELJVjK',
    description: 'The "Impulse Buy" for the HomeLab and Workshop hobbyist.',
    tag: 'Fleet Expansion',
    features: ['25 Active Stations', 'Physical Webhooks', 'Basic Automation', 'Priority Support'],
  },
  {
    id: 'tier_pro',
    name: 'Spark PRO',
    price_monthly: 19.00,
    price_yearly: 190.00,
    stripe_product_id: 'prod_UV6ruyZ1iDRje3',
    stripe_price_id_monthly: 'price_1TW6dtIuPD1nOyYW1OspvXqJ',
    stripe_price_id_yearly: 'price_1TW6eKIuPD1nOyYWKDlXe3ly',
    description: 'The ultimate Switchboard for established makers and brands.',
    tag: 'Most Popular',
    features: [
      '100 Active Stations', 
      'Dynamic Redirection', 
      'Secure Custom Domains',
      'Pulse Source Attribution', 
      'The Showcase Template', 
      'Premium Artisan Typography', 
      'Remove Global Branding'
    ],
    highlight: true
  },
  {
    id: 'tier_enterprise',
    name: 'Spark Fleet',
    price_monthly: null,
    price_yearly: null,
    contact: true,
    description: 'Bulk management and white-label options for agencies and large fleets.',
    tag: 'Custom Scale',
    features: ['Unlimited Stations', 'Fleet Orchestration', 'Team Permissions', 'White-Label Branding', 'Concierge Support']
  }
];
