import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (request, context) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  
  // Serial Extraction
  const querySerial = url.searchParams.get("s") || url.searchParams.get("id");
  const segment2 = pathParts.length >= 2 ? pathParts[1] : null;
  const segment1 = pathParts.length === 1 && !['dashboard', 'login', 'p', 's', 'go', 'u'].includes(pathParts[0].toLowerCase()) 
    ? pathParts[0] 
    : null;

  const rawSerial = querySerial || segment2 || segment1;
  if (!rawSerial) return;

  const serial = rawSerial.trim().toUpperCase();
  
  const sb = createClient(
    Deno.env.get("SUPABASE_URL"), 
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")
  );

  try {
    const { data, error } = await sb
      .from("assets")
      .select("id, owner_id, profiles!owner_id(username), redirects(destination_url, destination_url_b, mode, config, webhook_url)")
      .eq("serial_number", serial)
      .limit(1);

    if (error || !data || data.length === 0) return; 

    const asset = data[0];
    const redirect = Array.isArray(asset.redirects) ? asset.redirects[0] : asset.redirects;
    
    // 1. ASYNC TELEMETRY (Non-blocking)
    const telemetryTask = (async () => {
      try {
        const { geo } = context;
        const ua = request.headers.get("user-agent") || "Unknown";
        
        // Parallel: Telemetry + Webhook
        const tasks = [];
        
        // DB Record
        tasks.push(sb.rpc("increment_tap", {
          target_serial_number: serial,
          p_lat: geo?.latitude || null,
          p_lng: geo?.longitude || null,
          p_city: geo?.city || "Unknown",
          p_country: geo?.country?.name || "Unknown",
          p_metadata: { ua, source: "edge_direct" }
        }));

        // Webhook
        if (redirect?.webhook_url) {
          tasks.push(fetch(redirect.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'tap', serial, geo })
          }));
        }

        await Promise.allSettled(tasks);
      } catch (e) {
        console.error("[TELEMETRY CRASH]", e);
      }
    })();

    // Use waitUntil if available (Production Netlify)
    if (typeof context.waitUntil === 'function') {
      context.waitUntil(telemetryTask);
    }

    // 2. REDIRECT LOGIC
    let targetUrl = redirect?.destination_url;

    // Profile Mode Override
    if (redirect?.mode === 'profile') {
      const username = Array.isArray(asset.profiles) ? asset.profiles[0]?.username : asset.profiles?.username;
      const profilePath = username ? `/u/${username}` : `/p/${asset.owner_id}`;
      return Response.redirect(`${url.origin}${profilePath}`, 301);
    }

    // Switchboard (Night Shift / Weekend)
    if (redirect && redirect.mode !== 'static') {
      const now = new Date();
      const hour = now.getUTCHours();
      const day = now.getUTCDay();

      if (redirect.mode === 'night_shift' && (hour >= 18 || hour < 6) && redirect.destination_url_b) {
        targetUrl = redirect.destination_url_b;
      } else if (redirect.mode === 'weekend' && (day === 0 || day === 6) && redirect.destination_url_b) {
        targetUrl = redirect.destination_url_b;
      }
    }

    // Resolve Final Target
    if (targetUrl) {
      const target = targetUrl.startsWith("/") ? `${url.origin}${targetUrl}` : 
                     targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
      return Response.redirect(target, 301);
    } else if (asset.owner_id) {
      return Response.redirect(`${url.origin}/p/${asset.owner_id}`, 301);
    }

    return;

  } catch (err) {
    console.error("[CRITICAL EDGE ERROR]", err);
    return;
  }
};
