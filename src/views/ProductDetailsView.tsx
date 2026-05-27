import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Share2, ArrowLeft, ArrowUpRight, MessageSquare } from 'lucide-react';
import { getTranslatedProduct, getTranslatedCategoryName } from '../utils/translations';
import { StyledText } from '../components/StyledText';

export const ProductDetailsView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setActiveTab,
    addToCart,
    reviews,
    addReview,
    language
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const transProd = getTranslatedProduct(product, language);

  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Review Submissions Form State
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Sync state when details load
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
      setQuantity(1);

      const list = localStorage.getItem('arisan_wishlist');
      if (list) {
        const parsed = JSON.parse(list) as string[];
        setIsWishlisted(parsed.includes(product.id));
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-stone-300">
          {language === 'bn' ? 'কোনো প্রিমিয়াম জুয়েলারি নির্বাচন করা হয়নি।' : 'No Premium Jewel Selected.'}
        </p>
        <button onClick={() => setActiveTab('shop')} className="mt-4 bg-amber-500 text-stone-950 px-6 py-2.5 rounded font-bold uppercase text-xs tracking-wider cursor-pointer">
          {language === 'bn' ? 'ক্যাটালগে চলে যান' : 'Go To Gallery'}
        </button>
      </div>
    );
  }

  const toggleWishlist = () => {
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

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveTab('checkout');
  };

  const handleShare = () => {
    // Copy product link to clipboard but give visual feedback
    const dummyUrl = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 3000);
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    addReview(product.id, authorName, userRating, commentText);
    setAuthorName('');
    setUserRating(5);
    setCommentText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4500);
  };

  // Filter reviews matching current product title or fallback references
  const productReviews = reviews.filter(
    (r) => r.productTitle.toLowerCase() === product.title.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 space-y-16">
      
      {/* Back to Catalogue */}
      <div className="text-left">
        <button
          onClick={() => setActiveTab('shop')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-500 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {language === 'bn' ? 'সব কালেকশনে ফিরে যান' : 'Back to Curations'}
        </button>
      </div>

      {/* CORE PRODUCT CARD INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        
        {/* GALLERY */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-900 border border-stone-900 rounded-lg overflow-hidden relative">
            <img
              src={activeImage}
              alt={transProd.title}
              className="w-full h-full object-cover select-none referrer-no-referrer"
              referrerPolicy="no-referrer"
            />
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-extrabold text-[10px] tracking-widest px-2.5 py-1 rounded shadow">
                {language === 'bn' ? 'বিশেষ ডিসকাউন্ট' : 'SALE ACTIVE'}
              </span>
            )}
          </div>

          {/* Micro choices gallery */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 bg-stone-900 border rounded overflow-hidden shrink-0 transition-colors cursor-pointer ${
                    activeImage === img ? 'border-amber-400' : 'border-stone-850 hover:border-stone-750'
                  }`}
                >
                  <img src={img} alt="jewel thumbnail" className="w-full h-full object-cover referrer-no-referrer" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS COLUMN */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Badges and rating row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-900 pb-3">
              <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-stone-950 border border-stone-900 px-3 py-1 rounded-full">{getTranslatedCategoryName(product.category, language)}</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">{product.rating}</span>
                <span className="text-stone-500 text-xs">({productReviews.length || product.reviewsCount} {language === 'bn' ? 'রিভিউসমূহ' : 'reviews'})</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight leading-tight">
              {transProd.title}
            </h1>

            {/* Pricing distribution BDT */}
            <div className="flex items-baseline gap-4 py-2">
              <span className="text-2xl font-bold font-mono text-emerald-500">
                ৳{(product.discountPrice || product.price).toLocaleString()} BDT
              </span>
              {product.discountPrice && (
                <span className="text-sm text-stone-500 line-through font-mono">
                  ৳{product.price.toLocaleString()} BDT
                </span>
              )}
              {product.discountPrice && (
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded font-bold font-sans">
                  {language === 'bn' ? `সাশ্রয় ৳${(product.price - product.discountPrice).toLocaleString()} BDT` : `Save ৳${product.price - product.discountPrice} BDT`}
                </span>
              )}
            </div>

            <p className="text-sm md:text-base text-stone-300 leading-relaxed font-sans">
              <StyledText text={transProd.description} />
            </p>

            {/* Sizing selections */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {language === 'bn' ? 'সাইজ নির্বাচন করুন' : 'Select Size'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-3.5 py-2 rounded font-sans cursor-pointer transition-colors border ${
                        selectedSize === s
                          ? 'bg-amber-400 border-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-950 border-stone-850 text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      {language === 'bn' && s === 'Standard' ? 'স্ট্যান্ডার্ড' : s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selections */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {language === 'bn' ? 'কালার পলিশ থিম' : 'Select Theme Shade'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`text-xs px-3.5 py-2 rounded font-sans cursor-pointer transition-colors border ${
                        selectedColor === c
                          ? 'bg-amber-400 border-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-950 border-stone-850 text-stone-350 hover:bg-stone-900'
                      }`}
                    >
                      {language === 'bn' && c === 'Default' ? 'ডিফল্ট' :
                       language === 'bn' && c === 'Gold' ? 'গোল্ডেন' :
                       language === 'bn' && c === 'Rose Gold' ? 'রোজ গোল্ড' :
                       language === 'bn' && c === 'Silver' ? 'সিলভার' : c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selections */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
              </label>
              <div className="inline-flex items-center bg-stone-950 border border-stone-850 rounded">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-stone-400 hover:text-stone-200 cursor-pointer text-sm font-semibold focus:outline-none"
                >
                  -
                </button>
                <span className="px-4 py-2 font-mono text-stone-200 text-xs text-center min-w-[40px]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3.5 py-2 text-stone-400 hover:text-stone-200 cursor-pointer text-sm font-semibold focus:outline-none"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
              <span className="text-stone-500 text-xs ml-3 font-medium">
                {language === 'bn' ? `(${product.stockCount} টি স্টকে আছে)` : `(${product.stockCount} units available in vaults)`}
              </span>
            </div>

          </div>

          <div className="space-y-4 pt-6 border-t border-stone-900/60">
            {/* Quick action warnings banner */}
            {successMsg && (
              <div className="bg-emerald-950/60 p-3 rounded-md border border-emerald-500/20 text-emerald-400 text-xs font-bold font-sans animate-fadeIn">
                {language === 'bn' 
                  ? `✔ সফল হয়েছে! ${quantity} টি পণ্য আপনার কার্ট ব্যাগে যুক্ত করা হয়েছে!` 
                  : `✔ Success! ${quantity} x ${product.title} has been added to your shopping bag. Ready for checkout!`}
              </div>
            )}

            {shareFeedback && (
              <div className="bg-amber-950/45 p-3 rounded-md border border-amber-500/20 text-amber-400 text-xs font-sans animate-fadeIn">
                {language === 'bn' 
                  ? '✔ পন্যের শেয়ার লিংক আপনার ক্লিপবোর্ডে কপি করা হয়েছে।'
                  : '✔ Jewellery share link copied to clipboard successfully!'}
              </div>
            )}

            {/* Main Checkout actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'Out of Stock'}
                className="flex-1 bg-stone-950 border border-stone-850 text-stone-100 hover:text-amber-400 flex items-center justify-center gap-2 py-3 px-6 rounded font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {language === 'bn' ? 'কার্ট ব্যাগে যুক্ত করুন' : 'Add to Shopping Bag'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stockStatus === 'Out of Stock'}
                className="flex-1 bg-amber-400 text-stone-950 hover:bg-amber-500 font-bold uppercase text-xs tracking-wider py-3 px-6 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2 shadow"
              >
                {language === 'bn' ? `অর্ডার করুন` : `Order Now`}
              </button>

              <button
                onClick={toggleWishlist}
                className="p-3 bg-stone-950 border border-stone-850 hover:bg-stone-900 text-stone-300 hover:text-amber-400 rounded transition-colors cursor-pointer shrink-0"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 bg-stone-950 border border-stone-850 hover:bg-stone-900 text-stone-300 hover:text-amber-400 rounded transition-colors cursor-pointer shrink-0"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Guarantees panel */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans text-stone-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 text-emerald-500" />
                <span>{language === 'bn' ? 'সারাদেশে হোম ডেলিভারি সুবিধা' : 'Express home delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                <span>{language === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট পলিসি' : '7-day exchange coverage'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FEEDBACK REVIEWS SECTION */}
      <section className="border-t border-stone-900 pt-16 space-y-12">
        <div className="text-left space-y-2">
          <h2 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            {language === 'bn' ? 'গ্রাহকদের রিভিউসমূহ' : 'Client Reviews'} ({productReviews.length || product.reviewsCount})
          </h2>
          <p className="text-xs text-stone-400">
            {language === 'bn' 
              ? `${transProd.title} সম্পর্কে বাংলাদেশের গ্রাহকদের মন্তব্য ও ফাইভ-স্টার রিভিউসমূহ:` 
              : `Read what other elegant ladies and fashion seekers in Bangladesh say about ${product.title}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          
          {/* REVIEWS LIST */}
          <div className="lg:col-span-2 space-y-6">
            {productReviews.length > 0 ? (
              <div className="divide-y divide-stone-900 space-y-6">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-3 font-sans">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        {rev.avatar ? (
                          <img src={rev.avatar} alt={rev.author} className="w-10 h-10 object-cover rounded-full border border-stone-850" />
                        ) : (
                          <div className="w-10 h-10 bg-emerald-950 text-emerald-400 font-bold rounded-full flex items-center justify-center">
                            {rev.author[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-semibold text-stone-200">{rev.author}</h4>
                          <span className="text-[10px] text-stone-500 font-mono">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-300 text-xs md:text-sm pl-13 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-stone-950/25 border border-dashed border-stone-900 rounded font-sans">
                <MessageSquare className="w-8 h-8 text-stone-600 mx-auto mb-3" />
                <h4 className="text-xs font-semibold text-stone-300">
                  {language === 'bn' ? 'কোনো রিভিউ নেই' : 'No client reviews yet'}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {language === 'bn' 
                    ? 'এই জুয়েলারি বা অলংকারটি কিনেছেন? আপনার প্রথম কাস্টমার রিভিউটি নিচে লিখে দিন।' 
                    : 'Purchased this masterpiece? Share your review below of this jewellery model.'}
                </p>
              </div>
            )}
          </div>

          {/* SUBMISSION FORM */}
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 h-fit relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-950/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 mb-4 font-sans">
              {language === 'bn' ? 'মতামত বা রিভিউ লিখুন' : 'Write Product Review'}
            </h3>

            {reviewSuccess && (
              <div className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/25 p-3 rounded mb-4 text-xs font-medium font-sans">
                {language === 'bn' ? '✔ সফল হয়েছে! আপনার মুল্যবান রিভিউটি যুক্ত করা হয়েছে।' : '✔ Success! Your verified jewellery feedback has been added!'}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans text-xs">
              
              <div>
                <label className="block text-stone-400 font-semibold mb-1.5 uppercase">
                  {language === 'bn' ? 'আপনার নাম' : 'Your Display Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Jahan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1.5 uppercase">
                  {language === 'bn' ? 'রেটিং সিলেক্ট করুন' : 'Select Gold Star Rating'}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-amber-400 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1.5 uppercase">
                  {language === 'bn' ? 'আপনার মন্তব্য লিখুন' : 'Feedback Commentary'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={language === 'bn' ? 'অলংকারের ফিনিশিং, কালার বা প্যাকেজিং এর প্রশংসা জানিয়ে মন্তব্য করুন...' : 'Tell customers about the polish, color gloss, or packaging...'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 text-stone-950 font-bold py-2.5 rounded hover:bg-amber-500 uppercase tracking-wider text-[11px] cursor-pointer text-center font-sans"
              >
                {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
};
