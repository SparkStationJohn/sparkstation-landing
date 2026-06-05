import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (request, context) => {
  const url = new URL(request.url);
  const host = request.headers.get("host");

  // Skip core domains and local development
  const coreDomains = [
    "sparkstation.com",
    "www.sparkstation.com",
    "sparkstation.link",
    "www.sparkstation.link",
    "tap.sparkstation.link",
    "sparkstation.netlify.app",
    "localhost",
    "127.0.0.1"
  ];

  if (!host || coreDomains.some(d => host.includes(d))) {
    return;
  }

  console.log(`[RESOLVER] Custom Domain Detected: ${host}`);

  const sb = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")
  );

  try {
    // Lookup the profile associated with this custom domain
    const { data: profile, error } = await sb
      .from("profiles")
      .select("username, id")
      .eq("custom_domain", host)
      .eq("domain_verified", true)
      .single();

    if (error || !profile) {
      console.log(`[RESOLVER] No verified profile found for ${host}`);
      return;
    }

    // Rewrite the request to the profile page
    // We use the @username route for a clean internal resolution
    const targetPath = `/u/${profile.username}`;
    console.log(`[RESOLVER] Rewriting ${host}${url.pathname} -> ${targetPath}`);
    
    // Maintain the path (e.g. custom.com/about -> /@user/about if handled)
    // For now, we mainly resolve the root to the profile
    if (url.pathname === "/") {
      return context.rewrite(targetPath);
    }
    
    return;
  } catch (err) {
    console.error(`[RESOLVER ERROR]`, err);
    return;
  }
};
