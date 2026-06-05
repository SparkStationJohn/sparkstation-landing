import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.JJ_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  supabaseUrl,
  supabaseKey // Use service role to bypass RLS for administrative updates
);

export const handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Netlify may base64 encode the body; Stripe needs the raw string/buffer
  // We use Buffer.from to ensure we have a consistent format for the signature check
  // 1. GET RAW BODY: Stripe requires the EXACT raw string for signature verification.
  // We MUST NOT stringify or modify the body if it's already a string.
  const rawBody = event.isBase64Encoded 
    ? Buffer.from(event.body, 'base64').toString() 
    : event.body;

  let stripeEvent;

  try {
    // Verify webhook signature to prevent spoofing
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`[STRIPE WEBHOOK ERROR] Signature Verification Failed: ${err.message}`);
    console.error(`[DEBUG] Header Sig: ${sig?.slice(0, 10)}...`);
    console.error(`[DEBUG] Secret Used: ${endpointSecret?.slice(0, 10)}...`);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: `Webhook Error: ${err.message}`, note: 'Check if STRIPE_WEBHOOK_SECRET matches the environment (Test vs Live)' }) 
    };
  }

  // Map Stripe price IDs → internal tier names
  const priceToTier = {
    'price_1TW6aoIuPD1nOyYWmXutUQa2': 'automate',
    'price_1TW6bJIuPD1nOyYWkxELJVjK': 'automate',
    'price_1TW6dtIuPD1nOyYW1OspvXqJ': 'pro',
    'price_1TW6eKIuPD1nOyYWKDlXe3ly': 'pro',
  };

  // ── CHECKOUT COMPLETED → upgrade tier, store customer ID, log purchase ──
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const { userId, tierId } = session.metadata || {};
    const shipping = session.shipping_details || {};
    const address = shipping.address || {};

    // Generate a human-friendly order number (e.g. SPARK-A1B2)
    const orderNumber = `SPARK-${session.id.slice(-6).toUpperCase()}`;

    // 0. Check for Idempotency (Prevent duplicate fulfillment)
    const { data: existingOrder } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existingOrder) {
      console.log(`ORDER ALREADY FULFILLED: ${session.id}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ received: true, duplicate: true })
      };
    }

    console.log(`PROCESSING ORDER: ${orderNumber} for ${session.customer_details.email}`);

    try {
      // 0.5 Fetch Line Items (Crucial for hardware visibility)
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });
      const lineItems = lineItemsResponse.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100,
        currency: item.currency
      }));
      // 1. If it's a subscription upgrade or we have user data, update the profile
      if (userId) {
        const tierMapping = {
          'tier_automate': 'automate',
          'tier_pro': 'pro',
          'tier_enterprise': 'enterprise'
        };
        const dbTier = tierId ? tierMapping[tierId] : undefined;
        const marketingOptIn = session.consent?.promotions === 'opt_in';
        
        await supabase
          .from('profiles')
          .update({ 
            ...(dbTier && { subscription_tier: dbTier }),
            marketing_opt_in: marketingOptIn,
            stripe_customer_id: session.customer 
          })
          .eq('id', userId);
      }

      // 2. Create the IRONCLAD purchase record
      // We use UPSERT on stripe_session_id to prevent duplicates if Stripe retries
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .upsert({
          order_number: orderNumber,
          profile_id: userId || null,
          customer_email: session.customer_details.email,
          customer_name: session.customer_details.name || 'Artisan Commander',
          total_amount: session.amount_total / 100,
          stripe_session_id: session.id,
          status: 'completed',
          // Capture full shipping information
          shipping_address_line1: address.line1,
          shipping_address_line2: address.line2,
          shipping_city: address.city,
          shipping_state: address.state,
          shipping_postal_code: address.postal_code,
          shipping_country: address.country,
          items: lineItems,
          metadata: { 
            checkout_session_id: session.id,
            shipping_name: shipping.name,
            is_subscription: !!tierId
          }
        }, { onConflict: 'stripe_session_id' })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // 3. Trigger Email Receipt (Edge Function) - NON-BLOCKING
      const functionUrl = `${supabaseUrl}/functions/v1/send-receipt`;
      fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ purchase_id: purchase.id })
      }).catch(err => console.error('[STRIPE WEBHOOK] Receipt Trigger Error (Non-Fatal):', err.message));

      console.log(`ORDER ${orderNumber} SYNCED & FULFILLED.`);
    } catch (dbErr) {
      console.error('CRITICAL FULFILLMENT ERROR:', dbErr.message);
      return { statusCode: 500, body: 'Internal Fulfillment Error' };
    }
  }

  // ── SUBSCRIPTION UPDATED → sync tier when user upgrades/downgrades via portal ──
  if (stripeEvent.type === 'customer.subscription.updated') {
    const subscription = stripeEvent.data.object;
    const customerId = subscription.customer;
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const newTier = priceToTier[priceId];

    if (!newTier) {
      console.warn(`Unknown price ID on subscription update: ${priceId}`);
      return { statusCode: 200, body: JSON.stringify({ received: true }) };
    }

    console.log(`SUBSCRIPTION UPDATED: customer ${customerId} → tier ${newTier}`);

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: newTier })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('Failed to sync subscription update:', error.message);
      return { statusCode: 500, body: 'Sync Error' };
    }
  }

  // ── SUBSCRIPTION DELETED → downgrade to free when cancelled ──
  if (stripeEvent.type === 'customer.subscription.deleted') {
    const subscription = stripeEvent.data.object;
    const customerId = subscription.customer;

    console.log(`SUBSCRIPTION CANCELLED: customer ${customerId} → downgrading to free`);

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('Failed to downgrade subscription:', error.message);
      return { statusCode: 500, body: 'Downgrade Error' };
    }

    console.log(`Successfully downgraded customer ${customerId} to free.`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
