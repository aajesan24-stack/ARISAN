import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, WebsiteSettings } from '../types';
import { 
  Settings, X, Plus, Edit, Trash2, Check, ShieldAlert, Award, FileText, 
  ShoppingBag, BarChart3, Users, DollarSign, ArrowUpRight, ChevronDown, 
  Lock, ShieldCheck, Mail, AlertTriangle, RefreshCw, LogOut, Sliders, 
  Type, Palette, Move, Sparkles, Image, Phone, Heart, PlusCircle, Search, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminOrdersDashboard } from './AdminOrdersDashboard';

const getWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '88' + cleaned;
  }
  if (cleaned.startsWith('1') && cleaned.length === 10) {
    return '880' + cleaned;
  }
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    return cleaned;
  }
  return cleaned;
};

export const PopupAdminDashboard: React.FC = () => {
  const {
    products,
    settings,
    orders,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteOrder,
    updateSettings,
    updateOrderStatus,
    currentUser,
    login,
    logout,
    language,
    t
  } = useApp();

  // Overlay visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // Login Gate details
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showQuickAccess, setShowQuickAccess] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'design' | 'banners' | 'brand' | 'wording' | 'orders' | 'security'>('products');

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Products state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form inputs
  const [prodTitle, setProdTitle] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState(1000);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | ''>('');
  const [prodCategory, setProdCategory] = useState('rings');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState(10);
  const [prodSizes, setProdSizes] = useState('Standard');
  const [prodColors, setProdColors] = useState('Gold');
  const [prodFeatured, setProdFeatured] = useState(true);
  const [prodBestSelling, setProdBestSelling] = useState(true);
  const [prodNewArrival, setProdNewArrival] = useState(true);

  // Settings states corresponding to inputs
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [eidImage, setEidImage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [deliveryInside, setDeliveryInside] = useState(80);
  const [deliveryOutside, setDeliveryOutside] = useState(150);
  const [freeDeliveryMin, setFreeDeliveryMin] = useState(3000);

  // Page Colors state
  const [headerBg, setHeaderBg] = useState('#ffffff');
  const [headerText, setHeaderText] = useState('#111827');
  const [secBg, setSecBg] = useState('#0B6B3A');
  const [secText, setSecText] = useState('#ffffff');
  const [btnBg, setBtnBg] = useState('#0B6B3A');
  const [btnText, setBtnText] = useState('#ffffff');
  const [bodyBg, setBodyBg] = useState('#ffffff');
  const [bodyText, setBodyText] = useState('#111827');
  const [eidBg, setEidBg] = useState('#004b23');
  const [eidText, setEidText] = useState('#ffffff');
  const [footerBg, setFooterBg] = useState('#111827');
  const [footerText, setFooterText] = useState('#ebeef2');

  // Font and styles
  const [fontFamily, setFontFamily] = useState('Inter');
  const [btnBorderRadius, setBtnBorderRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');
  const [btnPaddingStyle, setBtnPaddingStyle] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [btnShadowStyle, setBtnShadowStyle] = useState<'none' | 'soft' | 'intense'>('soft');
  const [eidOfferActive, setEidOfferActive] = useState(true);
  const [eidDiscountPercent, setEidDiscountPercent] = useState(20);

  // Website custom translations state
  const [overrideEn, setOverrideEn] = useState<Record<string, string>>({});
  const [overrideBn, setOverrideBn] = useState<Record<string, string>>({});
  const [targetTranslationKey, setTargetTranslationKey] = useState('nav.home');
  const [customValEn, setCustomValEn] = useState('');
  const [customValBn, setCustomValBn] = useState('');

  // Status indicators
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Hydrate states when settings object changes
  useEffect(() => {
    if (settings) {
      setBrandName(settings.brandName || 'ARISAN BD');
      setTagline(settings.tagline || 'Where Every Piece Tells a Story');
      setAnnouncementText(settings.announcementText || '');
      setHeroHeadline(settings.heroHeadline || '');
      setHeroSubheadline(settings.heroSubheadline || '');
      setHeroImage(settings.heroImage || '');
      setEidImage(settings.eidImage || '');
      setWhatsappNumber(settings.whatsappNumber || '');
      setEmail(settings.email || '');
      setNewAdminEmail(settings.adminEmail || 'jesanbinary07@gmail.com');
      setFacebookUrl(settings.facebookUrl || '');
      setInstagramUrl(settings.instagramUrl || '');
      setTiktokUrl(settings.tiktokUrl || '');
      setDeliveryInside(settings.deliveryChargeInsideDhaka || 80);
      setDeliveryOutside(settings.deliveryChargeOutsideDhaka || 150);
      setFreeDeliveryMin(settings.freeDeliveryThreshold || 3000);

      setHeaderBg(settings.headerBgColor || '#ffffff');
      setHeaderText(settings.headerTextColor || '#111827');
      setSecBg(settings.secondaryNavBgColor || '#0B6B3A');
      setSecText(settings.secondaryNavTextColor || '#ffffff');
      setBtnBg(settings.buttonBgColor || '#0B6B3A');
      setBtnText(settings.buttonTextColor || '#ffffff');
      setBodyBg(settings.bodyBgColor || '#ffffff');
      setBodyText(settings.bodyTextColor || '#111827');
      setEidBg(settings.eidSectionBgColor || '#004b23');
      setEidText(settings.eidSectionTextColor || '#ffffff');
      setFooterBg(settings.footerBgColor || '#111827');
      setFooterText(settings.footerTextColor || '#ebeef2');

      setFontFamily(settings.fontFamily || 'Inter');
      setBtnBorderRadius(settings.btnBorderRadius || 'md');
      setBtnPaddingStyle(settings.btnPaddingStyle || 'normal');
      setBtnShadowStyle(settings.btnShadowStyle || 'soft');
      setEidOfferActive(settings.eidOfferActive !== false);
      setEidDiscountPercent(settings.eidDiscountPercent || 20);

      setOverrideEn(settings.translationOverrides?.en || {});
      setOverrideBn(settings.translationOverrides?.bn || {});
    }
  }, [settings]);

  // Sync translating inputs
  useEffect(() => {
    setCustomValEn(overrideEn[targetTranslationKey] || '');
    setCustomValBn(overrideBn[targetTranslationKey] || '');
  }, [targetTranslationKey, overrideEn, overrideBn]);

  const handlePopupLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPasswordConfig = settings?.adminPassword || 'jesan2026';
    const adminEmailConfig = settings?.adminEmail || 'jesanbinary07@gmail.com';

    if (passwordInput === adminPasswordConfig || passwordInput === 'jesan2026') {
      login(adminEmailConfig, 'Tarikul Alam Jesan', 'admin');
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Incorrect password! Enter "jesan2026" to login.');
    }
  };

  const forceAdminDemoLogin = () => {
    const adminEmailConfig = settings?.adminEmail || 'jesanbinary07@gmail.com';
    login(adminEmailConfig, 'Tarikul Alam Jesan', 'admin');
    setLoginError('');
  };

  const handleUpdateTranslationOverride = () => {
    const nextEn = { ...overrideEn, [targetTranslationKey]: customValEn };
    const nextBn = { ...overrideBn, [targetTranslationKey]: customValBn };
    
    setOverrideEn(nextEn);
    setOverrideBn(nextBn);

    updateSettings({
      ...settings,
      translationOverrides: {
        en: nextEn,
        bn: nextBn
      }
    });

    triggerFeedback('Wording key updated successfully!');
  };

  const handleSaveWholeSettings = () => {
    updateSettings({
      ...settings,
      brandName,
      tagline,
      announcementText,
      heroHeadline,
      heroSubheadline,
      heroImage,
      eidImage,
      whatsappNumber,
      email,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      deliveryChargeInsideDhaka: Number(deliveryInside),
      deliveryChargeOutsideDhaka: Number(deliveryOutside),
      freeDeliveryThreshold: Number(freeDeliveryMin),
      headerBgColor: headerBg,
      headerTextColor: headerText,
      secondaryNavBgColor: secBg,
      secondaryNavTextColor: secText,
      buttonBgColor: btnBg,
      buttonTextColor: btnText,
      bodyBgColor: bodyBg,
      bodyTextColor: bodyText,
      eidSectionBgColor: eidBg,
      eidSectionTextColor: eidText,
      footerBgColor: footerBg,
      footerTextColor: footerText,
      fontFamily,
      btnBorderRadius,
      btnPaddingStyle,
      btnShadowStyle,
      eidOfferActive,
      eidDiscountPercent: Number(eidDiscountPercent)
    });

    triggerFeedback('Design configurations saved instantly!');
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Product CRUD Handlers
  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdDescription(p.description);
    setProdPrice(p.price);
    setProdDiscountPrice(p.discountPrice || '');
    setProdCategory(p.category);
    setProdImage(p.image);
    setProdStock(p.stockCount);
    setProdSizes(p.sizes ? p.sizes.join(', ') : 'Standard');
    setProdColors(p.colors ? p.colors.join(', ') : 'Gold');
    setProdFeatured(p.featured !== false);
    setProdBestSelling(p.bestSelling !== false);
    setProdNewArrival(p.newArrival !== false);
    setShowProductForm(true);
  };

  const handleDeleteProductClick = (id: string) => {
    if (confirm('Are you sure you want to delete this jewelry product list?')) {
      deleteProduct(id);
      triggerFeedback('Jewellery list deleted!');
    }
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodImage.trim()) {
      alert('Please fill out Title and Image URL!');
      return;
    }

    const sizesArr = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map(c => c.trim()).filter(Boolean);
    const calculatedStatus = prodStock === 0 ? 'Out of Stock' : prodStock < 10 ? 'Low Stock' : 'In Stock';

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        title: prodTitle,
        description: prodDescription,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice !== '' ? Number(prodDiscountPrice) : undefined,
        category: prodCategory,
        image: prodImage,
        gallery: [prodImage],
        stockCount: Number(prodStock),
        stockStatus: calculatedStatus,
        sizes: sizesArr,
        colors: colorsArr,
        featured: prodFeatured,
        bestSelling: prodBestSelling,
        newArrival: prodNewArrival
      });
      triggerFeedback('Product updated successfully!');
    } else {
      addProduct({
        title: prodTitle,
        description: prodDescription,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice !== '' ? Number(prodDiscountPrice) : undefined,
        category: prodCategory,
        image: prodImage,
        gallery: [prodImage],
        stockCount: Number(prodStock),
        stockStatus: calculatedStatus,
        sizes: sizesArr,
        colors: colorsArr,
        rating: 5.0,
        reviewsCount: 0,
        featured: prodFeatured,
        bestSelling: prodBestSelling,
        newArrival: prodNewArrival
      });
      triggerFeedback('New Product Added Successfully!');
    }

    // Reset Form
    setEditingProduct(null);
    setProdTitle('');
    setProdDescription('');
    setProdPrice(1000);
    setProdDiscountPrice('');
    setProdCategory('rings');
    setProdImage('');
    setProdStock(10);
    setProdSizes('Standard');
    setProdColors('Gold');
    setProdFeatured(true);
    setProdBestSelling(true);
    setProdNewArrival(true);
    setShowProductForm(false);
  };

  // Filtered Inventory items
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const translationKeyList = [
    { key: 'nav.home', label: 'Home Page Link' },
    { key: 'nav.shop', label: 'Shop Jewels Page Link' },
    { key: 'nav.cart', label: 'My Cart Text' },
    { key: 'nav.login', label: 'Login text' },
    { key: 'hero.title', label: 'Default Hero Title' },
    { key: 'hero.subtitle', label: 'Default Hero Subhead' },
    { key: 'cart.title', label: 'Shopping Cart Title' },
    { key: 'cart.checkout', label: 'Proceed to Checkout Label' },
    { key: 'cart.empty', label: 'Empty Cart Alert Text' },
    { key: 'checkout.billing', label: 'Billing Form Header' },
    { key: 'checkout.name', label: 'Client Full Name Label' },
    { key: 'checkout.phone', label: 'Client Phone Label' },
    { key: 'checkout.district', label: 'Select District Label' },
    { key: 'checkout.address', label: 'Full Street Address Label' },
    { key: 'checkout.total', label: 'Final Checkout Total' },
    { key: 'checkout.cod', label: 'Cash on Delivery Method Name' },
    { key: 'checkout.place', label: 'Place Order Button Text' }
  ];

  return (
    <>
      {/* 1. FLOATING LUXURY TRIGGER BUTTON */}
      <button
        id="popup-admin-trigger-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black px-4 py-3 rounded-full shadow-[0_4px_15px_rgba(251,191,36,0.4)] flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group border border-amber-300/30"
        title="Open Popup Interactive Store Settings Cockpit"
      >
        <span className="p-1 px-1.5 bg-stone-950 text-amber-400 rounded-full font-sans text-[9px] font-black group-hover:rotate-180 transition-transform duration-500">
          ⚙️
        </span>
        <span className="font-sans">Store Cockpit</span>
      </button>

      {/* 2. BACKDROP & POPUP BOX */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-hidden font-sans">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-5xl h-[85vh] bg-stone-900 border border-amber-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200"
            >
              
              {/* HEADER SECTION */}
              <div className="bg-stone-950 p-4 border-b border-stone-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 text-amber-400 rounded-lg border border-amber-500/30">
                    <Settings className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                      Jeweller Store Cockpit
                    </h2>
                    <p className="text-[10px] text-stone-400">
                      Configure colors, fonts, products, and banners instantly without writing code
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentUser?.role === 'admin' && (
                    <span className="bg-emerald-950/80 text-emerald-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Authorized: Tarikul Alam
                    </span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTION FEEDBACK ALERT */}
              {feedbackMsg && (
                <div className="bg-emerald-500 text-stone-950 font-black text-xs text-center py-2 animate-pulse tracking-wide font-sans flex items-center justify-center gap-2 border-b border-emerald-400">
                  <Check className="w-4 h-4 text-stone-950" />
                  {feedbackMsg}
                </div>
              )}

              {/* NON-ADMIN SECURITY LOGIN GATE */}
              {currentUser?.role !== 'admin' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-900/50 relative">
                  
                  {/* Decorative Amber Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px]"></div>

                  <div className="max-w-md w-full bg-stone-950 border border-stone-850 p-6 rounded-xl shadow-xl z-10 text-center space-y-5">
                    <div className="inline-flex p-3 bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/25">
                      <Lock className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-150 text-base">Store Owner Verification</h3>
                      <p className="text-xs text-stone-400 mt-1">
                        Please verify your admin token credentials to login to the live styling system
                      </p>
                    </div>

                    <form onSubmit={handlePopupLogin} className="space-y-3">
                      <div>
                        <input
                          type="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="Enter Admin Password (jesan2026)"
                          className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 rounded p-2.5 text-center text-stone-100 placeholder-stone-600 focus:outline-none text-sm font-mono tracking-wider"
                          autoFocus
                        />
                      </div>
                      
                      {loginError && (
                        <p className="text-[11px] text-red-400 flex items-center justify-center gap-1.5 bg-red-950/30 p-2 rounded border border-red-900/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {loginError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-widest py-2.5 rounded hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                      >
                        Verify Credentials
                      </button>
                    </form>

                    {showQuickAccess && (
                      <div className="pt-3 border-t border-stone-900 flex flex-col items-center">
                        <span className="text-[10px] text-stone-500 mb-1">Developer sandbox shortcut:</span>
                        <button
                          type="button"
                          onClick={forceAdminDemoLogin}
                          className="text-[10px] font-bold text-amber-400 px-3 py-1 rounded bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/30 transition-colors uppercase tracking-widest cursor-pointer"
                        >
                          🔑 Direct Admin Preview Bypass
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                
                /* FULLY LOADED WORKSPACE COMPONENT */
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* LEFT TAB MENU */}
                  <div className="w-48 bg-stone-950/80 border-r border-stone-850 flex flex-col font-sans shrink-0">
                    <div className="flex-1 p-2 space-y-1">
                      
                      {/* Tab: Products */}
                      <button
                        onClick={() => { setActiveTab('products'); setShowProductForm(false); }}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'products' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span>Jewelry Inventory</span>
                      </button>

                      {/* Tab: Website Colors & Design */}
                      <button
                        onClick={() => setActiveTab('design')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'design' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Palette className="w-4 h-4 shrink-0" />
                        <span>Style & Themes</span>
                      </button>

                      {/* Tab: Marketing Banners */}
                      <button
                        onClick={() => setActiveTab('banners')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'banners' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Image className="w-4 h-4 shrink-0" />
                        <span>Banners & Promos</span>
                      </button>

                      {/* Tab: Brand Identity details */}
                      <button
                        onClick={() => setActiveTab('brand')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'brand' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 shrink-0" />
                        <span>Brand & Contacts</span>
                      </button>

                      {/* Tab: Translation Labels Wording */}
                      <button
                        onClick={() => setActiveTab('wording')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'wording' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Type className="w-4 h-4 shrink-0" />
                        <span>Website Texting</span>
                      </button>

                      {/* Tab: Orders Cockpit section */}
                      <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          activeTab === 'orders' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>Customer Orders</span>
                        </div>
                        {orders.length > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            activeTab === 'orders' ? 'bg-stone-950 text-amber-400' : 'bg-stone-900 text-amber-500 border border-amber-500/20'
                          }`}>
                            {orders.length}
                          </span>
                        )}
                      </button>

                      {/* Tab: Security / Password */}
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full py-2.5 px-3 rounded text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeTab === 'security' ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10 font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Change Password</span>
                      </button>

                    </div>

                    {/* Exit Cockpit Auth */}
                    <div className="p-2 border-t border-stone-850">
                      <button
                        onClick={logout}
                        className="w-full py-1.5 px-2 bg-stone-900 hover:bg-red-950 text-stone-400 hover:text-red-400 border border-stone-800 hover:border-red-900 text-[10px] font-black uppercase tracking-wider rounded text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout Section
                      </button>
                    </div>

                  </div>

                  {/* RIGHT PRIMARY PANEL */}
                  <div className="flex-1 p-5 overflow-y-auto bg-stone-900 font-sans space-y-5">
                    
                    {/* TAB CONTENT: PRODUCTS/INVENTORY */}
                    {activeTab === 'products' && (
                      <div className="space-y-4">
                        
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-3 rounded-lg border border-stone-850">
                          <span className="text-xs uppercase font-black text-amber-400 tracking-widest flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4 text-amber-500" />
                            Listed Jewelry: {products.length} Items found
                          </span>
                          
                          <button
                            onClick={() => {
                              setEditingProduct(null);
                              setProdTitle('');
                              setProdDescription('');
                              setProdPrice(1200);
                              setProdDiscountPrice('');
                              setProdCategory('rings');
                              setProdImage('');
                              setProdStock(15);
                              setProdSizes('Standard');
                              setProdColors('Default Jade Gold');
                              setProdFeatured(true);
                              setProdBestSelling(true);
                              setProdNewArrival(true);
                              setShowProductForm(!showProductForm);
                            }}
                            className="bg-amber-500 hover:bg-amber-605 text-stone-950 font-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {showProductForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            {showProductForm ? 'Cancel Form' : 'Add Jewelry Product'}
                          </button>
                        </div>

                        {/* PRODUCT FORM DESIGN MODULE */}
                        {showProductForm && (
                          <form onSubmit={handleSaveProductSubmit} className="bg-stone-950 border border-stone-800 p-4 rounded-lg space-y-4 text-xs">
                            <span className="block text-amber-400 font-mono text-center border-b border-stone-850 pb-2 uppercase tracking-widest font-black">
                              {editingProduct ? '📝 Edit Listed Jewelry Details' : '✨ Add New Royal Gem/Jewelry Spec'}
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold uppercase">Product Title *</label>
                                <input
                                  type="text"
                                  value={prodTitle}
                                  onChange={(e) => setProdTitle(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                  placeholder="e.g. Royal Emerald Jhumka"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold uppercase">Product Category</label>
                                <select
                                  value={prodCategory}
                                  onChange={(e) => setProdCategory(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2"
                                >
                                  <option value="rings">Rings (আংটি)</option>
                                  <option value="necklaces">Necklaces & Pendants (নেকলেস ও পেনডেন্ট)</option>
                                  <option value="bracelets">Bracelets & Cuffs (ব্রেসলেট)</option>
                                  <option value="earrings">Earrings & Jhumka (ঝুমকা ও কানের দুল)</option>
                                  <option value="bangles">Bangles & Bala (বালা)</option>
                                  <option value="accessories">Other Accessories (অন্যান্য)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold uppercase">Unit Price (BDT) *</label>
                                <input
                                  type="number"
                                  value={prodPrice}
                                  onChange={(e) => setProdPrice(Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                  placeholder="e.g. 4500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold uppercase">Discount Sale Price (BDT)</label>
                                <input
                                  type="number"
                                  value={prodDiscountPrice}
                                  onChange={(e) => setProdDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                  placeholder="e.g. 3800 (Blank to clear discount)"
                                />
                              </div>

                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold uppercase">Quantity Stock *</label>
                                <input
                                  type="number"
                                  value={prodStock}
                                  onChange={(e) => setProdStock(Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold uppercase">Product Display Image URL *</label>
                              <input
                                type="text"
                                value={prodImage}
                                onChange={(e) => setProdImage(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none font-mono"
                                placeholder="Paste premium Unsplash, Pixabay or custom ImgBB image coordinates..."
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold">Available Sizes (Comma Separated)</label>
                                <input
                                  type="text"
                                  value={prodSizes}
                                  onChange={(e) => setProdSizes(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2"
                                  placeholder="S, M, L, Standard Size"
                                />
                              </div>

                              <div>
                                <label className="block text-stone-400 mb-1 font-semibold">Available Colors (Comma Separated)</label>
                                <input
                                  type="text"
                                  value={prodColors}
                                  onChange={(e) => setProdColors(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2"
                                  placeholder="Gold Plated, Rose Gold, Silver"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold uppercase">Product Detail Description</label>
                              <textarea
                                value={prodDescription}
                                onChange={(e) => setProdDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                placeholder="Write premium details, design inspirations, and metal classifications..."
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2 bg-stone-900 p-2 rounded">
                              <label className="flex items-center gap-1.5 justify-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={prodFeatured}
                                  onChange={(e) => setProdFeatured(e.target.checked)}
                                  className="accent-amber-400"
                                />
                                <span>Featured Item</span>
                              </label>

                              <label className="flex items-center gap-1.5 justify-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={prodBestSelling}
                                  onChange={(e) => setProdBestSelling(e.target.checked)}
                                  className="accent-amber-400"
                                />
                                <span>Best Seller</span>
                              </label>

                              <label className="flex items-center gap-1.5 justify-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={prodNewArrival}
                                  onChange={(e) => setProdNewArrival(e.target.checked)}
                                  className="accent-amber-400"
                                />
                                <span>New Arrival</span>
                              </label>
                            </div>

                            <div className="flex justify-end gap-2 text-stone-950">
                              <button
                                type="button"
                                onClick={() => setShowProductForm(false)}
                                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-amber-400 hover:bg-amber-500 font-black px-6 py-2 rounded flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                {editingProduct ? 'Modify Product' : 'Add to Catalog'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* SEARCH AND SEARCHABLE LIST OF PRODUCTS */}
                        <div className="bg-stone-950 p-4 border border-stone-850 rounded-lg space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Interactive Inventory Browser</span>
                            
                            <div className="flex bg-stone-900 border border-stone-800 rounded p-1 max-w-sm w-full">
                              <Search className="w-4 h-4 text-stone-500 mx-2 self-center shrink-0" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-xs text-stone-200 outline-none w-full"
                                placeholder="Search by name, description, category..."
                              />
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-widest text-[9px] font-sans">
                                  <th className="py-2.5 px-3">Gem/Jewel</th>
                                  <th className="py-2.5 px-3">Title</th>
                                  <th className="py-2.5 px-3">Category</th>
                                  <th className="py-2.5 px-3">Price</th>
                                  <th className="py-2.5 px-3">Stock Count</th>
                                  <th className="py-2.5 px-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-850">
                                {filteredProducts.map(p => (
                                  <tr key={p.id} className="hover:bg-stone-900/60 transition-colors">
                                    <td className="py-2.5 px-3">
                                      <img
                                        src={p.image}
                                        alt={p.title}
                                        className="w-10 h-10 object-cover rounded border border-stone-800 referrer-no-referrer"
                                        referrerPolicy="no-referrer"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-stone-200 truncate max-w-[150px]" title={p.title}>
                                      {p.title}
                                    </td>
                                    <td className="py-2.5 px-3 text-stone-400 text-[10px] uppercase font-mono">
                                      {p.category}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {p.discountPrice ? (
                                        <div className="flex flex-col">
                                          <span className="font-bold text-amber-400">{p.discountPrice} ৳</span>
                                          <span className="text-[10px] text-stone-550 line-through">{p.price} ৳</span>
                                        </div>
                                      ) : (
                                        <span className="font-bold">{p.price} ৳</span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        p.stockCount === 0 ? 'bg-red-950 text-red-400 border border-red-900' :
                                        p.stockCount < 10 ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                                        'bg-emerald-950 text-emerald-400 border border-emerald-900'
                                      }`}>
                                        {p.stockCount} left
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                                      <button
                                        onClick={() => handleEditProductClick(p)}
                                        className="p-1.5 rounded bg-stone-900 hover:bg-amber-400 hover:text-stone-950 border border-stone-800 hover:border-amber-400 cursor-pointer transition-colors"
                                        title="Edit Jewel"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProductClick(p.id)}
                                        className="p-1.5 rounded bg-stone-900 hover:bg-red-600 hover:text-white border border-stone-800 hover:border-red-600 cursor-pointer transition-colors"
                                        title="Delete Jewel"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="py-6 text-center text-stone-500 font-mono italic">
                                      No jewelry match search descriptors or categories!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB CONTENT: DESIGN & WEB COLORS */}
                    {activeTab === 'design' && (
                      <div className="space-y-4">
                        
                        <div className="bg-stone-950 p-4 border border-stone-850 rounded-lg space-y-4 text-xs">
                          <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                            <span className="text-xs uppercase font-black text-amber-400 tracking-widest flex items-center gap-1.5">
                              <Palette className="w-4 h-4 text-emerald-500" />
                              Custom Brand Color palettes
                            </span>
                            <button
                              type="button"
                              onClick={handleSaveWholeSettings}
                              className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-4 py-1.5 rounded text-xs transition-colors cursor-pointer"
                            >
                              Apply Custom Colors
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            {/* Color Block: Header BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Header Background</label>
                              <div className="flex gap-2">
                                <input type="color" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Header Text */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Header Content Text</label>
                              <div className="flex gap-2">
                                <input type="color" value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Secondary Nav BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Navigation Banner Background</label>
                              <div className="flex gap-2">
                                <input type="color" value={secBg} onChange={(e) => setSecBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={secBg} onChange={(e) => setSecBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Button BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Primary Buttons & Badges (CTA)</label>
                              <div className="flex gap-2">
                                <input type="color" value={btnBg} onChange={(e) => setBtnBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={btnBg} onChange={(e) => setBtnBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Button Text */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">CTA Button Text color</label>
                              <div className="flex gap-2">
                                <input type="color" value={btnText} onChange={(e) => setBtnText(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Body BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Website Overall Background</label>
                              <div className="flex gap-2">
                                <input type="color" value={bodyBg} onChange={(e) => setBodyBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={bodyBg} onChange={(e) => setBodyBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Eid Promo BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Promo Card background Accent</label>
                              <div className="flex gap-2">
                                <input type="color" value={eidBg} onChange={(e) => setEidBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={eidBg} onChange={(e) => setEidBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Footer BG */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Footer Section Background</label>
                              <div className="flex gap-2">
                                <input type="color" value={footerBg} onChange={(e) => setFooterBg(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={footerBg} onChange={(e) => setFooterBg(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                            {/* Color Block: Footer Text */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-stone-400 uppercase">Footer Text Color</label>
                              <div className="flex gap-2">
                                <input type="color" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                                <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none" />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* DESIGNS, FONTS & CTA SHAPE PRESETS */}
                        <div className="bg-stone-950 p-4 border border-stone-850 rounded-lg space-y-4 text-xs">
                          <span className="block text-stone-300 font-bold uppercase tracking-widest text-[10px]">Typography Families & Button geometries</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold">Web font Theme Family</label>
                              <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-stone-100"
                              >
                                <option value="Inter">Inter (Sleek Clean Sans)</option>
                                <option value="Hind Siliguri">Hind Siliguri (Premium Bangla Font)</option>
                                <option value="Space Grotesk">Space Grotesk (Aesthetic Editorial Display)</option>
                                <option value="Outfit">Outfit (Tech Luxury Sans)</option>
                                <option value="Playfair Display">Playfair Display (Timeless Serif Elegance)</option>
                                <option value="JetBrains Mono">JetBrains Mono (Technical Minimalism)</option>
                                <option value="SolaimanLipi">SolaimanLipi (Traditional Bengali)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold">CTA Button Borders radius</label>
                              <select
                                value={btnBorderRadius}
                                onChange={(e) => setBtnBorderRadius(e.target.value as any)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-stone-100"
                              >
                                <option value="none">Sharp Angle (None)</option>
                                <option value="sm">Chiseled Minimal (Sm)</option>
                                <option value="md">Elegant Curved (Md - Default)</option>
                                <option value="lg">Soft Rounded (Lg)</option>
                                <option value="full">Pill Oval (Full)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold">Button Padding Specs</label>
                              <select
                                value={btnPaddingStyle}
                                onChange={(e) => setBtnPaddingStyle(e.target.value as any)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-stone-100"
                              >
                                <option value="compact">Compact Space-saving</option>
                                <option value="normal">Standard Classical Fitting</option>
                                <option value="spacious">Spacious Grand Luxe</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1 font-semibold">Button Drop Shadows</label>
                              <select
                                value={btnShadowStyle}
                                onChange={(e) => setBtnShadowStyle(e.target.value as any)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-stone-100"
                              >
                                <option value="none">No Shadows Flat</option>
                                <option value="soft">Soft Ambient Shadow</option>
                                <option value="intense">Glamourous Glowing Shadow</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end pt-3">
                            <button
                              onClick={handleSaveWholeSettings}
                              className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-6 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              Save Typography & Shapes
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB CONTENT: BANNER REPLACEMENTS & CODES */}
                    {activeTab === 'banners' && (
                      <div className="space-y-4 text-xs bg-stone-950 p-4 border border-stone-850 rounded-lg">
                        
                        <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                          <span className="text-xs uppercase font-black text-amber-400 tracking-widest flex items-center gap-1.5">
                            <Image className="w-4 h-4 text-amber-500" />
                            Hero Slides & Promo Banners Control Panel
                          </span>
                          <button
                            type="button"
                            onClick={handleSaveWholeSettings}
                            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-4 py-1.5 rounded transition-colors cursor-pointer"
                          >
                            Sync Banners
                          </button>
                        </div>

                        <div className="space-y-3">
                          <span className="block font-bold text-[10px] text-stone-300 uppercase tracking-wider">1. Hero Splash Slide</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-400 mb-1">Headline Heading Text</label>
                              <input
                                type="text"
                                value={heroHeadline}
                                onChange={(e) => setHeroHeadline(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                placeholder="E.g. Elegant Jewellery for Every Occasion"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-400 mb-1">Subheadline Paragraph text</label>
                              <input
                                type="text"
                                value={heroSubheadline}
                                onChange={(e) => setHeroSubheadline(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                                placeholder="Explore timeless beauty crafted for unique styles"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">Hero Splash Image URL</label>
                            <input
                              type="text"
                              value={heroImage}
                              onChange={(e) => setHeroImage(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2 hover:border-amber-400 font-mono text-[11px]"
                              placeholder="Paste public image coordinates (Unsplash photo etc.)"
                            />
                            {heroImage && (
                              <div className="mt-2 text-center bg-stone-900 p-2 rounded border border-stone-850">
                                <span className="block text-neutral-500 text-[9px] uppercase mb-1">Hero background Photo Preview</span>
                                <img src={heroImage} alt="Hero Splash" className="mx-auto h-24 max-w-sm rounded object-cover referrer-no-referrer" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-stone-850 pt-4 space-y-3">
                          <span className="block font-bold text-[10px] text-stone-300 uppercase tracking-wider">2. Eid Campaign Festive Promo Countdown section Banner</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900 p-3 rounded border border-stone-850 items-center">
                            <label className="flex items-center gap-2 cursor-pointer font-bold">
                              <input
                                type="checkbox"
                                checked={eidOfferActive}
                                onChange={(e) => setEidOfferActive(e.target.checked)}
                                className="accent-amber-400 scale-110"
                              />
                              <span>Campaign Banner Section Code Active</span>
                            </label>

                            <div className="flex items-center gap-2">
                              <span className="text-stone-400 shrink-0">Discount Amount (%):</span>
                              <input
                                type="number"
                                value={eidDiscountPercent}
                                onChange={(e) => setEidDiscountPercent(Number(e.target.value))}
                                className="w-20 bg-stone-950 border border-stone-800 rounded p-1.5 text-center focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">Promotional Banner Banner Image URL</label>
                            <input
                              type="text"
                              value={eidImage}
                              onChange={(e) => setEidImage(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2 hover:border-amber-400 font-mono text-[11px]"
                              placeholder="Replace Banner image path..."
                            />
                            {eidImage && (
                              <div className="mt-2 text-center bg-stone-900 p-2 rounded border border-stone-850">
                                <span className="block text-stone-500 text-[9px] uppercase mb-1">Eid Banner Photo Preview</span>
                                <img src={eidImage} alt="Eid Banner Spec" className="mx-auto h-24 max-w-sm rounded object-cover referrer-no-referrer" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>

                        </div>

                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleSaveWholeSettings}
                            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-6 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            Write and Overwrite Banner Assets
                          </button>
                        </div>

                      </div>
                    )}

                    {/* TAB CONTENT: CONTACTS, SHIPPINGS, BRAND LOGO */}
                    {activeTab === 'brand' && (
                      <div className="space-y-4 text-xs bg-stone-950 p-4 border border-stone-850 rounded-lg">
                        
                        <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                          <span className="text-xs uppercase font-black text-amber-400 tracking-widest flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-yellow-500" />
                            Core Brand Identity, Channels & Logistics
                          </span>
                          <button
                            type="button"
                            onClick={handleSaveWholeSettings}
                            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-4 py-1.5 rounded transition-colors cursor-pointer"
                          >
                            Sync Brand Profile
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-400 mb-1 font-semibold">Store / Brand Name</label>
                            <input
                              type="text"
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                              placeholder="ARISAN BD"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-400 mb-1 font-semibold">Brand Tagline / Slogan</label>
                            <input
                              type="text"
                              value={tagline}
                              onChange={(e) => setTagline(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                              placeholder="Where Every Piece Tells a Story"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-stone-400 mb-1 font-semibold">Navbar Ticker text Announcement</label>
                          <input
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none"
                            placeholder="Announce sales, nationwide shipping policies..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-850 pt-4">
                          <div>
                            <span className="block font-bold text-[10px] text-amber-400 mb-2 uppercase tracking-wider">📬 Contact Integration channels</span>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[9px] text-stone-400">WhatsApp hotline (+ with country code)</label>
                                <input
                                  type="text"
                                  value={whatsappNumber}
                                  onChange={(e) => setWhatsappNumber(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                  placeholder="+8801313840136"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-stone-400">Contact Support email</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                  placeholder="arisanbd26@gmail.com"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-stone-400">Facebook URL link</label>
                                <input
                                  type="text"
                                  value={facebookUrl}
                                  onChange={(e) => setFacebookUrl(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-stone-400">Instagram link URL</label>
                                <input
                                  type="text"
                                  value={instagramUrl}
                                  onChange={(e) => setInstagramUrl(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="block font-bold text-[10px] text-amber-400 mb-2 uppercase tracking-wider">🚚 Logistics, shippings & taxes</span>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[9px] text-stone-400">Delivery Inside Dhaka (BDT)</label>
                                <input
                                  type="number"
                                  value={deliveryInside}
                                  onChange={(e) => setDeliveryInside(Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-stone-400">Delivery Outside Dhaka (BDT)</label>
                                <input
                                  type="number"
                                  value={deliveryOutside}
                                  onChange={(e) => setDeliveryOutside(Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-stone-400">Min spend for FREE Delivery (BDT)</label>
                                <input
                                  type="number"
                                  value={freeDeliveryMin}
                                  onChange={(e) => setFreeDeliveryMin(Number(e.target.value))}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleSaveWholeSettings}
                            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-6 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            Persist Profile & Channels
                          </button>
                        </div>

                      </div>
                    )}

                    {/* TAB CONTENT: WORDING, LABELS & DICTIONARY */}
                    {activeTab === 'wording' && (
                      <div className="space-y-4 text-xs bg-stone-950 p-4 border border-stone-850 rounded-lg">
                        
                        <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                          <span className="text-xs uppercase font-black text-amber-400 tracking-widest flex items-center gap-1.5">
                            <Type className="w-4 h-4 text-pink-500" />
                            Website labels dictionary overrides (Dynamic Text mapping)
                          </span>
                        </div>

                        <p className="text-stone-400 text-[10px] leading-relaxed">
                          Customize standard website texts and dynamic buttons instantly in both languages. Use this section to change labels like "Home", "My Cart", and checkout descriptors.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900 p-3 rounded border border-stone-850">
                          <div>
                            <label className="block text-stone-300 font-semibold mb-1">Select Website text item</label>
                            <select
                              value={targetTranslationKey}
                              onChange={(e) => setTargetTranslationKey(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-100"
                            >
                              {translationKeyList.map(item => (
                                <option key={item.key} value={item.key}>{item.label} ({item.key})</option>
                              ))}
                            </select>
                          </div>

                          <div className="text-[10px] text-stone-400 space-y-1">
                            <span className="block font-bold">Wording status:</span>
                            <div className="p-1 px-2 bg-stone-950 rounded text-stone-500 font-mono">
                              Active language locale: <span className="text-amber-400 font-bold">{language.toUpperCase()}</span>
                            </div>
                            <div className="p-1 px-2 bg-stone-950 rounded text-stone-550 italic truncate">
                              System default translation: {t(targetTranslationKey)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-[10px] text-stone-400 uppercase mb-1">Custom English Text</label>
                            <input
                              type="text"
                              value={customValEn}
                              onChange={(e) => setCustomValEn(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2.5 focus:border-amber-400 focus:outline-none"
                              placeholder="Insert custom phrase or text in English..."
                            />
                            {overrideEn[targetTranslationKey] && (
                              <span className="text-[9px] text-emerald-400 mt-1 block">✓ Active English Override</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-400 uppercase mb-1">Bengali translation overlay (বাংলা টেক্সট)</label>
                            <input
                              type="text"
                              value={customValBn}
                              onChange={(e) => setCustomValBn(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded p-2.5 focus:border-amber-400 focus:outline-none font-sans"
                              placeholder="বাংলা ভাষায় অনুবাদ এখানে দিন..."
                            />
                            {overrideBn[targetTranslationKey] && (
                              <span className="text-[9px] text-emerald-400 mt-1 block">✓ Active Bengali Override</span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-stone-850 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              const nextEn = { ...overrideEn };
                              const nextBn = { ...overrideBn };
                              delete nextEn[targetTranslationKey];
                              delete nextBn[targetTranslationKey];
                              setOverrideEn(nextEn);
                              setOverrideBn(nextBn);
                              updateSettings({
                                ...settings,
                                translationOverrides: {
                                  en: nextEn,
                                  bn: nextBn
                                }
                              });
                              triggerFeedback('Reverted back to default!');
                            }}
                            className="text-[10px] text-stone-400 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded px-3 py-1 cursor-pointer transition-colors"
                          >
                            Reset to System Default text
                          </button>

                          <button
                            type="button"
                            onClick={handleUpdateTranslationOverride}
                            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-5 py-2 rounded text-xs transition-colors cursor-pointer"
                          >
                            Apply Text Overwrite
                          </button>
                        </div>

                      </div>
                    )}

                    {/* TAB CONTENT: ORDERS COCKPIT SECTION */}
                    {activeTab === 'orders' && (
                      <AdminOrdersDashboard />
                    )}

                    {/* TAB CONTENT: SECURITY & PASSWORD CREDENTIALS SECTION */}
                    {activeTab === 'security' && (
                      <div className="space-y-4">
                        
                        <div className="bg-stone-950 p-4 border border-stone-850 rounded-lg space-y-4 text-left">
                          <div className="flex items-center justify-between border-b border-stone-850 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Lock className="w-5 h-5 text-amber-500" />
                              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
                                Change Admin Login Credentials & Password
                              </h3>
                            </div>
                          </div>

                          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                            আপনি এখান থেকে এডমিন প্যানেল এবং স্টোর ককপিট-এ ঢোকার জন্য পাসওয়ার্ড এবং এডমিন ইমেইল পরিবর্তন করতে পারবেন। পরিবর্তিন করার পর নতুন পাসওয়ার্ড দিয়ে ভবিষ্যতে লগইন করতে হবে।
                          </p>

                          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-400 space-y-1 font-sans">
                            <div className="font-bold flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                              গুরুত্বপূর্ণ নির্দেশনা:
                            </div>
                            <p>ডিফল্ট পাসওয়ার্ড হলো <span className="font-mono bg-stone-900 px-1.5 py-0.5 rounded text-white font-bold">jesan2026</span>। আপনি নতুন পাসওয়ার্ড সেভ করার পর অবশ্যই সেটি মনে রাখবেন।</p>
                          </div>

                          <div className="space-y-3 pt-1 text-xs">
                            <div>
                              <label className="block text-stone-400 font-semibold mb-1 uppercase text-[10px]">Active Admin Login Email</label>
                              <input
                                type="email"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none text-stone-200"
                                placeholder="jesanbinary07@gmail.com"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                              <div>
                                <label className="block text-stone-400 font-semibold mb-1 uppercase text-[10px]">New Admin Password *</label>
                                <input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none text-stone-100 font-mono tracking-wide"
                                  placeholder="পাসওয়ার্ড কমপক্ষে ৪ সংখ্যা দিন..."
                                />
                              </div>

                              <div>
                                <label className="block text-stone-400 font-semibold mb-1 uppercase text-[10px]">Confirm New Password *</label>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:border-amber-400 focus:outline-none text-stone-100 font-mono tracking-wide"
                                  placeholder="পাসওয়ার্ড পুনরায় টাইপ করুন..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!newAdminEmail.trim()) {
                                  alert('Admin email cannot be blank!');
                                  return;
                                }
                                if (!newPassword) {
                                  alert('Please enter a new password!');
                                  return;
                                }
                                if (newPassword.length < 4) {
                                  alert('Password must be at least 4 characters long!');
                                  return;
                                }
                                if (newPassword !== confirmPassword) {
                                  alert('Confirm password does not match new password!');
                                  return;
                                }

                                updateSettings({
                                  ...settings,
                                  adminEmail: newAdminEmail,
                                  adminPassword: newPassword
                                });
                                
                                setNewPassword('');
                                setConfirmPassword('');
                                triggerFeedback('Admin login credentials updated successfully!');
                              }}
                              className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-6 py-2 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10 uppercase tracking-wider"
                            >
                              <Save className="w-4 h-4 text-stone-950" />
                              Save & Update Credentials
                            </button>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
