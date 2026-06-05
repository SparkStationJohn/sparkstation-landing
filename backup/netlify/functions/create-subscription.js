import Stripe from 'stripe';

export const handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

   try {
    const { userId, userEmail, tierId, stripePriceId, interval } = JSON.parse(event.body);

    const TIER_DATA = {
      'tier_automate': { 
        name: 'Spark AUTOMATE', 
        monthly: 900, 
        yearly: 9000,
        desc: 'Unlock 25 active stations, physical webhooks, and basic automation.'
      },
      'tier_pro': { 
        name: 'Spark PRO', 
        monthly: 1900, 
        yearly: 19000,
        desc: 'Unlock 100 stations, dynamic time-linking, and deep telemetry.'
      },
      'tier_enterprise': { 
        name: 'Spark Fleet', 
        monthly: 4900, 
        yearly: 49000,
        desc: 'Unlimited stations, white-label branding, and fleet orchestration.'
      }
    };

    const tier = TIER_DATA[tierId] || TIER_DATA['tier_pro'];
    const price = interval === 'year' ? tier.yearly : tier.monthly;
    const tierName = tier.name;
    const tierDesc = tier.desc;

    // Use specific price ID if provided by the frontend (preferred)
    // Otherwise fall back to dynamic price_data (backward compatibility)
    const lineItem = stripePriceId ? {
      price: stripePriceId,
      quantity: 1,
    } : {
      price_data: {
        currency: 'usd',
        product_data: {
          name: tierName,
          description: tierDesc,
        },
        unit_amount: price,
        recurring: {
          interval: interval || 'month',
        },
      },
      quantity: 1,
    };

    // Create Checkout Session for Subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'subscription',
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${process.env.URL || 'http://localhost:8888'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:8888'}/dashboard`,
      metadata: {
        userId: userId,
        tierId: tierId,
        interval: interval
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Subscription Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
