import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, User, Heart, Menu, X, LogIn, ChevronDown, Compass, ShieldAlert, BookOpen, Settings } from 'lucide-react';
import { StyledText } from './StyledText';
import { BANGLADESH_DISTRICTS } from '../types';
import { EditableElement } from './EditableElement';

export const Navbar: React.FC = () => {
  const {
    cart,
    getCartItemCount,
    getCartTotal,
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    login,
    registerCustomer,
    loginWithPhone,
    products,
    setSelectedProductId,
    settings,
    language,
    setLanguage,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');

  const filteredSearchProducts = searchQuery.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setActiveTab('shop');
    }
  };

  const handleProductSearchClick = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('product-details');
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      const res = loginWithPhone(phone, password);
      if (res.success) {
        setAuthModalOpen(false);
        setPhone('');
        setPassword('');
        setAuthError('');
        // Redirect customer to home view
        setActiveTab('home');
      } else {
        setAuthError(res.message);
      }
    } else {
      // Register (Sign Up)
      const res = registerCustomer(phone, password, selectedDistrict);
      if (res.success) {
        setAuthModalOpen(false);
        setPhone('');
        setPassword('');
        setAuthError('');
        // Redirect customer to home view
        setActiveTab('home');
      } else {
        setAuthError(res.message);
      }
    }
  };

  return (
    <>
      {/* Real-time Ticker */}
      <div className="bg-emerald-950 text-amber-400 py-2 px-4 text-center text-xs tracking-wider uppercase font-medium border-b border-amber-500/20">
        <div className="container mx-auto flex justify-center items-center gap-2 overflow-hidden">
          <span className="inline-block animate-pulse">✨</span>
          <span className="text-white hover:text-amber-300 font-sans tracking-wide">
            <EditableElement id="header-ticker" defaultText={settings.announcementText} defaultTextBn="✨ ৩,০০০ টাকার বেশি অর্ডারে সারা বাংলাদেশে ফ্রী ক্যাশ অন ডেলিভারি! ✨">
              {language === 'bn' && settings.announcementText?.includes('FREE Express Home Delivery')
                ? '✨ ৩,০০০ টাকার বেশি অর্ডারে সারা বাংলাদেশে ফ্রী ক্যাশ অন ডেলিভারি! ✨'
                : <StyledText text={settings.announcementText} />}
            </EditableElement>
          </span>
          <span className="inline-block animate-pulse">✨</span>
        </div>
      </div>

      {/* Sticky Main Nav */}
      <header className="sticky top-0 z-40 bg-[var(--theme-header-bg)] text-[var(--theme-header-text)] border-b border-black/10 backdrop-blur-md shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* BRAND LOGO */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('home')}
                className="group flex flex-col items-start cursor-pointer text-left focus:outline-none shrink-0"
                id="brand-logo"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-display uppercase tracking-widest font-extrabold text-[var(--theme-header-text)] group-hover:opacity-95 transition-all whitespace-nowrap">
                  <EditableElement id="brand-logo-text" defaultText="ARISAN BD" defaultTextBn="আরিসান বিডি">
                    <span className="text-emerald-600">ARISAN</span> <span className="text-amber-400">BD</span>
                  </EditableElement>
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[var(--theme-header-text)]/90 font-semibold font-sans uppercase whitespace-nowrap">
                  <EditableElement id="brand-tagline-text" defaultText={settings.tagline} defaultTextBn="কোমল স্পর্শে প্রিমিয়াম জুয়েলারি">
                    {settings.tagline}
                  </EditableElement>
                </div>
              </button>
            </div>

            {/* DESKTOP SEARCH BAR */}
            <div className="hidden md:block relative w-full max-w-xs xl:max-w-md mx-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full bg-[var(--theme-header-text)]/15 border border-[var(--theme-header-text)]/25 text-[var(--theme-header-text)] placeholder-[var(--theme-header-text)]/70 text-sm pl-4 pr-10 py-2 rounded-md focus:outline-none focus:border-[var(--theme-header-text)] focus:bg-[var(--theme-header-text)]/25 transition-colors"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-[var(--theme-header-text)]/80 hover:text-[var(--theme-header-text)]">
                  <Search className="w-4.5 h-4.5" />
                </button>
              </form>

              {/* Live search result dropdown */}
              {showSearchDropdown && searchQuery && (
                <div 
                  className="absolute left-0 right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-2xl z-50 p-2 overflow-hidden text-stone-800"
                  onMouseLeave={() => setShowSearchDropdown(false)}
                >
                  <div className="text-stone-500 text-[11px] uppercase tracking-wider px-3 py-1.5 border-b border-stone-100">
                    Live Jewel Finder ({filteredSearchProducts.length} matches)
                  </div>
                  {filteredSearchProducts.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {filteredSearchProducts.map((p) => (
                        <button
                           key={p.id}
                           onClick={() => handleProductSearchClick(p.id)}
                           className="w-full text-left flex items-center gap-3 p-2 hover:bg-stone-50 transition-colors rounded-md"
                        >
                          <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded bg-stone-100 border border-stone-200 referrer-no-referrer" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-stone-850 truncate">{p.title}</span>
                            <span className="text-xs text-yellow-600 font-mono font-semibold">
                              ৳{p.discountPrice || p.price}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stone-400 text-xs p-3 text-center">
                      No jewellery matches "{searchQuery}"
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setActiveTab('shop');
                    }}
                    className="w-full mt-2 text-center text-xs py-1.5 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition-colors"
                  >
                    View All Collections
                  </button>
                </div>
              )}
            </div>

            {/* ICONS CONTAINER */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              {/* LANGUAGE SWITCHER */}
              <div className="flex items-center border border-[var(--theme-header-text)]/25 bg-black/10 rounded overflow-hidden p-0.5 shrink-0" id="language-switcher">
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded transition-all cursor-pointer ${
                    language === 'bn'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-[var(--theme-header-text)]/75 hover:text-[var(--theme-header-text)]'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-bold rounded transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-[var(--theme-header-text)]/75 hover:text-[var(--theme-header-text)]'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Profile triggers */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="hidden lg:inline text-xs text-[var(--theme-header-text)]/80 font-medium">
                    {language === 'bn' ? 'স্বাগতম, ' : 'Hi, '} {currentUser.name}
                  </span>
                  <button
                    onClick={() => {
                      if (currentUser.role === 'admin') {
                        setActiveTab('admin-dashboard');
                      } else {
                        setActiveTab('customer-profile');
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-amber-400 text-stone-950 font-bold rounded hover:bg-amber-300 transition-all cursor-pointer shadow-sm"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>
                      {currentUser.role === 'admin' 
                        ? (language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel') 
                        : (language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile')}
                    </span>
                  </button>
                  <button
                    onClick={logout}
                    className="text-[var(--theme-header-text)]/85 text-xs px-2.5 py-1 border border-[var(--theme-header-text)]/20 hover:border-[var(--theme-header-text)]/50 rounded hover:text-[var(--theme-header-text)] hover:bg-[var(--theme-header-text)]/5 transition-all cursor-pointer"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-[var(--theme-header-text)]/90 hover:text-[var(--theme-header-text)] text-sm font-medium cursor-pointer"
                >
                  <User className="w-4.5 h-4.5 text-[var(--theme-header-text)]" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'লগইন' : t('nav.login')}</span>
                </button>
              )}

              {/* Order Tracking Action */}
              <button
                onClick={() => setActiveTab('orders-tracking')}
                className="hidden sm:flex items-center gap-1 text-xs text-[var(--theme-header-text)]/90 hover:text-[var(--theme-header-text)] transition-colors cursor-pointer"
                title="Track your order"
              >
                <Compass className="w-4 h-4" />
                <span>{t('nav.trackOrder')}</span>
              </button>

              {/* Shopping Bag Dynamic Button */}
              <button
                onClick={() => setActiveTab('cart')}
                className="relative p-2 hover:bg-[var(--theme-header-text)]/10 rounded-full transition-colors cursor-pointer group"
                id="cart-indicator-btn"
              >
                <ShoppingBag className="w-5.5 h-5.5 text-[var(--theme-header-text)] group-hover:text-[var(--theme-header-text)] transition-colors" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 font-black font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* SECONDARY ROW: Persistent horizontal scrollbar navigation on all devices */}
        <div className="border-t border-white/10 bg-[var(--theme-secondary-bg)] transition-colors duration-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-start md:justify-center gap-5 sm:gap-7 py-3 overflow-x-auto scrollbar-none text-[var(--theme-secondary-text)]/90 font-medium text-xs sm:text-xs md:text-sm whitespace-nowrap">
              <button 
                onClick={() => setActiveTab('home')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'home' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => setActiveTab('shop')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'shop' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.shop')}
              </button>
              <button 
                onClick={() => setActiveTab('about-us')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'about-us' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.aboutUs')}
              </button>
              <button 
                onClick={() => setActiveTab('about-owner')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'about-owner' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.aboutOwner')}
              </button>
              <button 
                onClick={() => setActiveTab('contact')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'contact' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.contactUs')}
              </button>
              <button 
                onClick={() => setActiveTab('support')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'support' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.faq')}
              </button>
              <button 
                onClick={() => setActiveTab('orders-tracking')} 
                className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'orders-tracking' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
              >
                {t('nav.trackStatus')}
              </button>
              {currentUser && currentUser.role === 'customer' && (
                <button 
                  onClick={() => setActiveTab('customer-profile')} 
                  className={`hover:text-[var(--theme-secondary-text)] transition-colors cursor-pointer pb-0.5 ${activeTab === 'customer-profile' ? 'text-[var(--theme-secondary-text)] border-b-2 border-[var(--theme-secondary-text)] font-semibold' : ''}`}
                >
                  {language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* LOGIN / SIGNUP MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-950 border border-stone-800 rounded-lg max-w-md w-full p-6 text-stone-200 shadow-2xl relative overflow-hidden">
            {/* Modal Ambient Lights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>

            <button 
              onClick={() => { setAuthModalOpen(false); setAuthError(''); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-wider">
                ARISAN BD
              </span>
              <h3 className="text-lg font-medium text-stone-100 mt-2">
                {authMode === 'login' 
                  ? (language === 'bn' ? 'কাস্টমার আইডি লগইন' : 'Customer Account Login')
                  : (language === 'bn' ? 'নতুন কাস্টমার সাইনআপ' : 'New Customer Register')
                }
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {language === 'bn'
                  ? 'প্রিমিয়াম অর্ডারিং, ডিসকাউন্ট কুপন এবং লাইভ অর্ডার ট্র্যাকিং সুবিধা পান।'
                  : 'Access premium features, luxury discounts, and live tracking.'
                }
              </p>
            </div>

            {authError && (
              <div className="mb-4 bg-red-950/40 text-red-400 text-xs p-3 rounded border border-red-900/50">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Phone number field (Required for both Login & Register) */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-150 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Password field (Required for both Login & Register) */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-150 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* District Select field (Required ONLY for Signup/Register) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                    {language === 'bn' ? 'জেলা সিলেক্ট (District)' : 'Select District'} <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold py-2.5 rounded hover:opacity-95 transition-opacity text-sm cursor-pointer mt-2"
              >
                {authMode === 'login' 
                  ? (language === 'bn' ? 'লগইন করুন' : 'Login Now')
                  : (language === 'bn' ? 'সাইনআপ সম্পন্ন করুন' : 'Complete Signup')
                }
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-stone-900 text-center space-y-3">
              <div className="text-xs text-stone-400">
                {authMode === 'login' ? (
                  <>
                    {language === 'bn' ? 'নতুন কাস্টমার?' : "No account yet?"}{' '}
                    <button 
                      onClick={() => { setAuthMode('register'); setAuthError(''); }} 
                      className="text-amber-400 hover:underline inline-block focus:outline-none"
                    >
                      {language === 'bn' ? 'সাইনআপ করুন' : 'Sign up now'}
                    </button>
                  </>
                ) : (
                  <>
                    {language === 'bn' ? 'লগইন করতে চান?' : 'Already have an account?'}{' '}
                    <button 
                      onClick={() => { setAuthMode('login'); setAuthError(''); }} 
                      className="text-amber-400 hover:underline inline-block focus:outline-none"
                    >
                      {language === 'bn' ? 'লগইন করুন' : 'Login here'}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
