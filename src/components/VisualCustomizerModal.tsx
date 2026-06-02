import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save, RotateCcw, Monitor, Tablet, Smartphone, Sparkles, Sliders, Type, Palette, Move, Eye, Flame, Trash } from 'lucide-react';
import * as Icons from 'lucide-react';

export const VisualCustomizerModal: React.FC = () => {
  const {
    settings,
    selectedEditableId,
    setSelectedEditableId,
    updateElementCustomization,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'typography' | 'colors' | 'spacing' | 'advanced' | 'media'>('typography');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // If no element is selected for editing, don't show the modal
  if (!selectedEditableId) return null;

  // Retrieve current configurations
  const elementSettingsByGlobal = settings.editableElements?.[selectedEditableId] || {};

  // Local state initialized from the parent or fallback to defaults
  const [text, setText] = useState(elementSettingsByGlobal.text || '');
  const [textBn, setTextBn] = useState(elementSettingsByGlobal.textBn || '');
  const [fontFamily, setFontFamily] = useState(elementSettingsByGlobal.fontFamily || 'Inter');
  const [fontSize, setFontSize] = useState(elementSettingsByGlobal.fontSize || '');
  const [fontWeight, setFontWeight] = useState(elementSettingsByGlobal.fontWeight || 'normal');
  const [textColor, setTextColor] = useState(elementSettingsByGlobal.textColor || '');
  const [bgColor, setBgColor] = useState(elementSettingsByGlobal.bgColor || '');
  const [borderColor, setBorderColor] = useState(elementSettingsByGlobal.borderColor || '');
  const [borderWidth, setBorderWidth] = useState(elementSettingsByGlobal.borderWidth || '');
  const [borderStyle, setBorderStyle] = useState(elementSettingsByGlobal.borderStyle || 'solid');
  const [borderRadius, setBorderRadius] = useState(elementSettingsByGlobal.borderRadius || '');
  const [width, setWidth] = useState(elementSettingsByGlobal.width || '');
  const [height, setHeight] = useState(elementSettingsByGlobal.height || '');
  const [margin, setMargin] = useState(elementSettingsByGlobal.margin || '');
  const [padding, setPadding] = useState(elementSettingsByGlobal.padding || '');
  const [top, setTop] = useState(elementSettingsByGlobal.top || '');
  const [bottom, setBottom] = useState(elementSettingsByGlobal.bottom || '');
  const [left, setLeft] = useState(elementSettingsByGlobal.left || '');
  const [right, setRight] = useState(elementSettingsByGlobal.right || '');
  const [position, setPosition] = useState(elementSettingsByGlobal.position || 'static');
  const [alignment, setAlignment] = useState(elementSettingsByGlobal.alignment || 'left');
  const [opacity, setOpacity] = useState<number>(elementSettingsByGlobal.opacity !== undefined ? elementSettingsByGlobal.opacity : 1);
  const [boxShadow, setBoxShadow] = useState(elementSettingsByGlobal.boxShadow || '');
  const [hoverTextColor, setHoverTextColor] = useState(elementSettingsByGlobal.hoverStyles?.textColor || '');
  const [hoverBgColor, setHoverBgColor] = useState(elementSettingsByGlobal.hoverStyles?.bgColor || '');
  const [hoverScale, setHoverScale] = useState(elementSettingsByGlobal.hoverStyles?.scale || '1');
  const [animation, setAnimation] = useState(elementSettingsByGlobal.animation || 'none');
  const [icon, setIcon] = useState(elementSettingsByGlobal.icon || 'none');
  const [imageUrl, setImageUrl] = useState(elementSettingsByGlobal.imageUrl || '');
  const [visible, setVisible] = useState<boolean>(elementSettingsByGlobal.visible !== false);
  const [mobileShow, setMobileShow] = useState<boolean>(elementSettingsByGlobal.responsive?.mobileShow !== false);
  const [tabletShow, setTabletShow] = useState<boolean>(elementSettingsByGlobal.responsive?.tabletShow !== false);
  const [desktopShow, setDesktopShow] = useState<boolean>(elementSettingsByGlobal.responsive?.desktopShow !== false);

  // Sync state when selected element changes
  useEffect(() => {
    const el = settings.editableElements?.[selectedEditableId] || {};
    setText(el.text || '');
    setTextBn(el.textBn || '');
    setFontFamily(el.fontFamily || 'Inter');
    setFontSize(el.fontSize || '');
    setFontWeight(el.fontWeight || 'normal');
    setTextColor(el.textColor || '');
    setBgColor(el.bgColor || '');
    setBorderColor(el.borderColor || '');
    setBorderWidth(el.borderWidth || '');
    setBorderStyle(el.borderStyle || 'solid');
    setBorderRadius(el.borderRadius || '');
    setWidth(el.width || '');
    setHeight(el.height || '');
    setMargin(el.margin || '');
    setPadding(el.padding || '');
    setTop(el.top || '');
    setBottom(el.bottom || '');
    setLeft(el.left || '');
    setRight(el.right || '');
    setPosition(el.position || 'static');
    setAlignment(el.alignment || 'left');
    setOpacity(el.opacity !== undefined ? el.opacity : 1);
    setBoxShadow(el.boxShadow || '');
    setHoverTextColor(el.hoverStyles?.textColor || '');
    setHoverBgColor(el.hoverStyles?.bgColor || '');
    setHoverScale(el.hoverStyles?.scale || '1');
    setAnimation(el.animation || 'none');
    setIcon(el.icon || 'none');
    setImageUrl(el.imageUrl || '');
    setVisible(el.visible !== false);
    setMobileShow(el.responsive?.mobileShow !== false);
    setTabletShow(el.responsive?.tabletShow !== false);
    setDesktopShow(el.responsive?.desktopShow !== false);
  }, [selectedEditableId, settings]);

  // Handle live updates
  const applyLiveUpdates = (updatedFields: any) => {
    updateElementCustomization(selectedEditableId, updatedFields);
  };

  const handleSave = () => {
    const payload = {
      text,
      textBn,
      fontFamily,
      fontSize,
      fontWeight,
      textColor,
      bgColor,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      width,
      height,
      margin,
      padding,
      top,
      bottom,
      left,
      right,
      position,
      alignment,
      opacity,
      boxShadow,
      animation,
      icon,
      imageUrl,
      visible,
      hoverStyles: {
        textColor: hoverTextColor,
        bgColor: hoverBgColor,
        scale: hoverScale
      },
      responsive: {
        mobileShow,
        tabletShow,
        desktopShow
      }
    };
    updateElementCustomization(selectedEditableId, payload);
    setSelectedEditableId(null);
  };

  const handleReset = () => {
    // Revert to blanks (removes customization and falls back to children/code defaults)
    const emptyPayload = {
      text: '',
      textBn: '',
      fontFamily: '',
      fontSize: '',
      fontWeight: 'normal',
      textColor: '',
      bgColor: '',
      borderColor: '',
      borderWidth: '',
      borderStyle: 'solid',
      borderRadius: '',
      width: '',
      height: '',
      margin: '',
      padding: '',
      top: '',
      bottom: '',
      left: '',
      right: '',
      position: 'static',
      alignment: 'left',
      opacity: 1,
      boxShadow: '',
      animation: 'none',
      icon: 'none',
      imageUrl: '',
      visible: true,
      hoverStyles: {
        textColor: '',
        bgColor: '',
        scale: '1'
      },
      responsive: {
        mobileShow: true,
        tabletShow: true,
        desktopShow: true
      }
    };
    updateElementCustomization(selectedEditableId, emptyPayload);
    setSelectedEditableId(null);
  };

  // Font family options
  const fontFamilies = [
    'Inter',
    'Space Grotesk',
    'Outfit',
    'Playfair Display',
    'JetBrains Mono',
    'Hind Siliguri',
    'SolaimanLipi',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Courier New'
  ];

  // Font weights
  const fontWeights = ['300', '400', '500', '600', '700', '800', 'bold', 'normal', 'semibold'];

  // Brand color presets
  const colorPresets = [
    { name: 'Emerald Gold', hex: '#0B6B3A' },
    { name: 'Royalty Yellow', hex: '#fbbf24' },
    { name: 'Charcoal Night', hex: '#111827' },
    { name: 'Luxury Rose', hex: '#f43f5e' },
    { name: 'Slate Light', hex: '#94a3b8' },
    { name: 'Silver White', hex: '#ffffff' },
    { name: 'Diamond Trans', hex: 'transparent' },
    { name: 'Stone Grey', hex: '#292524' }
  ];

  // Popular Lucide icons for jewels
  const iconList = [
    'none',
    'Sparkles',
    'Star',
    'Heart',
    'Award',
    'ShieldCheck',
    'Truck',
    'RotateCcw',
    'Mail',
    'Phone',
    'ShoppingBag',
    'Search',
    'ArrowRight',
    'Check',
    'Compass',
    'Gift',
    'Crown',
    'Gem',
    'Flame',
    'Globe'
  ];

  // Stock Jewelry high-quality placeholder selections
  const stockImages = [
    { title: 'Royal Jhumka (Pearl Cascades)', url: '/src/assets/images/royal_pearl_earrings_1779973980356.png' },
    { title: 'Emerald Royale Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200' },
    { title: 'Empress Choker Set', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200' },
    { title: 'Aurum Minimal Bangle', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200' },
    { title: 'Sovereign Radiant Pendant', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200' },
    { title: 'Fern Golden Cuff', url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full bg-stone-950 border border-stone-800 rounded-xl font-sans shadow-2xl flex flex-col text-stone-200 overflow-hidden animate-slideUp">
      
      {/* Dynamic Header */}
      <div className="bg-stone-900 px-4 py-3.5 border-b border-stone-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-500">Live Visual Customizer</h3>
            <p className="text-[10px] text-stone-400">Editing element: <span className="font-mono text-white">#{selectedEditableId}</span></p>
          </div>
        </div>
        
        {/* Device preview toggles */}
        <div className="flex items-center bg-stone-950 border border-stone-800 rounded p-0.5 gap-1 mx-2">
          <button 
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            title="Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1 rounded ${previewDevice === 'tablet' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            title="Tablet Mode"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            title="Mobile Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <button 
          onClick={() => setSelectedEditableId(null)}
          className="text-stone-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-stone-900/50 flex border-b border-stone-800 text-xs">
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-2 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'typography' ? 'bg-stone-950 text-amber-400 border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Fonts</span>
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'colors' ? 'bg-stone-950 text-amber-400 border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors</span>
        </button>
        <button
          onClick={() => setActiveTab('spacing')}
          className={`flex-1 py-2 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'spacing' ? 'bg-stone-950 text-amber-400 border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>Layout</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-2 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'media' ? 'bg-stone-950 text-amber-400 border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Media</span>
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-2 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'advanced' ? 'bg-stone-950 text-amber-400 border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Effects</span>
        </button>
      </div>

      {/* Pane Content */}
      <div className="p-4 overflow-y-auto max-h-[380px] bg-stone-950 space-y-4">
        
        {/* TAB 1: TYPOGRAPHY */}
        {activeTab === 'typography' && (
          <div className="space-y-4 text-xs">
            {/* ENGLISH TEXT */}
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">English Content</label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  applyLiveUpdates({ text: e.target.value });
                }}
                placeholder="Insert custom English text or heading content here..."
                rows={2}
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400 text-stone-100"
              />
            </div>

            {/* BENGALI TEXT */}
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Bengali Translation Content</label>
              <textarea
                value={textBn}
                onChange={(e) => {
                  setTextBn(e.target.value);
                  applyLiveUpdates({ textBn: e.target.value });
                }}
                placeholder="বাংলা অনুবাদ এখানে দিন..."
                rows={2}
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400 text-stone-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Font Family Selector */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    applyLiveUpdates({ fontFamily: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              {/* Font Weight Selector */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Font Weight</label>
                <select
                  value={fontWeight}
                  onChange={(e) => {
                    setFontWeight(e.target.value);
                    applyLiveUpdates({ fontWeight: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {fontWeights.map((wt) => (
                    <option key={wt} value={wt}>{wt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Font Size input */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Font Size (px, rem, em)</label>
                <input
                  type="text"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    applyLiveUpdates({ fontSize: e.target.value });
                  }}
                  placeholder="e.g. 24px, 1.25rem, 5vw"
                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Alignment Selector */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Text Alignment</label>
                <div className="flex bg-stone-900 border border-stone-800 rounded p-0.5 gap-1">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <button
                      key={align}
                      onClick={() => {
                        setAlignment(align);
                        applyLiveUpdates({ alignment: align });
                      }}
                      className={`flex-1 py-1 text-center font-bold rounded capitalize ${
                        alignment === align ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {align.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-4 text-xs">
            {/* Color pickers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Text Color Input */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Text Color (Hex Code)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor.startsWith('#') && textColor.length <= 7 ? textColor : '#ffffff'}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      applyLiveUpdates({ textColor: e.target.value });
                    }}
                    className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      applyLiveUpdates({ textColor: e.target.value });
                    }}
                    placeholder="e.g. #fbbf24"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-2 text-stone-150 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Background Color Input */}
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Background (Hex Code)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor.startsWith('#') && bgColor.length <= 7 ? bgColor : '#000000'}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      applyLiveUpdates({ bgColor: e.target.value });
                    }}
                    className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      applyLiveUpdates({ bgColor: e.target.value });
                    }}
                    placeholder="e.g. #0B6B3A"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-2 text-stone-150 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Quick Color Presets selection pallet */}
            <div>
              <label className="block text-stone-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">Luxury Brand Theme Colors</label>
              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      // Apply depending on last used or split both
                      setTextColor(preset.hex === '#ffffff' ? '#111827' : '#ffffff');
                      setBgColor(preset.hex);
                      applyLiveUpdates({ bgColor: preset.hex, textColor: preset.hex === '#ffffff' ? '#111827' : '#ffffff' });
                    }}
                    className="p-1 px-1.5 rounded bg-stone-900 border border-stone-850 text-left hover:border-amber-400 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded shrink-0 border border-neutral-700" style={{ backgroundColor: preset.hex }}></span>
                    <span className="text-[9px] truncate text-stone-300 font-mono">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Borders settings */}
            <div className="border-t border-stone-900 pt-3 space-y-3">
              <span className="block text-stone-300 font-bold uppercase tracking-widest text-[9px]">Borders & Radii Specs</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Width</label>
                  <input
                    type="text"
                    value={borderWidth}
                    onChange={(e) => {
                      setBorderWidth(e.target.value);
                      applyLiveUpdates({ borderWidth: e.target.value });
                    }}
                    placeholder="e.g. 1px, 3px"
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Style</label>
                  <select
                    value={borderStyle}
                    onChange={(e) => {
                      setBorderStyle(e.target.value);
                      applyLiveUpdates({ borderStyle: e.target.value });
                    }}
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1 text-stone-150 focus:outline-none"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Radius (px, %)</label>
                  <input
                    type="text"
                    value={borderRadius}
                    onChange={(e) => {
                      setBorderRadius(e.target.value);
                      applyLiveUpdates({ borderRadius: e.target.value });
                    }}
                    placeholder="e.g. 8px, 50%"
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Border Color (Hex)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={borderColor.startsWith('#') && borderColor.length <= 7 ? borderColor : '#e5e7eb'}
                    onChange={(e) => {
                      setBorderColor(e.target.value);
                      applyLiveUpdates({ borderColor: e.target.value });
                    }}
                    className="w-8 h-8 rounded shrink-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => {
                      setBorderColor(e.target.value);
                      applyLiveUpdates({ borderColor: e.target.value });
                    }}
                    placeholder="e.g. #fbbf24"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-2 text-stone-150 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPACING & DIMENSIONS */}
        {activeTab === 'spacing' && (
          <div className="space-y-4 text-xs">
            {/* Width and Height */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Width (auto, 100%, px)</label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => {
                    setWidth(e.target.value);
                    applyLiveUpdates({ width: e.target.value });
                  }}
                  placeholder="e.g. auto, 100%, 350px"
                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    applyLiveUpdates({ height: e.target.value });
                  }}
                  placeholder="e.g. auto, 80px, 100%"
                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Margin and Padding */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Padding css-string</label>
                <input
                  type="text"
                  value={padding}
                  onChange={(e) => {
                    setPadding(e.target.value);
                    applyLiveUpdates({ padding: e.target.value });
                  }}
                  placeholder="e.g. 10px 20px, 1.5rem"
                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Margin css-string</label>
                <input
                  type="text"
                  value={margin}
                  onChange={(e) => {
                    setMargin(e.target.value);
                    applyLiveUpdates({ margin: e.target.value });
                  }}
                  placeholder="e.g. 0 auto, 15px, 2rem"
                  className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Position coordinate settings */}
            <div className="border-t border-stone-900 pt-3 space-y-3">
              <span className="block text-stone-300 font-bold uppercase tracking-widest text-[9px]">Coordinates & Overlay Position</span>
              
              <div>
                <label className="block text-stone-400 text-[10px] mb-1">Position Type</label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    applyLiveUpdates({ position: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
                >
                  <option value="static">Static (Default)</option>
                  <option value="relative">Relative</option>
                  <option value="absolute">Absolute</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              {position !== 'static' && (
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-stone-400 text-[9px] uppercase">Top</label>
                    <input
                      type="text"
                      value={top}
                      onChange={(e) => {
                        setTop(e.target.value);
                        applyLiveUpdates({ top: e.target.value });
                      }}
                      placeholder="e.g. 10px"
                      className="w-full bg-stone-900 border border-stone-800 rounded p-1 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-stone-400 text-[9px] uppercase">Bottom</label>
                    <input
                      type="text"
                      value={bottom}
                      onChange={(e) => {
                        setBottom(e.target.value);
                        applyLiveUpdates({ bottom: e.target.value });
                      }}
                      placeholder="e.g. 10px"
                      className="w-full bg-stone-900 border border-stone-800 rounded p-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-[9px] uppercase">Left</label>
                    <input
                      type="text"
                      value={left}
                      onChange={(e) => {
                        setLeft(e.target.value);
                        applyLiveUpdates({ left: e.target.value });
                      }}
                      placeholder="e.g. 10px"
                      className="w-full bg-stone-900 border border-stone-800 rounded p-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-[9px] uppercase">Right</label>
                    <input
                      type="text"
                      value={right}
                      onChange={(e) => {
                        setRight(e.target.value);
                        applyLiveUpdates({ right: e.target.value });
                      }}
                      placeholder="e.g. 10px"
                      className="w-full bg-stone-900 border border-stone-800 rounded p-1 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ICONS & MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-4 text-xs">
            {/* Image Source Input */}
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Replace Image Source URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  applyLiveUpdates({ imageUrl: e.target.value });
                }}
                placeholder="Paste premium image URL from Unsplash, Pixabay etc."
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Quick stock selections */}
            <div>
              <label className="block text-stone-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">Quick stock replacements</label>
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
                {stockImages.map((stock) => (
                  <button
                    key={stock.title}
                    type="button"
                    onClick={() => {
                      setImageUrl(stock.url);
                      applyLiveUpdates({ imageUrl: stock.url });
                    }}
                    className="p-1.5 rounded bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-400 flex items-center gap-2 text-left text-[9px] text-stone-300 font-mono"
                  >
                    <img src={stock.url} alt="Stock" className="w-8 h-8 rounded shrink-0 object-cover border border-neutral-700 referrer-no-referrer" referrerPolicy="no-referrer" />
                    <span className="truncate">{stock.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon selection dropdown */}
            <div className="border-t border-stone-900 pt-3">
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Select Graphic Icon overlay</label>
              <select
                value={icon}
                onChange={(e) => {
                  setIcon(e.target.value);
                  applyLiveUpdates({ icon: e.target.value });
                }}
                className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
              >
                {iconList.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* TAB 5: ADVANCED / SPECS */}
        {activeTab === 'advanced' && (
          <div className="space-y-4 text-xs">
            {/* Opacity and box shadows */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Opacity (0.0 to 1.0)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => {
                    const opVal = parseFloat(e.target.value);
                    setOpacity(opVal);
                    applyLiveUpdates({ opacity: opVal });
                  }}
                  className="w-full cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none"
                />
                <div className="text-right text-[10px] text-stone-400 mt-1 font-mono">{Math.round(opacity * 100)}% Opacity</div>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Preset Shadows</label>
                <select
                  value={boxShadow}
                  onChange={(e) => {
                    setBoxShadow(e.target.value);
                    applyLiveUpdates({ boxShadow: e.target.value });
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
                >
                  <option value="">None</option>
                  <option value="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)">Soft</option>
                  <option value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Medium</option>
                  <option value="0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.05)">Heavy</option>
                  <option value="0 10px 25px rgba(251,191,36,0.15), 0 0 10px rgba(11,107,58,0.2)">Intense Amber Glow</option>
                </select>
              </div>
            </div>

            {/* Animations selector */}
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Animation Effect</label>
              <select
                value={animation}
                onChange={(e) => {
                  setAnimation(e.target.value);
                  applyLiveUpdates({ animation: e.target.value });
                }}
                className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
              >
                <option value="none">No Animation</option>
                <option value="bounce">Bounce Loop</option>
                <option value="pulse">Pulse Ambient Glow</option>
                <option value="spin">Spin 360 Loop</option>
                <option value="ping">Ping Radar Beacon</option>
              </select>
            </div>

            {/* Hover Effects */}
            <div className="border-t border-stone-900 pt-3 space-y-3">
              <span className="block text-stone-300 font-bold uppercase tracking-widest text-[9px]">Interactive Hover State (Real-time Feedback)</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Hover Color</label>
                  <input
                    type="text"
                    value={hoverTextColor}
                    onChange={(e) => {
                      setHoverTextColor(e.target.value);
                      applyLiveUpdates({ hoverStyles: { textColor: e.target.value, bgColor: hoverBgColor, scale: hoverScale } });
                    }}
                    placeholder="#ffffff"
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Hover BG</label>
                  <input
                    type="text"
                    value={hoverBgColor}
                    onChange={(e) => {
                      setHoverBgColor(e.target.value);
                      applyLiveUpdates({ hoverStyles: { textColor: hoverTextColor, bgColor: e.target.value, scale: hoverScale } });
                    }}
                    placeholder="#fbbf24"
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[9px] uppercase">Hover Scale</label>
                  <select
                    value={hoverScale}
                    onChange={(e) => {
                      setHoverScale(e.target.value);
                      applyLiveUpdates({ hoverStyles: { textColor: hoverTextColor, bgColor: hoverBgColor, scale: e.target.value } });
                    }}
                    className="w-full bg-stone-900 border border-stone-800 rounded p-1 text-stone-150 focus:outline-none"
                  >
                    <option value="1">1.0 (No zoom)</option>
                    <option value="1.02">1.02 (Micro zoom)</option>
                    <option value="1.05">1.05 (Classic zoom)</option>
                    <option value="1.1">1.1 (High zoom)</option>
                    <option value="0.98">0.98 (Slight shrink)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility Toggle and Responsive Spec */}
            <div className="border-t border-stone-900 pt-3 space-y-3">
              <span className="block text-stone-300 font-bold uppercase tracking-widest text-[9px]">Visibility Limits & Responsive Framework</span>
              
              <div className="flex items-center justify-between bg-stone-900/60 p-2 rounded border border-stone-850">
                <div>
                  <span className="block font-semibold">Visibility Status</span>
                  <span className="block text-[9px] text-stone-400">Controls if element is rendered to visitors.</span>
                </div>
                <div className="flex bg-stone-950 border border-stone-800 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setVisible(true);
                      applyLiveUpdates({ visible: true });
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded ${visible ? 'bg-amber-400 text-stone-950' : 'text-stone-400'}`}
                  >
                    Show Style
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisible(false);
                      applyLiveUpdates({ visible: false });
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded ${!visible ? 'bg-red-600 text-white' : 'text-stone-400'}`}
                  >
                    Hide Component
                  </button>
                </div>
              </div>

              {/* Show checkmarks for platforms */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <label className="flex items-center gap-1.5 justify-center bg-stone-900 p-1.5 rounded border border-stone-800 cursor-pointer text-[10px]">
                  <input
                    type="checkbox"
                    checked={desktopShow}
                    onChange={(e) => {
                      setDesktopShow(e.target.checked);
                      applyLiveUpdates({ responsive: { mobileShow, tabletShow, desktopShow: e.target.checked } });
                    }}
                    className="accent-amber-450"
                  />
                  <span>Desktop View</span>
                </label>

                <label className="flex items-center gap-1.5 justify-center bg-stone-900 p-1.5 rounded border border-stone-800 cursor-pointer text-[10px]">
                  <input
                    type="checkbox"
                    checked={tabletShow}
                    onChange={(e) => {
                      setTabletShow(e.target.checked);
                      applyLiveUpdates({ responsive: { mobileShow, tabletShow: e.target.checked, desktopShow } });
                    }}
                    className="accent-amber-450"
                  />
                  <span>Tablet View</span>
                </label>

                <label className="flex items-center gap-1.5 justify-center bg-stone-900 p-1.5 rounded border border-stone-800 cursor-pointer text-[10px]">
                  <input
                    type="checkbox"
                    checked={mobileShow}
                    onChange={(e) => {
                      setMobileShow(e.target.checked);
                      applyLiveUpdates({ responsive: { mobileShow: e.target.checked, tabletShow, desktopShow } });
                    }}
                    className="accent-amber-450"
                  />
                  <span>Mobile View</span>
                </label>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Saving Action footer */}
      <div className="bg-stone-900 px-4 py-3 border-t border-stone-800 flex justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-transparent border border-red-900/50 hover:bg-red-900/10 text-red-400 font-bold px-3 py-2 rounded transition-colors cursor-pointer"
        >
          <Trash className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedEditableId(null)}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="bg-amber-400 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save</span>
          </button>
        </div>
      </div>

    </div>
  );
};
