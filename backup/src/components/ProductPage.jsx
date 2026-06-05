import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HARDWARE as initialHardware } from '../lib/products';
import { getHardware } from '../lib/marketing';
import { ArrowLeft, ShoppingBag, Zap, Shield, CheckCircle2, Box, Info, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  
  const [hardware, setHardware] = React.useState(initialHardware || []);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHardware = async () => {
      try {
        const liveHardware = await getHardware();
        setHardware(liveHardware || initialHardware || []);
      } catch (err) {
        console.error('Zero-Build Sync Failed (Product):', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHardware();
  }, []);

  const product = React.useMemo(() => 
    (hardware || []).find(p => p.id === productId),
    [productId, hardware]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 uppercase italic">SKU Not Found</h2>
          <Link to="/shop" className="text-orange-500 font-bold hover:underline">Return to SparkShop</Link>
        </div>
      </div>
    );
  }

  const primaryColor = '#f97316';

   return (
    <div className="min-h-screen bg-surface text-primary pt-32 lg:pt-40">
      <Helmet>
        <title>{product.name} | SparkStation Artisan Hardware</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`https://tap.sparkstation.link/shop/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} | SparkStation Artisan Hardware`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={`https://tap.sparkstation.link${product.image_url}`} />
        <meta property="og:url" content={`https://tap.sparkstation.link/shop/${product.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | SparkStation Artisan Hardware`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={`https://tap.sparkstation.link${product.image_url}`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "${product.name}",
              "image": "https://tap.sparkstation.link${product.image_url}",
              "description": "${product.description}",
              "brand": {
                "@type": "Brand",
                "name": "SparkStation"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://tap.sparkstation.link/shop/${product.id}",
                "priceCurrency": "USD",
                "price": "${product.price || 0}",
                "availability": "https://schema.org/${product.comingSoon ? 'PreOrder' : 'InStock'}",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }
          `}
        </script>
      </Helmet>
      {/* Dynamic Header */}
      <nav className="p-8">
        <Link to="/shop" className="inline-flex items-center gap-3 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Gallery</span>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Visual Column */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-border-subtle bg-surface-alt shadow-2xl relative">
            <img 
              src={product.image_url} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
            <div className="absolute top-8 left-8">
              <div className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest">
                {product.tag}
              </div>
            </div>
          </div>

          {/* Technical Specs Card */}
          {product.specs && (
            <div className="bg-card p-8 rounded-[3rem] border border-border-subtle space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Info size={18} className="text-orange-500" />
                <h4 className="text-xs font-black uppercase tracking-widest">Technical Specifications</h4>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{key}</p>
                    <p className="text-xs font-bold text-slate-300">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Column */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
           <header className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Official SparkStation Hardware</p>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-none">{product.name}</h1>
            <div className="text-4xl font-black text-white/90 mt-4">
              {product.status === 'coming_soon' ? (
                <span className="text-orange-500 text-2xl uppercase tracking-widest italic">Coming Soon</span>
              ) : product.status === 'early_access' ? (
                <div className="flex flex-col gap-2">
                  <span className="text-green-500 text-xs font-black uppercase tracking-[0.3em]">Early Access Enabled</span>
                  <span>${product.price?.toFixed(2) || '0.00'}</span>
                </div>
              ) : (
                `$${product.price?.toFixed(2) || '0.00'}`
              )}
            </div>
          </header>

          <div className="space-y-6">
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              {product.longDescription || product.description}
            </p>
            
            <div className="grid grid-cols-1 gap-4 py-8">
              {product.features.map(feature => (
                <div key={feature} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Zap size={18} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/5">
            {product.status === 'coming_soon' ? (
              <button 
                onClick={() => window.location.href = 'mailto:waitlist@sparkstation.link?subject=Notify me about ' + product.name}
                className="w-full py-6 rounded-3xl bg-orange-500 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-orange-600 transition-all shadow-xl active:scale-95"
              >
                <Sparkles size={20} /> Join the Waitlist
              </button>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-6 rounded-3xl bg-white text-slate-950 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
              >
                <ShoppingBag size={20} /> {product.status === 'early_access' ? 'Get Early Access' : 'Add to Cart'}
              </button>
            )}
            
            <div className="flex items-center justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Secured NFC</span>
              </div>
              <div className="flex items-center gap-2">
                <Box size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Global Logistics</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
