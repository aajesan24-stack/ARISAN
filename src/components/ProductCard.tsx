import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { getTranslatedProduct, getTranslatedCategoryName } from '../utils/translations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setActiveTab, setSelectedProductId, language, t } = useApp();
  const transProd = getTranslatedProduct(product, language);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Sync wishlist on mount
  useEffect(() => {
    const list = localStorage.getItem('arisan_wishlist');
    if (list) {
      const parsed = JSON.parse(list) as string[];
      setIsWishlisted(parsed.includes(product.id));
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = localStorage.getItem('arisan_wishlist');
    let parsed: string[] = list ? JSON.parse(list) : [];

    if (parsed.includes(product.id)) {
      parsed = parsed.filter((id) => id !== product.id);
      setIsWishlisted(false);
    } else {
      parsed.push(product.id);
      setIsWishlisted(true);
    }
    localStorage.setItem('arisan_wishlist', JSON.stringify(parsed));
  };

  const handleProductDetails = () => {
    setSelectedProductId(product.id);
    setActiveTab('product-details');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, undefined, undefined, 1);
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, undefined, undefined, 1);
    setActiveTab('checkout');
  };

  const savedAmount = product.discountPrice ? product.price - product.discountPrice : 0;
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-stone-950 border border-stone-900 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300"
      id={`product-card-${product.id}`}
    >
      
      {/* Visual Header / Banner badges */}
      <div className="relative aspect-square overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={transProd.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={handleProductDetails}
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Hearts */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/75 text-stone-300 hover:text-amber-400 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer border border-stone-800"
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Special highlight tag overlays */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {product.discountPrice && (
            <span className="bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="bg-emerald-950 text-emerald-400 font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-500/10 shadow">
              {t('prod.newarrival')}
            </span>
          )}
          {product.bestSelling && (
            <span className="bg-stone-900 text-amber-300 font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-amber-500/20 shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              {t('prod.bestseller')}
            </span>
          )}
        </div>

        {/* Quick look hover utility */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-5">
          <button
            onClick={handleProductDetails}
            className="p-3 bg-stone-950 hover:bg-amber-400 hover:text-stone-950 rounded-full transition-all text-amber-400 cursor-pointer border border-stone-800"
            title="Inspect Jewellery"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-stone-950 hover:bg-emerald-500 hover:text-stone-950 rounded-full transition-all text-emerald-400 cursor-pointer border border-stone-850"
            title="Slide into Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dynamic stock flags */}
        <div className="absolute bottom-2 left-2 z-10">
          {product.stockStatus === 'Out of Stock' ? (
            <span className="bg-red-950/90 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-900/50">
              {t('prod.outofstock')}
            </span>
          ) : product.stockStatus === 'Low Stock' ? (
            <span className="bg-amber-950/90 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-950">
              {language === 'bn' ? `মাত্র ${product.stockCount}টি বাকি আছে` : `Only ${product.stockCount} left`}
            </span>
          ) : null}
        </div>
      </div>

      {/* Visual Explainer (Body) */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left">
        <div>
          <button
            onClick={handleProductDetails}
            className="text-stone-400 text-xs font-mono tracking-wider uppercase mb-1 block hover:text-amber-400"
          >
            {getTranslatedCategoryName(product.category, language)}
          </button>
          <h3 
            onClick={handleProductDetails}
            className="text-[15px] font-sans font-semibold text-stone-100 hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {transProd.title}
          </h3>
          <p className="text-xs text-stone-400 line-clamp-2 mt-1 min-h-[32px]">
            {transProd.description}
          </p>

          <div className="flex items-center gap-2.5 mt-3">
            <span className="text-emerald-500 font-bold font-mono text-base">
              ৳{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-500 font-mono line-through">
                ৳{product.price}
              </span>
            )}
            {savedAmount > 0 && (
              <span className="text-[10px] text-stone-400">
                {language === 'bn' ? `(সাশ্রয় ৳${savedAmount})` : `(Save ৳${savedAmount})`}
              </span>
            )}
          </div>
        </div>

        {/* Card foot layout buttons */}
        <div className="mt-5 pt-3 border-t border-stone-900/60 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'Out of Stock'}
            className={`text-xs py-2 px-3.5 font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1 border ${
              successAnimation
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                : 'bg-stone-900/50 text-stone-200 border-stone-850 hover:bg-stone-900 hover:text-amber-400'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{successAnimation ? (language === 'bn' ? 'যুক্ত হয়েছে! ✨' : 'Added! ✨') : t('btn.addToCart')}</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stockStatus === 'Out of Stock'}
            className="bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] text-xs font-bold uppercase tracking-wider py-2 px-3.5 rounded hover:opacity-95 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center shadow"
          >
            {t('btn.buyNow')}
          </button>
        </div>
      </div>

    </div>
  );
};
