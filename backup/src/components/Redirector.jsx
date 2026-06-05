import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { Zap } from 'lucide-react';

export default function Redirector() {
  const [searchParams] = useSearchParams();
  const { serial: pathSerial } = useParams();
  const navigate = useNavigate();
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    async function handleRedirect() {
      const rawSerial = pathSerial || searchParams.get('s') || searchParams.get('id');
      if (!rawSerial) { navigate('/'); return; }

      const serial = rawSerial.trim().toUpperCase();

      try {
        const { data: asset, error } = await sb
          .from('assets')
          .select('id, owner_id, redirects(destination_url, mode)')
          .eq('serial_number', serial)
          .single();

        if (error || !asset) { navigate('/'); return; }

        // TELEMETRY RE-ACTIVATED
        await sb.rpc('increment_tap', { 
          target_serial_number: serial,
          p_lat: null, 
          p_lng: null, 
          p_city: 'Web Fallback', 
          p_country: 'Unknown',
          p_metadata: { ua: navigator.userAgent, source: 'web_fallback' }
        });

        const redirectData = asset.redirects;
        const redirect = Array.isArray(redirectData) ? redirectData[0] : redirectData;
        const mode = redirect?.mode;
        const customUrl = redirect?.destination_url;


        // Profile mode — always go to the owner's profile page
        if (mode === 'profile') {
          navigate(`/p/${asset.owner_id}`);
          return;
        }

        // No URL configured — fall back to profile
        if (!customUrl && asset.owner_id) {
          navigate(`/p/${asset.owner_id}`);
          return;
        }

        if (customUrl && customUrl.trim() !== '') {
          let target;
          if (customUrl.startsWith('http')) {
            target = customUrl;
          } else if (customUrl.startsWith('/')) {
            target = `${window.location.origin}${customUrl}`;
          } else {
            target = `https://${customUrl}`;
          }
          window.location.href = target;
        } else {
          navigate('/');
        }

      } catch (err) {
        console.error('Redirect Exception:', err);
        navigate('/');
      }
    }

    handleRedirect();
  }, [pathSerial, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-primary p-8">
      <Zap className="w-16 h-16 text-orange-500 fill-current animate-bounce" />
      <h1 className="mt-8 text-xs font-black uppercase tracking-[0.5em] text-secondary">Connecting...</h1>
      <p className="mt-4 text-[10px] text-muted font-mono select-all">Serial: {pathSerial || searchParams.get('s') || searchParams.get('id')}</p>
    </div>
  );
}
