import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiveChat } from './components/LiveChat';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailsView } from './views/ProductDetailsView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { AdminDashboardView } from './views/AdminDashboardView';
import {
  AboutUsView,
  AboutOwnerView,
  ContactUsView,
  SupportCenterView,
  PrivacyPolicyView,
  TermsAndConditionsView,
  FAQPageView,
  OrdersTrackingView
} from './views/StaticViews';

function AppContent() {
  const { activeTab, settings } = useApp();

  React.useEffect(() => {
    const root = document.documentElement;
    
    // Core Layout Colors
    root.style.setProperty('--theme-header-bg', settings?.headerBgColor || '#ffffff');
    root.style.setProperty('--theme-header-text', settings?.headerTextColor || '#202226');
    root.style.setProperty('--theme-secondary-bg', settings?.secondaryNavBgColor || '#202226');
    root.style.setProperty('--theme-secondary-text', settings?.secondaryNavTextColor || '#ffffff');
    root.style.setProperty('--theme-button-bg', settings?.buttonBgColor || '#e23e38');
    root.style.setProperty('--theme-button-text', settings?.buttonTextColor || '#ffffff');
    
    root.style.setProperty('--theme-body-bg', settings?.bodyBgColor || '#f6f7f9');
    root.style.setProperty('--theme-body-text', settings?.bodyTextColor || '#202226');
    root.style.setProperty('--theme-hero-bg', settings?.heroBgColor || '#f6f7f9');
    root.style.setProperty('--theme-hero-text', settings?.heroTextColor || '#202226');
    root.style.setProperty('--theme-categories-bg', settings?.categoriesBgColor || '#ffffff');
    root.style.setProperty('--theme-categories-text', settings?.categoriesTextColor || '#202226');
    root.style.setProperty('--theme-bestsellers-bg', settings?.bestsellersBgColor || '#ffffff');
    root.style.setProperty('--theme-bestsellers-text', settings?.bestsellersTextColor || '#202226');
    root.style.setProperty('--theme-newarrivals-bg', settings?.newArrivalsBgColor || '#f6f7f9');
    root.style.setProperty('--theme-newarrivals-text', settings?.newArrivalsTextColor || '#202226');
    root.style.setProperty('--theme-eid-bg', settings?.eidSectionBgColor || '#064e3b');
    root.style.setProperty('--theme-eid-text', settings?.eidSectionTextColor || '#ffffff');
    root.style.setProperty('--theme-footer-bg', settings?.footerBgColor || '#1c1e21');
    root.style.setProperty('--theme-footer-text', settings?.footerTextColor || '#ebeef2');
    root.style.setProperty('--theme-newsletter-bg', settings?.newsletterBgColor || '#064e3b');
    root.style.setProperty('--theme-newsletter-text', settings?.newsletterTextColor || '#ffffff');

    // Dynamically Inject styling tags inside head
    const styleBlockId = 'dyn-theme-styles';
    let styleTag = document.getElementById(styleBlockId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleBlockId;
      document.head.appendChild(styleTag);
    }

    // Google font linking loader
    if (settings?.fontFamily && settings.fontFamily !== 'Inter' && settings.fontFamily !== 'sans-serif') {
      const fontLinkId = 'google-font-family-link';
      let fontLink = document.getElementById(fontLinkId) as HTMLLinkElement;
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = fontLinkId;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      const apiFontName = settings.fontFamily.replace(/\s+/g, '+');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${apiFontName}:wght@300;400;500;600;700;800&display=swap`;
    }

    let customFontRule = '';
    if (settings?.fontFamily) {
      customFontRule = `
        body, button, input, select, textarea, .font-sans, .font-display {
          font-family: "${settings.fontFamily}", "Hind Siliguri", "Inter", sans-serif !important;
        }
      `;
    }

    let scalingRule = '';
    if (settings?.fontSizeScale === 'compact') {
      scalingRule = `html { font-size: 14px !important; }`;
    } else if (settings?.fontSizeScale === 'spacious') {
      scalingRule = `html { font-size: 18px !important; }`;
    } else {
      scalingRule = `html { font-size: 16px !important; }`;
    }

    let mobileScalingRule = '';
    if (settings?.mobileFontSizeScale) {
      const scaleVal = settings.mobileFontSizeScale === 'compact' ? '12.5px' : settings.mobileFontSizeScale === 'spacious' ? '17px' : '14.5px';
      mobileScalingRule = `
        @media (max-width: 640px) {
          html { font-size: ${scaleVal} !important; }
        }
      `;
    }

    // Border Radius Values
    let bRad = '0.375rem'; // md default
    if (settings?.btnBorderRadius === 'none') bRad = '0px';
    if (settings?.btnBorderRadius === 'sm') bRad = '0.125rem';
    if (settings?.btnBorderRadius === 'lg') bRad = '0.75rem';
    if (settings?.btnBorderRadius === 'full') bRad = '9999px';

    // Padding X & Y values
    let padX = '1.25rem';
    let padY = '0.5rem';
    if (settings?.btnPaddingStyle === 'compact') {
      padX = '0.75rem';
      padY = '0.25rem';
    } else if (settings?.btnPaddingStyle === 'spacious') {
      padX = '2rem';
      padY = '0.85rem';
    }

    // Shadow Style rules
    let btnShad = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    if (settings?.btnShadowStyle === 'none') btnShad = 'none';
    if (settings?.btnShadowStyle === 'intense') btnShad = `0 4px 10px rgba(0,0,0,0.1), 0 0 10px rgba(226,62,56,0.2)`;

    // Synthesize button class overrides
    const ctaStyles = `
      .btn-luxury-cta {
        border-radius: ${bRad} !important;
        padding-left: ${padX} !important;
        padding-right: ${padX} !important;
        padding-top: ${padY} !important;
        padding-bottom: ${padY} !important;
        box-shadow: ${btnShad} !important;
        font-weight: 700 !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      .btn-luxury-cta:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
      }
      .btn-luxury-cta:active {
        transform: scale(0.99);
      }
    `;

    styleTag.innerHTML = `
      body {
        background-color: var(--theme-body-bg) !important;
        color: var(--theme-body-text) !important;
      }
      ${customFontRule}
      ${scalingRule}
      ${mobileScalingRule}
      ${ctaStyles}
      ${settings?.customCSS || ''}
    `;
  }, [settings]);

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'about-us':
        return <AboutUsView />;
      case 'about-owner':
        return <AboutOwnerView />;
      case 'contact':
        return <ContactUsView />;
      case 'support':
        return <SupportCenterView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsAndConditionsView />;
      case 'faq':
        return <FAQPageView />;
      case 'orders-tracking':
        return <OrdersTrackingView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-white font-sans antialiased">
      
      {/* 1. STICKY TOP AND BRAND TICKERS */}
      <Navbar />

      {/* 2. DYNAMIC TRANSLATING MAIN VIEWPORT */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* 3. SIMULATED FLOATING WHATSAPP CHAT ADVISORS */}
      <LiveChat />

      {/* 4. LUXURY EMBRACING BRAND FOOTER */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
