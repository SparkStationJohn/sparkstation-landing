import { getHardware, getMemberships } from './marketing_test.js';

async function testMarketingEngine() {
  console.log('--- TESTING ZERO-BUILD ENGINE ---');
  
  console.log('Fetching Hardware...');
  const hardware = await getHardware();
  console.log(`Found ${hardware.length} products.`);
  hardware.forEach(h => console.log(` - [${h.id}] ${h.name} ($${h.price || 'N/A'})`));

  console.log('\nFetching Memberships...');
  const memberships = await getMemberships();
  console.log(`Found ${memberships.length} tiers.`);
  memberships.forEach(m => console.log(` - [${m.id}] ${m.name} ($${m.price_monthly}/mo)`));

  console.log('\n--- TEST COMPLETE ---');
}

testMarketingEngine();
