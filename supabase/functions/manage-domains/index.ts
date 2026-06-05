import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { domain, action } = await req.json();
    
    // Auth Check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const NETLIFY_TOKEN = Deno.env.get('NETLIFY_AUTH_TOKEN');
    const SITE_ID = Deno.env.get('NETLIFY_SITE_ID');

    if (action === 'verify') {
      console.log(`[VERIFY] Checking DNS for ${domain}`);
      
      try {
        const records = await Deno.resolveDns(domain, "CNAME");
        const isPointed = records.some(r => r.includes('tap.sparkstation.link') || r.includes('netlify.app'));
        
        if (!isPointed) {
          // Check A record as fallback
          const aRecords = await Deno.resolveDns(domain, "A");
          if (aRecords.length === 0) throw new Error('DNS not pointed yet');
        }

        // DNS looks good, now add to Netlify
        console.log(`[NETLIFY] Adding domain alias: ${domain}`);
        
        // 1. Get current site config
        const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`, {
          headers: { 'Authorization': `Bearer ${NETLIFY_TOKEN}` }
        });
        const site = await siteRes.json();
        
        const currentAliases = site.domain_aliases || [];
        if (!currentAliases.includes(domain)) {
          const updatedAliases = [...currentAliases, domain];
          
          // 2. Update Netlify
          const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`, {
            method: 'PATCH',
            headers: { 
              'Authorization': `Bearer ${NETLIFY_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain_aliases: updatedAliases })
          });
          
          if (!updateRes.ok) throw new Error('Failed to update Netlify aliases');
        }

        // 3. Trigger SSL
        console.log(`[SSL] Triggering provisioning for ${domain}`);
        await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/ssl`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${NETLIFY_TOKEN}` }
        });

        // 4. Update Supabase
        await supabaseClient
          .from('profiles')
          .update({ 
            custom_domain: domain,
            domain_verified: true 
          })
          .eq('id', user.id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (dnsErr) {
        return new Response(JSON.stringify({ error: 'DNS verification failed. Please ensure your CNAME points to tap.sparkstation.link' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
