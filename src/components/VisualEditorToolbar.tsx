import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sparkles, Check, Info, Monitor, Edit3, Eye, ShieldAlert } from 'lucide-react';

export const VisualEditorToolbar: React.FC = () => {
  const {
    currentUser,
    isVisualEditMode,
    setVisualEditMode,
    language,
    setLanguage,
    settings
  } = useApp();

  // Toolbar is strictly restricted for admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[95%] bg-stone-900/90 backdrop-blur-md border border-amber-500/35 rounded-full font-sans py-3 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4 text-stone-100">
      
      {/* Brand & Badge Info */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-amber-500/15 text-amber-400 rounded-full animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              ARISAN CUSTOMIZER
            </span>
            <span className="bg-emerald-950 text-emerald-400 text-[8px] font-black uppercase px-1 rounded-sm border border-emerald-500/25">
              Admin Suite Active
            </span>
          </div>
          <p className="text-[9px] text-stone-400">Owner-operator cockpit for Tarikul Alam Jesan</p>
        </div>
      </div>

      {/* Editor Toggler */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
          Visual Edit Mode:
        </span>
        
        <button
          onClick={() => setVisualEditMode(!isVisualEditMode)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isVisualEditMode ? 'bg-amber-400' : 'bg-stone-700'
          }`}
          role="switch"
          aria-checked={isVisualEditMode}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow ring-0 transition duration-200 ease-in-out ${
              isVisualEditMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        <span className={`text-[11px] font-black uppercase ${isVisualEditMode ? 'text-amber-400' : 'text-stone-500'}`}>
          {isVisualEditMode ? 'ON' : 'OFF'}
        </span>
      </div>

      {/* Language Quick links */}
      <div className="flex items-center gap-2 border-l border-stone-850 pl-3">
        <span className="text-[9px] uppercase font-bold text-stone-400">Locale Target</span>
        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-800 border border-stone-700 hover:border-amber-400 text-amber-300 transition-colors cursor-pointer"
        >
          {language === 'bn' ? 'EN (English)' : 'বাংলা (BN)'}
        </button>
      </div>

      {/* Dynamic Status message info */}
      <div className="w-full sm:w-auto text-[9px] text-stone-300 flex items-center gap-1 bg-stone-950/70 p-1.5 px-3 rounded-full border border-stone-850 shrink-0">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {isVisualEditMode 
            ? '💡 Click any outlined segment on the website to edit instantly!'
            : '💡 Turn on "ON" then click elements directly to customize headers, texts, banners, footer...'
          }
        </span>
      </div>

    </div>
  );
};
