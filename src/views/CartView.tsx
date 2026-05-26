import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Receipt, Tag } from 'lucide-react';
import { getTranslatedProduct } from '../utils/translations';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartItemCount,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    setActiveTab,
    setSelectedProductId,
    settings,
    language
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const subtotal = getCartTotal();
  
  // Free delivery and default delivery charge from settings
  const freeDeliveryThreshold = settings?.freeDeliveryThreshold || 3000;
  const deliveryChargeRate = settings?.deliveryChargeInsideDhaka || 80;
  const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : deliveryChargeRate;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'Percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal - discountAmount + deliveryCharge;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = applyCouponCode(couponInput);
    
    // Auto-translate return message of coupons
    let displayMessage = result.message;
    if (language === 'bn') {
      if (result.message.includes('successfully')) {
        displayMessage = 'কুপনটি সফলভাবে প্রয়োগ করা হয়েছে!';
      } else if (result.message.includes('not found') || result.message.includes('Invalid')) {
        displayMessage = 'ভুল কুপন কোড! দয়া করে সঠিক কোড দিন।';
      } else if (result.message.includes('minimum spend')) {
        displayMessage = `এই কুপনটির জন্য ন্যূনতম অর্ডার হতে হবে ৳${appliedCoupon?.minSpend || 2000}`;
      }
    }
    setCouponFeedback({ success: result.success, message: displayMessage });
    if (result.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  const handleInspectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('product-details');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
        <div className="w-16 h-16 bg-stone-900 border border-stone-850 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-4 font-sans">
          <h2 className="text-xl font-bold text-stone-100">
            {language === 'bn' ? 'আপনার শপিং ব্যাগটি খালি রয়েছে' : 'Your Shopping Bag is empty'}
          </h2>
          <p className="text-xs text-stone-400">
            {language === 'bn' 
              ? 'আপনি এখনও কোনো বিলাসবহুল এমারেল্ড আংটি, বালা বা ডিজাইনার লকেট আপনার শপিং ব্যাগে যুক্ত করেননি।' 
              : "You have not placed any luxury emerald rings or gold chains inside your curation bag yet. Let's find your simple, premium look today."}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('shop')}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold uppercase text-xs tracking-wider py-3.5 rounded cursor-pointer transition-opacity"
        >
          {language === 'bn' ? 'আমাদের কালেকশন ব্রাউজ করুন' : 'Browse Our Catalogue'}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-left space-y-2 border-b border-stone-900 pb-6">
        <h1 className="text-3xl font-sans font-extrabold text-stone-100 tracking-tight flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
          {language === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Shopping Bag'}{' '}
          <span className="text-stone-500 font-mono text-xl">({getCartItemCount()} {language === 'bn' ? 'টি পণ্য' : 'items'})</span>
        </h1>
        <p className="text-xs text-stone-400">
          {language === 'bn' 
            ? 'অর্ডার প্লেস করার আগে আপনার সিলেক্ট করা অলঙ্কার ও বিলের হিসাব মিলিয়ে নিন।' 
            : 'Review selected jewels before executing secure cash-on-delivery placement.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
        
        {/* CART ITEMS PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="divide-y divide-stone-900 border border-stone-900 rounded-lg bg-stone-950/40 overflow-hidden">
            {cart.map((item) => {
              const activePrice = item.product.discountPrice || item.product.price;
              const hasDiscount = !!item.product.discountPrice;
              const p = getTranslatedProduct(item.product, language);

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center font-sans">
                  
                  {/* Item credentials */}
                  <div className="flex gap-4 items-center flex-1">
                    <img
                      src={item.product.image}
                      alt={p.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded bg-stone-900 border border-stone-850 cursor-pointer referrer-no-referrer"
                      onClick={() => handleInspectProduct(item.product.id)}
                      referrerPolicy="no-referrer"
                    />

                    <div>
                      <h3
                        onClick={() => handleInspectProduct(item.product.id)}
                        className="text-stone-100 text-sm sm:text-base font-semibold hover:text-amber-400 cursor-pointer duration-200"
                      >
                        {p.title}
                      </h3>
                      
                      {/* Configuration subtitles */}
                      <div className="flex flex-wrap gap-2 text-stone-400 text-[10px] mt-1.5 uppercase font-semibold">
                        {item.selectedSize && <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-850">{language === 'bn' ? 'সাইজ' : 'Size'}: {item.selectedSize}</span>}
                        {item.selectedColor && <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-850">{language === 'bn' ? 'শেড' : 'Shade'}: {item.selectedColor}</span>}
                      </div>

                      <div className="mt-2 text-xs sm:text-sm text-stone-400">
                        <span className="text-emerald-500 font-mono font-bold">৳{activePrice.toLocaleString()} BDT</span>
                        {hasDiscount && <span className="text-stone-500 line-through ml-2 font-mono text-[11px]">৳{item.product.price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity adjustments & deletion */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t border-stone-900/60 sm:border-0">
                    
                    <div className="flex items-center bg-stone-950 border border-stone-850 rounded">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-mono text-stone-200 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-stone-100 text-sm font-bold">
                        ৳{(activePrice * item.quantity).toLocaleString()} BDT
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-500 hover:text-red-400 cursor-pointer"
                        title={language === 'bn' ? 'রিমুভ করুন' : 'Delete item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Quick instructions / Free delivery meter */}
          <div className="p-4 bg-emerald-950/15 border border-emerald-905/30 rounded-md flex gap-3.5 items-center font-sans">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <p className="text-xs text-stone-300">
              {subtotal >= freeDeliveryThreshold ? (
                language === 'bn' ? (
                  <>অভিনন্দন! আপনার মোট অর্ডার ৳{freeDeliveryThreshold.toLocaleString()} এর বেশি হওয়ায় আপনি পাচ্ছেন সারা বাংলাদেশে <strong className="text-emerald-400 uppercase">ফ্রি হোম ডেলিভারি</strong>!</>
                ) : (
                  <>Congratulations! Your total exceeds ৳{freeDeliveryThreshold.toLocaleString()}, qualifying checkouts for <strong className="text-emerald-400 uppercase">FREE Express Home Delivery</strong>!</>
                )
              ) : (
                language === 'bn' ? (
                  <>কার্টে আর মাত্র <strong className="text-amber-400 font-mono">৳{(freeDeliveryThreshold - subtotal).toLocaleString()} টাকা</strong> মূল্যের অলংকার যোগ করে দেশজুড়ে <strong className="text-emerald-400 uppercase">ফ্রি ডেলিভারি</strong> উপভোগ করুন!</>
                ) : (
                  <>Add <strong className="text-amber-400 font-mono">৳{(freeDeliveryThreshold - subtotal).toLocaleString()} BDT</strong> more to unlock <strong className="text-emerald-400 uppercase">FREE Delivery</strong> across Bangladesh (save ৳{deliveryChargeRate})!</>
                )
              )}
            </p>
          </div>

        </div>

        {/* ORDER SUMMARY PANEL */}
        <aside className="space-y-6">
          
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            
            <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 flex items-center gap-2 font-sans">
              <Receipt className="w-4.5 h-4.5" />
              {language === 'bn' ? 'অর্ডার হিসাব মেমো' : 'Price Calculation'}
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-stone-400 font-sans">
              <div className="flex justify-between">
                <span>{language === 'bn' ? `উপ-মোট (${getCartItemCount()} টি পণ্য)` : `Subtotal (${getCartItemCount()} items)`}</span>
                <span className="font-mono text-stone-250">৳{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedCoupon ? (
                <div className="flex justify-between text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Coupon Discount'} ({appliedCoupon.code})
                  </span>
                  <span className="font-mono font-semibold">-৳{discountAmount.toLocaleString()}</span>
                </div>
              ) : null}

              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি ও লজিস্টিক চার্জ' : 'Estimated Packaging & Logistics'}</span>
                <span className="font-mono text-stone-250">
                  {deliveryCharge === 0 ? <strong className="text-emerald-400 font-sans tracking-wide">{language === 'bn' ? 'ফ্রি' : 'FREE'}</strong> : `৳${deliveryCharge}`}
                </span>
              </div>

              {appliedCoupon && (
                <button
                  onClick={removeCouponCode}
                  className="text-[10px] text-red-400 hover:underline cursor-pointer block text-left"
                >
                  {language === 'bn' ? '✕ কুপনটি রিমুভ করুন' : '✕ Remove dynamic coupon'}
                </button>
              )}

              <div className="border-t border-stone-900 pt-3.5 flex justify-between items-baseline font-sans">
                <span className="text-sm font-bold text-stone-200">{language === 'bn' ? 'মোট দেয় বিল (টাকা)' : 'Grand Total BDT'}</span>
                <span className="text-lg font-bold font-mono text-emerald-400">৳{grandTotal.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* Checkout proceed action */}
            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full bg-amber-400 text-stone-950 font-extrabold uppercase text-xs tracking-widest py-3.5 rounded hover:bg-amber-500 hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{language === 'bn' ? 'চেকআউটে যান (পরবর্তী ধাপ)' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* COUPON INPUT FIELD */}
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-4 space-y-3 font-sans">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              {language === 'bn' ? 'কুপন কোড প্রয়োগ করুন' : 'Apply Coupon Registry'}
            </h3>

            <form onSubmit={handleCouponSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-2 text-xs uppercase text-stone-200 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-stone-900 border border-stone-800 text-amber-400 hover:bg-amber-400 hover:text-stone-950 text-xs font-bold px-4 py-2 rounded cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
              </button>
            </form>

            {couponFeedback && (
              <div className={`text-[10px] p-2 rounded ${couponFeedback.success ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/30 text-red-400'}`}>
                {couponFeedback.message}
              </div>
            )}

            <div className="text-[10px] text-stone-500 text-left space-y-1">
              <p>{language === 'bn' ? '🎁 বাংলাদেশের গ্রাহকদের জন্য প্রস্তাবিত কুপন কোডসমুহঃ' : '🎁 Recommended Coupons for Bangladesh orders:'}</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><strong className="text-stone-300 select-all">EID2026</strong>: {language === 'bn' ? '১৫% ছাড় (ন্যূনতমঃ ৳২০০০)' : '15% OFF (Min Spend: ৳2,000)'}</li>
                <li><strong className="text-stone-300 select-all">ARISANGOLD</strong>: {language === 'bn' ? '৳৫০০ ফ্ল্যাট ডিসকাউন্ট (ন্যূনতমঃ ৳৫০০০)' : '৳500 Flat (Min Spend: ৳5,000)'}</li>
              </ul>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
};
