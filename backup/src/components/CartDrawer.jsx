import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      
      // Redirect to Stripe Secure Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Make sure you are running via Netlify Dev (npm run ndev) to test functions.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border-subtle z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Your Bag</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cart.length} Items Selected</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase">Your bag is empty</h3>
                    <p className="text-sm text-slate-500 mt-2">Equip your identity with our <br /> flagship hardware.</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Keep Browsing
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/5 bg-slate-900 shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-slate-950/50 border-t border-white/10 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="font-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                    <span className={`font-black uppercase text-[10px] tracking-widest ${subtotal >= 40 ? 'text-green-400' : 'text-slate-400'}`}>
                      {subtotal >= 40 ? 'FREE' : '$4.99'}
                    </span>
                  </div>
                  {subtotal < 40 && (
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-right">
                      Add ${(40 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    Domestic US shipping only · International coming soon
                  </p>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-white/5">
                   <span className="text-xl font-black tracking-tighter uppercase">Est. Total</span>
                   <span className="text-3xl font-black tracking-tighter">${(subtotal + (subtotal >= 40 ? 0 : 4.99)).toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-6 rounded-[2rem] bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_50px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Checkout via Stripe <ArrowRight size={18} /></>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
                  <Zap size={10} /> Secure SSL Encryption Active
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
