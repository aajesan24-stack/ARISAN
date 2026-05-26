import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageSquare, ChevronRight, HelpCircle, FileText, ArrowUp, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, settings } = useApp();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-stone-300 pt-16 pb-8 border-t border-stone-900 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={handleScrollTop}
          className="p-3 bg-stone-950 border border-stone-800 rounded-full text-amber-400 hover:text-stone-950 hover:bg-amber-400 transition-all cursor-pointer shadow-xl duration-300"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* BRAND STATEMENT */}
        <div>
          <span className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-wider">
            ARISAN BD
          </span>
          <p className="text-[10px] tracking-[0.25em] text-amber-300/80 uppercase mt-0.5">
            {settings.tagline}
          </p>
          <p className="text-sm text-stone-400 mt-4 leading-relaxed font-sans">
            ARISAN BD is a modern fashion jewellery brand focused on premium style, elegance and trusted online shopping experience in Bangladesh. Simple looks, styled for royalty.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-stone-900 hover:bg-amber-400 hover:text-stone-950 rounded-full transition-all duration-300 text-stone-400"
              title="Follow us on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-stone-900 hover:bg-amber-400 hover:text-stone-950 rounded-full transition-all duration-300 text-stone-400"
              title="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-stone-900 hover:bg-amber-400 hover:text-stone-950 rounded-full transition-all duration-300 text-stone-400"
              title="Follow us on TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.85.91 1.94 1.57 3.14 1.9v3.7c-1.15-.15-2.28-.59-3.26-1.22-.38-.24-.73-.53-1.04-.85V13.8c.04 1.95-.53 3.91-1.63 5.49a8.1 8.1 0 0 1-5.38 3.5c-2.3.43-4.75-.12-6.66-1.5a8.216 8.216 0 0 1-3.23-5.33c-.45-2.31.09-4.78 1.48-6.7a8.16 8.16 0 0 1 5.37-3.48c.32-.04.64-.06.96-.06h.4v3.7c-.12 0-.24.01-.36.03a4.52 4.52 0 0 0-3.32 2.2c-.85 1.15-1.09 2.68-.64 4.05a4.512 4.512 0 0 0 2.89 3.01c1.3.42 2.77.17 3.86-.68.91-.71 1.45-1.8 1.43-2.97V.02z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-stone-900 hover:bg-emerald-500 hover:text-stone-950 rounded-full transition-all duration-300 text-stone-400"
              title="Chat over WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* QUICK NAVIGATION LINKS */}
        <div>
          <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-widest border-l-2 border-amber-400 pl-3 mb-6">
            Quick Navigation
          </h4>
          <ul className="space-y-3.5 text-sm font-sans">
            <li>
              <button 
                onClick={() => setActiveTab('home')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Home Showroom
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('shop')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Shop Royal Curation
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('about-us')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Our Story & Heritage
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('about-owner')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                About The Owner
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('orders-tracking')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Track Order Status
              </button>
            </li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-widest border-l-2 border-amber-400 pl-3 mb-6">
            Customer Care
          </h4>
          <ul className="space-y-3.5 text-sm font-sans">
            <li>
              <button 
                onClick={() => setActiveTab('support')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Support Hub & Returns
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('faq')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Frequently Asked FAQs
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('privacy')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Privacy Safeguards
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('terms')} 
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500/50 group-hover:text-amber-400" />
                Terms of Curation
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('admin-dashboard')} 
                className="hover:text-amber-400/90 text-stone-600 transition-colors flex items-center gap-1.5 group cursor-pointer mt-5 pt-3 border-t border-stone-900/50 w-full"
                title="Only Authorized Store Admins"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-stone-800 group-hover:text-amber-500/80" />
                <span className="text-[11px] font-sans tracking-wide">Admin Control Panel</span>
              </button>
            </li>
          </ul>
        </div>

        {/* DIRECT SUPPORT CHANNELS */}
        <div>
          <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-widest border-l-2 border-amber-400 pl-3 mb-6">
            Support Channels
          </h4>
          <ul className="space-y-4 text-xs md:text-sm font-sans">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-stone-400 font-medium">WhatsApp Call / Text:</span>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-stone-100 hover:text-amber-400 transition-colors"
                >
                  {settings.whatsappNumber}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-stone-400 font-medium">Premium Client Mail:</span>
                <a href={`mailto:${settings.email}`} className="text-stone-100 hover:text-amber-400 transition-colors font-mono">
                  {settings.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-stone-400 font-medium">Headquarters:</span>
                <span className="text-stone-200">
                  Dhaka, Bangladesh
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* METADATA CORNER & OWNER */}
      <div className="border-t border-stone-900 pt-8 mt-12 bg-black/50">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <span>
              &copy; 2026 <strong className="text-amber-400">ARISAN BD</strong>. All Rights Reserved.
            </span>
            <span className="hidden md:inline text-stone-800">|</span>
            <span>
              Founder: <strong className="text-stone-100 font-medium">Md Tarikul Alam Jesan</strong>, Bangladesh.
            </span>
          </div>

          {/* Secure badging icons */}
          <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-wider text-stone-400 bg-stone-950 px-3.5 py-1.5 rounded-full border border-stone-900/40">
            <span className="text-emerald-500 font-bold">&#9679;</span> SECURE CHECKOUT (BDT)
            <span className="text-amber-400 font-bold">&#9679;</span> CASH ON DELIVERY
          </div>

        </div>
      </div>
    </footer>
  );
};
