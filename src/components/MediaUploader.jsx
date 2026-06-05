import React, { useState, useRef } from 'react';
import { sb } from '../lib/supabase';
import { Camera, Loader2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MediaUploader({ currentUrl, onUpload, zoneId, userId }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions (e.g., 1200px)
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Iterate quality to stay under 500KB
          let quality = 0.8;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // Rough estimate: Base64 is ~1.33x original size
          while (dataUrl.length > 500000 * 1.33 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Convert back to blob
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })))
            .catch(reject);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Compression
      const compressedFile = await compressImage(file);
      
      // 2. Cleanup Old Asset (if it exists in our bucket)
      if (currentUrl && currentUrl.includes('microsite-assets')) {
        const oldPath = currentUrl.split('microsite-assets/')[1];
        if (oldPath) {
           await sb.storage.from('microsite-assets').remove([oldPath]);
        }
      }

      // 3. Upload New
      const fileExt = 'jpg';
      const fileName = `${userId}/${zoneId}/${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await sb.storage
        .from('microsite-assets')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data: { publicUrl } } = sb.storage
        .from('microsite-assets')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative group">
         <div className="aspect-video w-full bg-slate-950 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative">
            {currentUrl ? (
              <img src={currentUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="preview" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-700">
                 <Camera size={32} />
                 <span className="text-[10px] font-black uppercase tracking-widest">No Media Set</span>
              </div>
            )}
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-sm cursor-pointer disabled:opacity-50"
            >
               {uploading ? (
                 <Loader2 className="w-8 h-8 text-white animate-spin" />
               ) : (
                 <>
                   <Camera className="w-8 h-8 text-white mb-2" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Asset</span>
                 </>
               )}
            </button>
         </div>
         
         <input 
           type="file" 
           ref={fileInputRef} 
           onChange={handleUpload} 
           className="hidden" 
           accept="image/*" 
         />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
           <AlertCircle size={14} />
           <p className="text-[9px] font-bold uppercase tracking-tight">{error}</p>
        </div>
      )}

      {!uploading && !error && (
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
           JPG/PNG Optimized for Mobile • Max 500KB
        </p>
      )}
    </div>
  );
}
