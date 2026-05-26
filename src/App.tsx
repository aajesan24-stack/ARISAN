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
    root.style.setProperty('--theme-header-bg', settings?.headerBgColor || '#ffffff');
    root.style.setProperty('--theme-header-text', settings?.headerTextColor || '#202226');
    root.style.setProperty('--theme-secondary-bg', settings?.secondaryNavBgColor || '#202226');
    root.style.setProperty('--theme-secondary-text', settings?.secondaryNavTextColor || '#ffffff');
    root.style.setProperty('--theme-button-bg', settings?.buttonBgColor || '#e23e38');
    root.style.setProperty('--theme-button-text', settings?.buttonTextColor || '#ffffff');
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
