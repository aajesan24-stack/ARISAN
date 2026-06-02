import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck, RotateCcw, Award, Mail, Clock } from 'lucide-react';
import { getTranslatedCategoryName } from '../utils/translations';
import { StyledText } from '../components/StyledText';
import { EditableElement } from '../components/EditableElement';

export const HomeView: React.FC = () => {
  const { products, categories, settings, reviews, setActiveTab, setSelectedCategorySlug, language, t } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSelling).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab('shop');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO BANNER */}
      <section 
        className={`relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center overflow-hidden py-16 ${settings.hideHeroOnMobile ? 'hidden sm:flex' : 'flex'}`}
        style={{ backgroundColor: settings.heroBgColor, color: settings.heroTextColor }}
      >
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0 opacity-40">
          <EditableElement id="hero-bg-image" type="image" defaultText="Background Visual Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <img
              src={settings.heroImage}
              alt="ARISAN BD Luxury Jewellery"
              className="w-full h-full object-cover filter brightness-50 contrast-110 referrer-no-referrer"
              referrerPolicy="no-referrer"
            />
          </EditableElement>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-transparent"></div>
        </div>

        {/* Golden ambient lighting */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-3xl animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 space-y-6 max-w-4xl">
          <div className="text-amber-400 font-sans tracking-[0.3em] text-xs md:text-sm uppercase font-semibold flex items-center justify-center gap-2">
            <EditableElement id="hero-spark-label" defaultText="Simple Look, Premium Jewellery" defaultTextBn="সিম্পল লুক, প্রিমিয়াম জুয়েলারি">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin inline" />
              <span>{language === 'bn' ? 'সিম্পল লুক, প্রিমিয়াম জুয়েলারি' : 'Simple Look, Premium Jewellery'}</span>
            </EditableElement>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-extrabold tracking-tight leading-tight">
            <EditableElement id="hero-headline" defaultText={settings.heroHeadline} defaultTextBn="প্রতিটি মুহূর্তের জন্য অভিজাত জুয়েলারি">
              {language === 'bn' && settings.heroHeadline?.includes('Crafted Elegance')
                ? 'প্রতিটি মুহূর্তের জন্য অভিজাত জুয়েলারি'
                : <StyledText text={settings.heroHeadline} />}
            </EditableElement>
          </h1>

          <p className="text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-sans opacity-90">
            <EditableElement id="hero-subheadline" defaultText={settings.heroSubheadline} defaultTextBn="ARISAN BD নিয়ে এসেছে অত্যন্ত প্রিমিয়াম এবং ট্রেন্ডি ফ্যাশন জুয়েলারি কালেকশন...">
              {language === 'bn' && settings.heroSubheadline?.includes('ARISAN BD presents')
                ? 'ARISAN BD নিয়ে এসেছে অত্যন্ত প্রিমিয়াম এবং ট্রেন্ডি ফ্যাশন জুয়েলারি কালেকশন, যা আপনার প্রতিদিনের সাধারণ রূপকেও করে তুলবে অনন্য এবং রাজকীয়।'
                : <StyledText text={settings.heroSubheadline} />}
            </EditableElement>
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <EditableElement id="hero-cta-primary" type="button" className="w-full">
                <button
                  onClick={() => { setSelectedCategorySlug(null); setActiveTab('shop'); }}
                  className="w-full sm:w-auto btn-luxury-cta px-8 py-3.5 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  style={{ backgroundColor: settings.buttonBgColor, color: settings.buttonTextColor }}
                >
                  <span>{language === 'bn' ? 'সব কালেকশন দেখুন' : 'Explore Curation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </EditableElement>
            </div>

            <div className="w-full sm:w-auto">
              <EditableElement id="hero-cta-secondary" type="button" className="w-full">
                <button
                  onClick={() => setActiveTab('about-us')}
                  className="w-full sm:w-auto min-w-[200px] bg-stone-900/80 text-stone-100 border border-stone-850 hover:border-amber-400/50 px-8 py-3.5 rounded font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'আমাদের হেরিটেজ গল্প' : 'Our Heritage Story'}
                </button>
              </EditableElement>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE STATEMENTS (TRUST TRIGGERS) */}
      <section className="container mx-auto px-4 lg:px-8">
        <div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 rounded-xl p-8 border border-stone-850/60 shadow-sm"
          style={{ backgroundColor: settings.categoriesBgColor, color: settings.categoriesTextColor }}
        >
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/10">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">
                <EditableElement id="val-1-title" defaultText="Across Bangladesh Delivery" defaultTextBn="সারাদেশে ডেলিভারি">
                  {language === 'bn' ? 'সারাদেশে ডেলিভারি' : 'Across Bangladesh Delivery'}
                </EditableElement>
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                <EditableElement id="val-1-desc" defaultText="Superfast home delivery with secure cash on delivery option." defaultTextBn="সারা বাংলাদেশে অত্যন্ত দ্রুত গতিতে ক্যাশ অন ডেলিভারি সুবিধা।">
                  {language === 'bn' ? 'সারা বাংলাদেশে অত্যন্ত দ্রুত গতিতে ক্যাশ অন ডেলিভারি সুবিধা।' : 'Superfast home delivery with secure cash on delivery option.'}
                </EditableElement>
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">
                <EditableElement id="val-2-title" defaultText="Guaranteed Premium Quality" defaultTextBn="শতভাগ প্রিমিয়াম কোয়ালিটি">
                  {language === 'bn' ? 'শতভাগ প্রিমিয়াম কোয়ালিটি' : 'Guaranteed Premium Quality'}
                </EditableElement>
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                <EditableElement id="val-2-desc" defaultText="Every premium gem and 18K/22K plating passes strict control." defaultTextBn="আমাদের প্রতিটি প্রোডাক্ট ১৮কে বা ২২কে গোল্ড প্লেটেড এবং মানসম্মত।">
                  {language === 'bn' ? 'আমাদের প্রতিটি প্রোডাক্ট ১৮কে বা ২২কে গোল্ড প্লেটেড এবং মানসম্মত।' : 'Every premium gem and 18K/22K plating passes strict control.'}
                </EditableElement>
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/10">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">
                <EditableElement id="val-3-title" defaultText="Simple 7-Day Exchange" defaultTextBn="সহজ ৭-দিন এক্সচেঞ্জ">
                  {language === 'bn' ? 'সহজ ৭-দিন এক্সচেঞ্জ' : 'Simple 7-Day Exchange'}
                </EditableElement>
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                <EditableElement id="val-3-desc" defaultText="Not fully satisfied? Exchange easily through support hub." defaultTextBn="পণ্য পছন্দ না হলে বা সাইজে সমস্যা হলে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা।">
                  {language === 'bn' ? 'পণ্য পছন্দ না হলে বা সাইজে সমস্যা হলে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা।' : 'Not fully satisfied? Exchange easily through support hub.'}
                </EditableElement>
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">
                <EditableElement id="val-4-title" defaultText="Owner-Curated Jewels" defaultTextBn="প্রতিষ্ঠাতা নির্বাচিত জুয়েলারি">
                  {language === 'bn' ? 'প্রতিষ্ঠাতা নির্বাচিত জুয়েলারি' : 'Owner-Curated Jewels'}
                </EditableElement>
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                <EditableElement id="val-4-desc" defaultText="Hand-selected designs by Md Tarikul Alam Jesan." defaultTextBn="জেসান কর্তৃক সরাসরি বাছাইকৃত অত্যন্ত প্রিমিয়াম জুয়েলারি ডিজাইন।">
                  {language === 'bn' ? 'জেসান কর্তৃক সরাসরি বাছাইকৃত অত্যন্ত প্রিমিয়াম জুয়েলারি ডিজাইন।' : 'Hand-selected designs by Md Tarikul Alam Jesan.'}
                </EditableElement>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ELEGANT JEWELLERY SHOWCASE (CATEGORIES) */}
      <section 
        className="container mx-auto px-4 lg:px-8 text-center space-y-12 py-12 rounded-xl"
        style={{ backgroundColor: settings.categoriesBgColor, color: settings.categoriesTextColor }}
      >
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-amber-400 font-semibold block">
            <EditableElement id="cat-section-subtitle" defaultText="Luxury Categories" defaultTextBn="প্রিমিয়াম ক্যাটাগরি">
              {language === 'bn' ? 'প্রিমিয়াম ক্যাটাগরি' : 'Luxury Categories'}
            </EditableElement>
          </span>
          <h2 className="text-2xl md:text-4xl font-sans font-bold" style={{ color: settings.categoriesTextColor }}>
            <EditableElement id="cat-section-title" defaultText="Shop by Royal Category" defaultTextBn="রয়াল ক্যাটাগরি অনুযায়ী অনুসন্ধান">
              {language === 'bn' ? 'রয়াল ক্যাটাগরি অনুযায়ী অনুসন্ধান' : 'Shop by Royal Category'}
            </EditableElement>
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <button
               key={c.id}
               onClick={() => handleCategoryClick(c.slug)}
               className="group relative h-80 rounded-lg overflow-hidden border border-stone-900 hover:border-amber-400/40 transition-colors focus:outline-none cursor-pointer"
            >
              <img
                src={c.image}
                alt={getTranslatedCategoryName(c.name, language)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 referrer-no-referrer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 text-left">
                <span className="text-stone-400 text-[10px] tracking-widest font-mono uppercase">
                  {language === 'bn' ? 'কালেকশন' : 'COLLECTION'}
                </span>
                <span className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {getTranslatedCategoryName(c.name, language)}
                </span>
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'bn' ? 'এখনই দেখুন' : 'Discover Now'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. EID CELEBRATION / SPECIAL PROMO countdown BANNER */}
      {settings.eidOfferActive && (
        <section 
          className={`border-t border-b border-amber-500/20 py-16 ${settings.hideEidSectionOnMobile ? 'hidden sm:block' : 'block'}`}
          style={{ backgroundColor: settings.eidSectionBgColor, color: settings.eidSectionTextColor }}
        >
          <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/25 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                {language === 'bn' ? '🌙 উৎসবমুখর বিশেষ অফার' : '🌙 Festive Celebration Offer'}
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight" style={{ color: settings.eidSectionTextColor }}>
                {language === 'bn' ? (
                  <>ঈদ স্পেশাল লাক্সারি কালেকশন <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">সাশ্রয় করুন {settings.eidDiscountPercent}%</span></>
                ) : (
                  <>Premium Eid Al-Adha Collection <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Save {settings.eidDiscountPercent}%</span></>
                )}
              </h2>
              <p className="text-sm md:text-base leading-relaxed font-sans" style={{ color: settings.eidSectionTextColor ? `${settings.eidSectionTextColor}de` : '#e2e8f0' }}>
                {language === 'bn' ? (
                  <>গোল্ড প্লেটেড বালা এবং টিয়ারড্রপ এমারেল্ড কানের দুলের ডিজাইন দিয়ে ঈদ সুন্দর করুন। চেকআউটের সময় কুপন কোড <strong className="text-amber-400 bg-stone-900 px-2 py-1 rounded border border-stone-850 font-mono tracking-wider animate-pulse">EID2026</strong> ব্যবহার করলেই পাচ্ছেন সর্বমোট বিলে সর্বোচ্চ ১৫%-২০% আকর্ষণীয় ছাড়!</>
                ) : (
                  <>Elevate your look with royal gold plated bangles and deep emerald drops. Simply enter coupon code <strong className="text-amber-400 bg-stone-900 px-2 py-1 rounded border border-stone-850 font-mono tracking-wider animate-pulse">EID2026</strong> during checkout for an instant 15% to 20% discount on entire jewellery catalogs!</>
                )}
              </p>
              
              {/* Simulated countdown clock */}
              <div className="grid grid-cols-4 gap-4 max-w-xs font-mono">
                <div className="bg-stone-900 border border-stone-800 p-3 rounded text-center">
                  <span className="block text-xl md:text-2xl font-bold text-amber-400">04</span>
                  <span className="text-[9px] text-stone-400 uppercase">{language === 'bn' ? 'দিন' : 'Days'}</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-3 rounded text-center">
                  <span className="block text-xl md:text-2xl font-bold text-amber-400">18</span>
                  <span className="text-[9px] text-stone-400 uppercase">{language === 'bn' ? 'ঘণ্টা' : 'Hours'}</span>
                </div>
                <div className="bg-stone-950 border border-stone-800 p-3 rounded text-center">
                  <span className="block text-xl md:text-2xl font-bold text-amber-400">42</span>
                  <span className="text-[9px] text-stone-400 uppercase">{language === 'bn' ? 'মিনিট' : 'Mins'}</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-3 rounded text-center">
                  <span className="block text-xl md:text-2xl font-bold text-amber-400 flex items-center justify-center gap-0.5 animate-pulse">26</span>
                  <span className="text-[9px] text-stone-400 uppercase">{language === 'bn' ? 'সেকেন্ড' : 'Secs'}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => { setSelectedCategorySlug(null); setActiveTab('shop'); }}
                  className="btn-luxury-cta text-xs tracking-widest px-8 py-3.5 font-bold uppercase cursor-pointer"
                  style={{ backgroundColor: settings.buttonBgColor, color: settings.buttonTextColor }}
                >
                  {language === 'bn' ? 'অফারের গহনাগুলো দেখুন' : 'Shop Offer Products'}
                </button>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-amber-500/10 shadow-2xl">
              <img
                src={settings.eidImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"}
                alt="Eid Jewels"
                className="w-full h-96 object-cover referrer-no-referrer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/20"></div>
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED Curation */}
      <section 
        className="container mx-auto px-4 lg:px-8 text-center space-y-12 py-12 rounded-xl"
        style={{ backgroundColor: settings.bestsellersBgColor, color: settings.bestsellersTextColor }}
      >
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-amber-400 font-semibold">
            {language === 'bn' ? 'আরিয়ান বিশেষ পছন্দ' : 'ARISAN Favourites'}
          </span>
          <h2 className="text-2xl md:text-4xl font-sans font-bold" style={{ color: settings.bestsellersTextColor }}>
            {language === 'bn' ? 'আমাদের সেরা গহনা সমূহ' : 'Featured Masterpieces'}
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. TRENDING SELECTION */}
      <section 
        className="container mx-auto px-4 lg:px-8 text-center space-y-12 py-12 rounded-xl border border-stone-850"
        style={{ backgroundColor: settings.bestsellersBgColor, color: settings.bestsellersTextColor }}
      >
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-amber-400 font-semibold">
            {language === 'bn' ? 'ভাইরাল অলংকার' : 'Viral Jewels'}
          </span>
          <h2 className="text-2xl md:text-4xl font-sans font-bold" style={{ color: settings.bestsellersTextColor }}>
            {language === 'bn' ? 'বর্তমানে সবচেয়ে বেশি বিক্রিত' : 'Trending Right Now'}
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section 
        className="container mx-auto px-4 lg:px-8 text-center space-y-12 py-12 rounded-xl"
        style={{ backgroundColor: settings.newArrivalsBgColor, color: settings.newArrivalsTextColor }}
      >
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-emerald-400 font-semibold">
            {language === 'bn' ? 'নতুন কালেকশন' : 'Just Unboxed'}
          </span>
          <h2 className="text-2xl md:text-4xl font-sans font-bold" style={{ color: settings.newArrivalsTextColor }}>
            {language === 'bn' ? 'চলতি সপ্তাহের নতুন ডিজাইন' : 'New Arrivals'}
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="container mx-auto px-4 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-amber-400 font-semibold">
            {language === 'bn' ? 'গ্রাহকদের কিছু মতামত' : 'Customer Testimonials'}
          </span>
          <h2 className="text-2xl md:text-4xl font-sans font-bold text-stone-100">
            {language === 'bn' ? 'ফ্যাশন প্রিয়দের আস্থার ঠিকানা' : 'Loved by Fashion Seekers'}
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="bg-stone-950 border border-stone-900 rounded-lg p-6 relative">
              <span className="absolute top-4 right-4 text-emerald-500 font-bold text-lg">&#x201c;</span>
              <div className="flex gap-1.5 text-amber-400 mb-4 justify-start">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-stone-300 text-sm leading-relaxed text-left min-h-[100px]">
                {language === 'bn' && r.comment.includes('finishing is absolutely') ? 'ফিনিশিং টা অসম্ভব সুন্দর! গ্রিন কালারটা জাস্ট অসাধারণ আর অনেকদিন ব্যবহারের পরেও কালার একদম নতুনের মত আছে।' :
                 language === 'bn' && r.comment.includes('Wore this choker on') ? 'ঈদ গেট-টুগেদারে এটা পরেছিলাম এবং সবাই খুব প্রশংসা করেছে। অনেক প্রিমিয়াম ও ইউনিক একটা ডিজাইন। আরিযান আসলেই গুণগত মান নিশ্চিত করে!' :
                 language === 'bn' && r.comment.includes('Bought this as an anniversary') ? 'স্ত্রীর জন্য বিবাহ বার্ষিকীতে গিফট করার জন্য এটা কিনেছিলাম। ওর ডিজাইনটা খুব পছন্দ হয়েছে আর প্যাকেজিংটাও ছিল গর্জিয়াস!' : r.comment}
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-900/60 text-left">
                {r.avatar ? (
                  <img src={r.avatar} alt={r.author} className="w-10 h-10 object-cover rounded-full border border-stone-850" />
                ) : (
                  <div className="w-10 h-10 bg-emerald-950 text-emerald-400 font-bold rounded-full flex items-center justify-center">
                    {r.author[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-stone-100">{r.author}</h4>
                  <span className="text-xs text-stone-500">
                    {language === 'bn' && r.productTitle === 'Emerald Royale Ring' ? 'এমারেল্ড রয়্যাল আংটি' :
                     language === 'bn' && r.productTitle === 'Empress Emerald Choker' ? 'এম্প্রেস এমারেল্ড চোকার' :
                     language === 'bn' && r.productTitle === 'Aurum Minimal Bangle' ? 'অরাম মিনিমাল চুড়ি' : r.productTitle}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PREMIUM NEWSLETTER SUBSCRIBE */}
      <section className="container mx-auto px-4 lg:px-8">
        <div 
          className="relative border border-stone-900 rounded-xl p-8 md:p-12 overflow-hidden text-center"
          style={{ backgroundColor: settings.newsletterBgColor || '#064e3b', color: settings.newsletterTextColor || '#ffffff' }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <Mail className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <h3 className="text-xl md:text-3xl font-sans font-bold" style={{ color: settings.newsletterTextColor || '#ffffff' }}>
                {language === 'bn' ? 'আরিযান ভিআইপি ক্লায়েন্ট লিস্ট' : 'Join the ARISAN Client list'}
              </h3>
              <p className="text-xs md:text-sm opacity-90" style={{ color: settings.newsletterTextColor ? `${settings.newsletterTextColor}f2` : '#e2e8f0' }}>
                {language === 'bn' 
                  ? 'জেসান কর্তৃক সরাসরি সিলেক্ট করা সিক্রেট জুয়েলারি কালেকশন এবং বাংলাদেশে আরিযান এর ফেস্টিভ ডিসকাউন্ট এর খবর সবার আগে ইমেইলে পেয়ে যান।'
                  : 'Get email notifications about secret collections curated by Md Tarikul Alam Jesan, special offers and discounts in Bangladesh. No spam.'}
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="text-emerald-400 text-xs font-bold bg-emerald-950/40 p-4 border border-emerald-900/40 rounded">
                {language === 'bn' 
                  ? '✔ সফল হয়েছে! আপনি আমাদের ভিআইপি ক্লায়েন্ট তালিকায় নিবন্ধিত হয়েছেন। স্পেশাল অফারগুলোর জন্য আপনার ইমেইল চেক করুন।'
                  : '✔ Success! You are now locked into the VIP Client register. Check your email for a special launch coupon.'}
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  required
                  placeholder={language === 'bn' ? 'আপনার সচল ইমেইল দিন' : 'name@example.com'}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-800 text-stone-200 text-sm px-4 py-3 rounded focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold uppercase text-xs tracking-wider px-6 py-3 rounded hover:opacity-90 transition-opacity cursor-pointer flex justify-center items-center gap-1.5 sm:shrink-0"
                >
                  {language === 'bn' ? 'যুক্ত হোন' : 'Join VIP List'}
                </button>
              </form>
            )}
            <p className="text-[10px] text-stone-500">
              {language === 'bn' 
                ? 'নিবন্ধনের মাধ্যমে আপনি আমাদের নিয়মাবলীতে সম্মতি প্রকাশ করছেন।'
                : 'By subscribing, you agree with our Privacy Safeguards and Terms of Curation.'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
