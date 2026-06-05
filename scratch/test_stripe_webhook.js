import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load Environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.JJ_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SIMULATOR: Mimics the logic of the Stripe Webhook
 * This verifies the "Back Office" visibility by creating a rich purchase record.
 */
async function simulateSuccessfulHardwareOrder() {
  console.log('🚀 INITIALIZING STRIPE WEBHOOK SIMULATION...');

  // 1. Mock the Order Details
  const sessionId = `test_session_${Date.now()}`;
  const orderNumber = `SPARK-TEST-${Math.random().toString(36).substring(7).toUpperCase()}`;
  
  // 2. Mock the Line Items (The "Artisan Registry" Fix)
  const mockLineItems = [
    {
      name: 'SparkGO Artisan Keytag ($19 Launch)',
      quantity: 1,
      price: 19.00,
      currency: 'usd'
    },
    {
      name: 'SparkTag - Black Walnut Edition',
      quantity: 2,
      price: 19.00,
      currency: 'usd'
    }
  ];

  console.log(`📦 Simulating Order ${orderNumber} with ${mockLineItems.length} items...`);

  try {
    // 3. Execute the "Ironclad" Upsert logic
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .upsert({
        order_number: orderNumber,
        customer_email: 'test-artisan@example.com',
        customer_name: 'Test Artisan Commander',
        total_amount: 57.00, // (1x19) + (2x19)
        stripe_session_id: sessionId,
        status: 'completed',
        // Mock Shipping
        shipping_address_line1: '123 Maker Way',
        shipping_city: 'Craftsville',
        shipping_state: 'TX',
        shipping_postal_code: '75001',
        shipping_country: 'US',
        // THE FIX: Storing the detailed JSONB items
        items: mockLineItems,
        metadata: { 
          is_test: true,
          simulation: 'Artisan Schema Audit'
        }
      }, { onConflict: 'stripe_session_id' })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    console.log('✅ SIMULATION SUCCESSFUL.');
    console.log(`📊 Purchase ID: ${purchase.id}`);
    console.log(`🔗 Order Number: ${purchase.order_number}`);
    console.log('---');
    console.log('Line Items stored in JSONB:');
    console.table(purchase.items);
    
    console.log('\n[RESULT] Your Back Office can now see exactly what was ordered.');
  } catch (err) {
    console.error('❌ SIMULATION FAILED:', err.message);
  }
}

simulateSuccessfulHardwareOrder();
