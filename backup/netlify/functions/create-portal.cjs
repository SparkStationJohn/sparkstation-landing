const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Only load dotenv if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

exports.handler = async (event) => {
  console.log('--- START PORTAL SESSION HANDLER ---');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Validate Environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.JJ_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    console.log('Checking Environment Variables...');
    if (!supabaseUrl) console.error('MISSING: supabaseUrl');
    if (!supabaseKey) console.error('MISSING: supabaseKey');
    if (!stripeSecret) console.error('MISSING: stripeSecret');

    if (!supabaseUrl || !supabaseKey || !stripeSecret) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ 
          error: 'System Configuration Error: Missing environment variables.',
          details: { url: !!supabaseUrl, key: !!supabaseKey, stripe: !!stripeSecret }
        }) 
      };
    }

    const stripe = new Stripe(stripeSecret);
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Request body is empty' }) };
    }

    const { userId, returnUrl } = JSON.parse(event.body);
    console.log('Request for UserId:', userId);

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'User ID is required' }) };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Database Error:', profileError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Database access failed', details: profileError.message }) };
    }

    if (!profile?.stripe_customer_id) {
      console.warn('Customer not found for user:', userId);
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Stripe Customer ID not found. Please complete a purchase first.' }) 
      };
    }

    console.log('Creating Portal Session for Customer:', profile.stripe_customer_id);
    const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'http://localhost:8888';
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl || `${baseUrl}/dashboard`,
    });

    console.log('Portal Session Created Successfully');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('CRITICAL PORTAL ERROR:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};
