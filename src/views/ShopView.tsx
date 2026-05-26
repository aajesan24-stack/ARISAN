import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react';
import { getTranslatedCategoryName } from '../utils/translations';

export const ShopView: React.FC = () => {
  const { products, categories, selectedCategorySlug, setSelectedCategorySlug, language } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'rating-desc'>('default');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Compute maximum price bounds
  const highestPriceInCatalog = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  // Set default bounds slider
  useState(() => {
    setMaxPrice(highestPriceInCatalog);
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchFilter.trim()) {
      const keyword = searchFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.category.toLowerCase().includes(keyword)
      );
    }

    // Category filter
    if (selectedCategorySlug) {
      result = result.filter((p) => p.category === selectedCategorySlug);
    }

    // Price boundary filter
    result = result.filter((p) => {
      const activePrice = p.discountPrice || p.price;
      return activePrice <= maxPrice;
    });

    // Stock availability filter
    if (onlyInStock) {
      result = result.filter((p) => p.stockStatus !== 'Out of Stock');
    }

    // Sorting parameters
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOrder === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchFilter, selectedCategorySlug, maxPrice, onlyInStock, sortOrder]);

  const handleResetFilters = () => {
    setSearchFilter('');
    setSelectedCategorySlug(null);
    setMaxPrice(highestPriceInCatalog);
    setSortOrder('default');
    setOnlyInStock(false);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Visual Title Header */}
      <div className="text-left space-y-2 border-b border-stone-900 pb-6">
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">
          {language === 'bn' ? 'আরিফাইন রাজকীয় ক্যাটালগ' : 'ARISAN Royal Catalogs'}
        </h1>
        <p className="text-sm text-stone-400 font-sans">
          {language === 'bn' 
            ? 'সারা বাংলাদেশের ফ্যাশন প্রিয় নারীদের সাজসজ্জার জন্য অত্যন্ত নিখুঁত ও চমৎকার লাক্সারি ফ্যাশন জুয়েলারি কালেকশন।' 
            : 'Browse luxury-grade fashion jewellery meticulously crafted for Bangladesh style. Timeless designs, budget friendly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <aside className="space-y-6 lg:border-r lg:border-stone-900 lg:pr-8">
          <div className="flex justify-between items-center bg-stone-950 p-4 lg:p-0 lg:bg-transparent rounded border border-stone-900 lg:border-0 font-sans">
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
              {language === 'bn' ? 'ক্যাটালগ ফিল্টার' : 'Catalogue Filters'}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {language === 'bn' ? 'সব রিসেট করুন' : 'Reset All'}
            </button>
          </div>

          {/* Keyword Search */}
          <div className="space-y-2 font-sans">
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider">
              {language === 'bn' ? 'অলংকার সার্চ করুন' : 'Search Catalogue'}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'bn' ? 'যেমন: বালা, আংটি, কানের দুল...' : 'Find bangles, rings...'}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-stone-950 border border-stone-850 text-stone-200 text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-amber-400"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-stone-500" />
            </div>
          </div>

          {/* Categories select options list */}
          <div className="space-y-2 font-sans">
            <span className="block text-xs font-semibold text-stone-400 uppercase tracking-wider">
              {language === 'bn' ? 'কালেকশন ক্যাটাগরি' : 'Collections'}
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={`w-full text-left text-xs px-3 py-2 rounded transition-colors cursor-pointer ${
                  selectedCategorySlug === null
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                {language === 'bn' ? 'সব ধরণের গহনা' : 'All Curated Items'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`w-full text-left text-xs px-3 py-2 rounded transition-colors cursor-pointer flex justify-between items-center ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'text-stone-300 hover:bg-stone-900'
                  }`}
                >
                  <span>{getTranslatedCategoryName(cat.name, language)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedCategorySlug === cat.slug ? 'bg-stone-950/20 text-stone-950 font-bold' : 'bg-stone-900 text-stone-400'}`}>
                    {products.filter((p) => p.category === cat.slug).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div className="space-y-3 font-sans">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-400 uppercase tracking-wider">
                {language === 'bn' ? 'সর্বোচ্চ বাজেট' : 'Price Limits'}
              </span>
              <span className="font-mono text-emerald-400 font-semibold">{language === 'bn' ? 'অনূর্ধ্বঃ' : 'Max:'} ৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={highestPriceInCatalog > 10000 ? highestPriceInCatalog : 10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>৳100 BDT</span>
              <span>৳10,000 BDT</span>
            </div>
          </div>

          {/* Quick status checkboxes */}
          <div className="pt-2 border-t border-stone-900 font-sans">
            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              {language === 'bn' ? 'স্টক ফুরিয়ে যাওয়া গহনা লুকান' : 'Hide Out of Stock items'}
            </label>
          </div>

        </aside>

        {/* PRODUCTS LIST */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header controls layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-950 border border-stone-900 p-4 rounded-lg font-sans">
            <div className="text-xs text-stone-400">
              {language === 'bn' ? (
                <>সর্বমোট <strong className="text-amber-400">{filteredProducts.length}</strong> টি চমৎকার অলংকার পাওয়া গেছে</>
              ) : (
                <>Showing <strong className="text-stone-250">{filteredProducts.length}</strong> luxurious jewellery items</>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-400 uppercase shrink-0">{language === 'bn' ? 'সাজানোর ক্রমঃ' : 'Sort By:'}</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-stone-900 border border-stone-850 rounded px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 w-full sm:w-auto cursor-pointer"
              >
                <option value="default">{language === 'bn' ? 'প্রাসঙ্গিকতা' : 'Relevance Curation'}</option>
                <option value="price-asc">{language === 'bn' ? 'মূল্যঃ কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-desc">{language === 'bn' ? 'মূল্যঃ বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="rating-desc">{language === 'bn' ? 'উচ্চ রেটিং সম্পন্ন' : 'Highly Rated'}</option>
              </select>
            </div>
          </div>

          {/* Product Cards Loop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-stone-900 rounded bg-stone-950/25 font-sans">
              <Sparkles className="w-10 h-10 text-amber-500/20 mx-auto mb-4 animate-pulse" />
              <h3 className="text-base font-semibold text-stone-300">
                {language === 'bn' ? 'কোনো গহনা পাওয়া যায়নি' : 'No Jewels match filters'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-sans">
                {language === 'bn' 
                  ? 'আপনার পছন্দসই দাম বা ক্যাটাগরির সাথে আমাদের অলংকারগুলো মিলছে না। সব পণ্য দেখতে নিচের ফিল্টার রিসেট বোতাম চাপুন!' 
                  : 'No active gemstones matched your search limits. Try resetting filters to browse our royal collection catalog!'}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 inline-block bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded hover:bg-amber-500 cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'সব গহনা দেখান' : 'Show All Jewellery'}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
