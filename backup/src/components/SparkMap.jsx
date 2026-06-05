import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { AlertCircle, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function SparkMap({ taps }) {
  try {
    // Filter taps that have valid coordinates (Must be numbers)
    const geoTaps = (taps || []).filter(t => 
      t && 
      typeof t.lat === 'number' && 
      typeof t.lng === 'number' && 
      !isNaN(t.lat) && 
      !isNaN(t.lng)
    );

    // Default center (Global overview)
    const center = [20, 0];
    const zoom = 2;

    const [isInteracting, setIsInteracting] = React.useState(false);

    return (
      <div className="w-full h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-border-subtle relative glass bg-card/50 group">
        
        {/* Mobile Interaction Overlay */}
        {!isInteracting && (
          <div 
            className="md:hidden interaction-overlay"
            onClick={() => setIsInteracting(true)}
          >
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mx-auto mb-3 animate-bounce">
                <Globe size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tap to Explore Network</p>
            </div>
          </div>
        )}

        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={false} 
          dragging={isInteracting || typeof window !== 'undefined' && window.innerWidth > 768}
          className="w-full h-full z-10"
          style={{ background: '#020617' }}
          placeholder={
            <div className="flex items-center justify-center h-full text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Initializing Map...
            </div>
          }
        >
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {geoTaps.map((tap) => (
            <CircleMarker
              key={tap.id || Math.random()}
              center={[tap.lat, tap.lng]}
              radius={8}
              pathOptions={{
                fillColor: '#f97316',
                fillOpacity: 0.6,
                color: '#fff',
                weight: 2,
                className: 'pulse-marker'
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                <div className="bg-card text-primary p-2 rounded-lg border border-border-subtle shadow-xl pointer-events-none">
                  <p className="font-black text-[10px] uppercase tracking-widest text-orange-500 mb-1">
                    {tap.assets?.nickname || tap.assets?.serial_number || 'Station'}
                  </p>
                  <p className="text-[9px] font-bold text-secondary">
                    {tap.city ? `${tap.city}, ` : ''}{tap.country || 'Unknown Location'}
                  </p>
                  <p className="text-[8px] text-secondary opacity-50 mt-1 uppercase font-black">
                    {tap.created_at ? new Date(tap.created_at).toLocaleTimeString() : ''}
                  </p>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-container {
            filter: grayscale(0.5) contrast(1.1);
          }
          .pulse-marker {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { stroke-width: 2; stroke-opacity: 0.8; }
            50% { stroke-width: 8; stroke-opacity: 0.1; }
            100% { stroke-width: 2; stroke-opacity: 0.8; }
          }
          .leaflet-tooltip {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            pointer-events: none !important;
          }
          .leaflet-tooltip-top:before {
            display: none !important;
          }
        `}} />
      </div>
    );
  } catch (err) {
    console.error('SparkMap Error:', err);
    return (
      <div className="w-full h-[300px] md:h-[500px] rounded-[2.5rem] flex items-center justify-center glass border border-white/5 bg-slate-950">
        <div className="text-center">
          <AlertCircle className="mx-auto text-orange-500 mb-4" size={32} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Map visualization unavailable</p>
        </div>
      </div>
    );
  }
}
