import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Coupon,
  Review,
  WebsiteSettings,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS
} from '../types';
import { getTranslation } from '../utils/translations';
import { supabase } from '../lib/supabase';

interface AppContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  coupons: Coupon[];
  settings: WebsiteSettings;
  reviews: Review[];
  
  // Auth state
  currentUser: { email: string; name: string; role: 'admin' | 'customer'; phone?: string; district?: string } | null;
  login: (email: string, name: string, role: 'admin' | 'customer', phone?: string, district?: string) => void;
  logout: () => void;
  registeredCustomers: { phone: string; password?: string; district: string; name: string }[];
  registerCustomer: (phone: string, password: string, district: string, name?: string) => Promise<{ success: boolean; message: string }>;
  loginWithPhone: (phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  updateRegisteredCustomersList: (newList: { phone: string; password?: string; district: string; name: string }[]) => void;

  // Active page routing
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;

  // Shopping Cart actions
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;

  // Checkout & Ordering
  placeOrder: (billingInfo: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
    deliveryOption: 'Inside Dhaka' | 'Outside Dhaka';
    paymentScreenshot?: string;
    transactionId?: string;
  }) => Order | null;
  
  // Tracking
  trackedOrder: Order | null;
  trackOrder: (orderId: string) => Order | null;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: WebsiteSettings) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  addReview: (productId: string, author: string, rating: number, comment: string) => void;

  // Translation fields
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  t: (key: string) => string;

  // Visual Customizer Mode Actions
  isVisualEditMode: boolean;
  setVisualEditMode: (val: boolean) => void;
  selectedEditableId: string | null;
  setSelectedEditableId: (id: string | null) => void;
  updateElementCustomization: (id: string, updates: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence layers via localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('arisan_products');
    let loadedProducts: Product[] = local ? JSON.parse(local) : INITIAL_PRODUCTS;
    
    // Auto-fix or inject the Royal Pearl Jhumka Earrings product priced at 450 with the beautiful generated image!
    const targetImage = '/src/assets/images/royal_pearl_earrings_1779973980356.png';
    let updated = false;

    // 1. If any product in local storage has price or discountPrice 450 but is missing a valid image, fix it!
    loadedProducts = loadedProducts.map(p => {
      if ((p.price === 450 || p.discountPrice === 450) && (!p.image || p.image.trim() === '' || p.image.includes('placeholder') || !p.image.includes('/src/assets/images'))) {
        updated = true;
        return {
          ...p,
          image: targetImage,
          gallery: p.gallery && p.gallery.length > 0 && !p.gallery[0].includes('placeholder') ? p.gallery : [targetImage]
        };
      }
      return p;
    });

    // 2. Ensure our newly seeded beautiful jewelry is present in their local list!
    const hasRoyalEarrings = loadedProducts.some(p => p.id === 'prod-royal-pearl-earrings' || p.title.toLowerCase().includes('pearl jhumka'));
    if (!hasRoyalEarrings) {
      const seededRoyal = INITIAL_PRODUCTS.find(p => p.id === 'prod-royal-pearl-earrings');
      if (seededRoyal) {
        loadedProducts.push(seededRoyal);
        updated = true;
      }
    }

    if (updated && local) {
      localStorage.setItem('arisan_products', JSON.stringify(loadedProducts));
    }
    
    return loadedProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const local = localStorage.getItem('arisan_categories');
    return local ? JSON.parse(local) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('arisan_orders');
    return local ? JSON.parse(local) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('arisan_cart');
    return local ? JSON.parse(local) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const local = localStorage.getItem('arisan_coupons');
    return local ? JSON.parse(local) : INITIAL_COUPONS;
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const local = localStorage.getItem('arisan_settings');
    if (local) {
      const parsed = JSON.parse(local);
      
      // Force migration to correct brand details and color palette if ancient settings exist in user browser
      if (
        parsed.brandName !== 'ARISAN BD' ||
        parsed.tagline === 'Simple Look, Premium Jewellery' ||
        parsed.buttonBgColor === '#e23e38' ||
        parsed.secondaryNavBgColor === '#202226'
      ) {
        parsed.brandName = 'ARISAN BD';
        parsed.tagline = 'Where Every Piece Tells a Story';
        parsed.announcementText = '✨ Premium Fashion Jewellery | Nationwide Delivery Available ✨';
        parsed.whatsappNumber = '+8801313840136';
        parsed.email = 'arisanbd26@gmail.com';
        parsed.facebookUrl = 'https://www.facebook.com/share/18ZkTRas19/';
        parsed.instagramUrl = 'https://www.instagram.com/ari_san01';
        parsed.tiktokUrl = '';
        parsed.heroHeadline = 'Elegant Jewellery for Every Occasion';
        parsed.heroSubheadline = 'Discover timeless beauty with premium jewellery designed to complement your unique style.';
        parsed.headerBgColor = '#ffffff';
        parsed.headerTextColor = '#111827';
        parsed.secondaryNavBgColor = '#0B6B3A';
        parsed.secondaryNavTextColor = '#ffffff';
        parsed.buttonBgColor = '#0B6B3A';
        parsed.buttonTextColor = '#ffffff';
        parsed.bodyBgColor = '#ffffff';
        parsed.bodyTextColor = '#111827';
        parsed.heroBgColor = '#DDECCF';
        parsed.heroTextColor = '#0B6B3A';
        parsed.categoriesBgColor = '#ffffff';
        parsed.categoriesTextColor = '#111827';
        parsed.bestsellersBgColor = '#ffffff';
        parsed.bestsellersTextColor = '#111827';
        parsed.newArrivalsBgColor = '#f3f4f6';
        parsed.newArrivalsTextColor = '#111827';
        parsed.eidSectionBgColor = '#0B6B3A';
        parsed.eidSectionTextColor = '#ffffff';
        parsed.footerBgColor = '#111827';
        parsed.footerTextColor = '#ebeef2';
        parsed.newsletterBgColor = '#0B6B3A';
        parsed.newsletterTextColor = '#ffffff';
      }

      // Migrate old WhatsApp numbers to the new correct one
      parsed.whatsappNumber = '+8801313840136';
      parsed.email = 'arisanbd26@gmail.com';
      
      const merged = { ...INITIAL_SETTINGS, ...parsed };
      if (!merged.translationOverrides) {
        merged.translationOverrides = { en: {}, bn: {} };
      }
      localStorage.setItem('arisan_settings', JSON.stringify(merged));
      return merged;
    }
    return INITIAL_SETTINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const local = localStorage.getItem('arisan_reviews');
    return local ? JSON.parse(local) : INITIAL_REVIEWS;
  });

  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(() => {
    const local = localStorage.getItem('arisan_user');
    return local ? JSON.parse(local) : null;
  });

  const [registeredCustomers, setRegisteredCustomers] = useState<{ phone: string; password?: string; district: string; name: string }[]>(() => {
    const local = localStorage.getItem('arisan_registered_customers');
    return local ? JSON.parse(local) : [];
  });

  // Sync customers with the backend on component initialization
  useEffect(() => {
    const syncOnMount = async () => {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        if (data && Array.isArray(data.customers)) {
          setRegisteredCustomers(data.customers);
          localStorage.setItem('arisan_registered_customers', JSON.stringify(data.customers));
        }
      } catch (err) {
        console.error('Error fetching customers from Node backend on mount:', err);
      }
    };
    syncOnMount();
  }, []);

  const updateRegisteredCustomersList = async (newList: typeof registeredCustomers) => {
    setRegisteredCustomers(newList);
    localStorage.setItem('arisan_registered_customers', JSON.stringify(newList));
    try {
      await fetch('/api/customers/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: newList })
      });
    } catch (e) {
      console.error('Error syncing updated customer list to backend:', e);
    }
  };

  // Visual Editing Mode States
  const [isVisualEditMode, setVisualEditModeState] = useState<boolean>(() => {
    return localStorage.getItem('arisan_visual_edit_mode') === 'true';
  });
  const [selectedEditableId, setSelectedEditableId] = useState<string | null>(null);

  const setVisualEditMode = (val: boolean) => {
    setVisualEditModeState(val);
    localStorage.setItem('arisan_visual_edit_mode', val ? 'true' : 'false');
  };

  const updateElementCustomization = (id: string, updates: any) => {
    setSettings((prev) => {
      const existingElements = prev.editableElements || {};
      const updatedElements = {
        ...existingElements,
        [id]: {
          ...(existingElements[id] || {}),
          ...updates,
        },
      };
      const updatedSettings = {
        ...prev,
        editableElements: updatedElements,
      };
      
      localStorage.setItem('arisan_settings', JSON.stringify(updatedSettings));
      supabase.from('arisan_settings').upsert({ id: 'default_settings', data: updatedSettings }).then(({ error }) => {
        if (error) console.error('Supabase update settings error in visual editor:', error);
      });

      return updatedSettings;
    });
  };

  // Language States
  const [language, setLanguageState] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem('arisan_language');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('arisan_language', lang);
  };

  const t = (key: string): string => {
    if (settings && settings.translationOverrides) {
      const overridesByLang = settings.translationOverrides[language];
      if (overridesByLang && overridesByLang[key] !== undefined && overridesByLang[key] !== '') {
        return overridesByLang[key];
      }
    }
    return getTranslation(key, language);
  };

  // Navigation states
  const [activeTab, setActiveTabState] = useState<string>(() => {
    const tab = localStorage.getItem('arisan_active_tab');
    return tab || 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Synchronizers
  useEffect(() => {
    const fetchAllFromSupabase = async () => {
      try {
        // Fetch products
        const { data: dbProducts, error: pErr } = await supabase.from('arisan_products').select('*');
        if (!pErr && dbProducts && dbProducts.length > 0) {
          const parsed: Product[] = dbProducts.map((row: any) => row.data);
          setProducts(parsed);
        } else if (!pErr) {
          // If connection works but DB is empty, pre-populate with current local copy
          const uploads = products.map(p => supabase.from('arisan_products').upsert({ id: p.id, data: p }));
          await Promise.all(uploads);
        }

        // Fetch categories
        const { data: dbCategories, error: cErr } = await supabase.from('arisan_categories').select('*');
        if (!cErr && dbCategories && dbCategories.length > 0) {
          const parsed: Category[] = dbCategories.map((row: any) => row.data);
          setCategories(parsed);
        } else if (!cErr) {
          const uploads = categories.map(c => supabase.from('arisan_categories').upsert({ id: c.id, data: c }));
          await Promise.all(uploads);
        }

        // Fetch coupons
        const { data: dbCoupons, error: coupErr } = await supabase.from('arisan_coupons').select('*');
        if (!coupErr && dbCoupons && dbCoupons.length > 0) {
          const parsed: Coupon[] = dbCoupons.map((row: any) => row.data);
          setCoupons(parsed);
        } else if (!coupErr) {
          const uploads = coupons.map(c => supabase.from('arisan_coupons').upsert({ id: c.code, data: c }));
          await Promise.all(uploads);
        }

        // Fetch settings
        const { data: dbSettings, error: sErr } = await supabase.from('arisan_settings').select('*').eq('id', 'default_settings').single();
        if (!sErr && dbSettings && dbSettings.data) {
          const dbData = dbSettings.data;
          if (
            dbData.brandName !== 'ARISAN BD' ||
            dbData.tagline === 'Simple Look, Premium Jewellery' ||
            dbData.buttonBgColor === '#e23e38' ||
            dbData.secondaryNavBgColor === '#202226'
          ) {
            const updatedDbSettings = {
              ...dbData,
              brandName: 'ARISAN BD',
              tagline: 'Where Every Piece Tells a Story',
              announcementText: '✨ Premium Fashion Jewellery | Nationwide Delivery Available ✨',
              whatsappNumber: '+8801313840136',
              email: 'arisanbd26@gmail.com',
              facebookUrl: 'https://www.facebook.com/share/18ZkTRas19/',
              instagramUrl: 'https://www.instagram.com/ari_san01',
              tiktokUrl: '',
              heroHeadline: 'Elegant Jewellery for Every Occasion',
              heroSubheadline: 'Discover timeless beauty with premium jewellery designed to complement your unique style.',
              headerBgColor: '#ffffff',
              headerTextColor: '#111827',
              secondaryNavBgColor: '#0B6B3A',
              secondaryNavTextColor: '#ffffff',
              buttonBgColor: '#0B6B3A',
              buttonTextColor: '#ffffff',
              bodyBgColor: '#ffffff',
              bodyTextColor: '#111827',
              heroBgColor: '#DDECCF',
              heroTextColor: '#0B6B3A',
              categoriesBgColor: '#ffffff',
              categoriesTextColor: '#111827',
              bestsellersBgColor: '#ffffff',
              bestsellersTextColor: '#111827',
              newArrivalsBgColor: '#f3f4f6',
              newArrivalsTextColor: '#111827',
              eidSectionBgColor: '#0B6B3A',
              eidSectionTextColor: '#ffffff',
              footerBgColor: '#111827',
              footerTextColor: '#ebeef2',
              newsletterBgColor: '#0B6B3A',
              newsletterTextColor: '#ffffff'
            };
            setSettings(updatedDbSettings);
            await supabase.from('arisan_settings').upsert({ id: 'default_settings', data: updatedDbSettings });
          } else {
            setSettings(dbData);
          }
        } else if (!sErr) {
          await supabase.from('arisan_settings').upsert({ id: 'default_settings', data: settings });
        }

        // Fetch reviews
        const { data: dbReviews, error: rErr } = await supabase.from('arisan_reviews').select('*');
        if (!rErr && dbReviews && dbReviews.length > 0) {
          const parsed: Review[] = dbReviews.map((row: any) => row.data);
          setReviews(parsed);
        } else if (!rErr) {
          const uploads = reviews.map(r => supabase.from('arisan_reviews').upsert({ id: r.id, data: r }));
          await Promise.all(uploads);
        }

        // Fetch orders
        const { data: dbOrders, error: oErr } = await supabase.from('arisan_orders').select('*');
        if (!oErr && dbOrders && dbOrders.length > 0) {
          const parsed: Order[] = dbOrders.map((row: any) => row.data);
          parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(parsed);
        }

        // Fetch customers
        try {
          const { data: dbCustomers, error: custErr } = await supabase.from('arisan_customers').select('*');
          const localVal = localStorage.getItem('arisan_registered_customers');
          const localCustomers = localVal ? JSON.parse(localVal) : [];
          
          const mergedMap = new Map();
          localCustomers.forEach((c: any) => {
            if (c.phone) mergedMap.set(c.phone, c);
          });

          if (!custErr && dbCustomers && dbCustomers.length > 0) {
            const parsed = dbCustomers.map((row: any) => row.data);
            parsed.forEach((c: any) => {
              if (c.phone) mergedMap.set(c.phone, c);
            });
          }

          // Fetch from Supabase settings backup too
          try {
            const { data: dbSettings, error: sErr } = await supabase.from('arisan_settings').select('*').eq('id', 'default_settings').single();
            if (!sErr && dbSettings && dbSettings.data && Array.isArray(dbSettings.data.registeredCustomersList)) {
              dbSettings.data.registeredCustomersList.forEach((c: any) => {
                if (c && c.phone) mergedMap.set(c.phone, c);
              });
            }
          } catch (err) {}

          const merged = Array.from(mergedMap.values());
          setRegisteredCustomers(merged);
          localStorage.setItem('arisan_registered_customers', JSON.stringify(merged));
        } catch (e) {
          console.warn('Could not load arisan_customers table (ignored):', e);
        }
      } catch (err) {
        console.warn('Supabase automatic hydrate block warning:', err);
      }
    };

    fetchAllFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('arisan_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('arisan_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('arisan_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('arisan_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('arisan_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('arisan_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('arisan_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('arisan_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('arisan_user');
    }
  }, [currentUser]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem('arisan_active_tab', tab);
    // Auto scroll top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth mechanisms
  const login = (email: string, name: string, role: 'admin' | 'customer', phone?: string, district?: string) => {
    setCurrentUser({ email, name, role, phone, district });
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const normalizePhoneNumber = (phone: string): string => {
    // Strip all non-digit characters
    const clean = phone.replace(/\D/g, '');
    // If starts with 880, remove it
    if (clean.startsWith('880')) {
      return clean.slice(3);
    }
    // If starts with 0, remove it
    if (clean.startsWith('0')) {
      return clean.slice(1);
    }
    return clean;
  };

  const registerCustomer = async (phone: string, password: string, district: string, name?: string) => {
    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      return { success: false, message: language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর দিন।' : 'Please provide a phone number.' };
    }

    try {
      const resp = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password,
          district,
          name,
          language
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        return { success: false, message: data.message || (language === 'bn' ? 'একাউন্ট তৈরি করা ব্যর্থ হয়েছে!' : 'Registration failed!') };
      }

      const registeredUser = data.customer;

      // Reload customers list from server and cache gracefully
      try {
        const listResp = await fetch('/api/customers');
        if (listResp.ok) {
          const listData = await listResp.json();
          if (listData && Array.isArray(listData.customers)) {
            setRegisteredCustomers(listData.customers);
            localStorage.setItem('arisan_registered_customers', JSON.stringify(listData.customers));
          }
        }
      } catch (listErr) {
        console.warn('Could not reload customer list after registration (non-fatal):', listErr);
        // Fallback: append locally
        const fallbackCustomer = {
          phone: registeredUser.phone,
          district: registeredUser.district || district,
          name: registeredUser.name
        };
        const updatedList = [...(registeredCustomers || []), fallbackCustomer];
        setRegisteredCustomers(updatedList);
        localStorage.setItem('arisan_registered_customers', JSON.stringify(updatedList));
      }

      login(registeredUser.phone + '@arisan.com', registeredUser.name, 'customer', registeredUser.phone, registeredUser.district);

      return { success: true, message: data.message };
    } catch (err: any) {
      console.error('Error during client registerCustomer call:', err);
      const errMsg = err?.message || String(err);
      return { success: false, message: language === 'bn' ? `সার্ভার সংযোগে ত্রুটি ঘটেছে! (${errMsg})` : `Network connection error! (${errMsg})` };
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    const normalizedPhone = phone.trim();
    const cleanPassword = password || '';

    if (!normalizedPhone) {
      return { success: false, message: language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর দিন।' : 'Please provide a phone number.' };
    }

    // Direct check for admin credentials bypass or standard customers
    const adminEmailConfig = settings?.adminEmail || 'jesanbinary07@gmail.com';
    const adminPasswordConfig = settings?.adminPassword || 'jesan2026';
    if (normalizedPhone === adminEmailConfig || normalizedPhone === '+8801313840136' || normalizedPhone === '01313840136') {
      if (cleanPassword === adminPasswordConfig) {
        login(adminEmailConfig, 'Tarikul Alam Jesan', 'admin', '+8801313840136', 'Dhaka');
        return { success: true, message: 'Admin authenticated.' };
      }
    }

    try {
      const resp = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password: cleanPassword,
          language
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        return { success: false, message: data.message || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে!' : 'Login failed!') };
      }

      const loggedUser = data.customer;

      // Sync customer registry with backend to ensure the client stays updated gracefully
      try {
        const listResp = await fetch('/api/customers');
        if (listResp.ok) {
          const listData = await listResp.json();
          if (listData && Array.isArray(listData.customers)) {
            setRegisteredCustomers(listData.customers);
            localStorage.setItem('arisan_registered_customers', JSON.stringify(listData.customers));
          }
        }
      } catch (listErr) {
        console.warn('Could not reload customer list after login (non-fatal):', listErr);
        // Fallback: append locally if missing
        const exists = (registeredCustomers || []).some(c => c.phone === loggedUser.phone);
        if (!exists) {
          const fallbackCustomer = {
            phone: loggedUser.phone,
            district: loggedUser.district || 'Dhaka',
            name: loggedUser.name
          };
          const updatedList = [...(registeredCustomers || []), fallbackCustomer];
          setRegisteredCustomers(updatedList);
          localStorage.setItem('arisan_registered_customers', JSON.stringify(updatedList));
        }
      }

      login(loggedUser.phone + '@arisan.com', loggedUser.name, 'customer', loggedUser.phone, loggedUser.district);

      return { success: true, message: data.message };
    } catch (err: any) {
      console.error('Error during client loginWithPhone call:', err);
      const errMsg = err?.message || String(err);
      return { success: false, message: language === 'bn' ? `সার্ভার সংযোগে ত্রুটি ঘটেছে! (${errMsg})` : `Network connection error! (${errMsg})` };
    }
  };

  // Cart operations
  const addToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    const safeSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const safeColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
    const itemId = `${product.id}-${safeSize}-${safeColor}`;

    setCart((prevCart) => {
      const matchIndex = prevCart.findIndex((i) => i.id === itemId);
      if (matchIndex > -1) {
        const newCart = [...prevCart];
        newCart[matchIndex] = {
          ...newCart[matchIndex],
          quantity: newCart[matchIndex].quantity + quantity
        };
        return newCart;
      } else {
        return [...prevCart, { id: itemId, product, quantity, selectedSize: safeSize, selectedColor: safeColor }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const activePrice = item.product.discountPrice || item.product.price;
      return total + activePrice * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Coupon applying
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const total = getCartTotal();
    if (total < coupon.minSpend) {
      return { success: false, message: `Minimum spends of ৳${coupon.minSpend} required for this coupon.` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
  };

  // Order placement
  const placeOrder = (info: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
    deliveryOption: 'Inside Dhaka' | 'Outside Dhaka';
    paymentScreenshot?: string;
    transactionId?: string;
  }) => {
    if (cart.length === 0) return null;

    const subtotal = getCartTotal();
    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'Percentage') {
        couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        couponDiscount = appliedCoupon.value;
      }
    }

    // Free delivery and default delivery charge from settings
    const freeThreshold = settings?.freeDeliveryThreshold ?? 3000;
    const chargeInside = settings?.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = settings?.deliveryChargeOutsideDhaka ?? 150;
    const deliveryCharge = subtotal >= freeThreshold
      ? 0
      : (info.deliveryOption === 'Inside Dhaka' ? chargeInside : chargeOutside);
    const total = subtotal - couponDiscount + deliveryCharge;

    const orderId = `ARISAN-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `TRACK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser?.email || 'guest',
      customerName: info.customerName,
      email: info.email,
      phone: info.phone,
      address: info.address,
      city: info.city,
      district: info.district,
      items: cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      subtotal,
      deliveryCharge,
      discountAmount: couponDiscount,
      total,
      paymentMethod: info.paymentMethod,
      deliveryOption: info.deliveryOption,
      paymentScreenshot: info.paymentScreenshot,
      transactionId: info.transactionId,
      status: 'Pending',
      trackingNumber,
      createdAt: new Date().toISOString()
    };

    // Deduct stocks and sync products
    setProducts((prevProducts) => {
      const nextProducts = prevProducts.map((p) => {
        const orderItem = cart.find((i) => i.product.id === p.id);
        if (orderItem) {
          const remainingStock = Math.max(0, p.stockCount - orderItem.quantity);
          const updatedP = {
            ...p,
            stockCount: remainingStock,
            stockStatus: remainingStock === 0 ? 'Out of Stock' : remainingStock < 10 ? 'Low Stock' : 'In Stock'
          };
          // Sync single product stock change to Supabase
          supabase.from('arisan_products').upsert({ id: p.id, data: updatedP }).then(({ error }) => {
            if (error) console.error('Supabase product stock sync error:', error);
          });
          return updatedP;
        }
        return p;
      });
      return nextProducts;
    });

    setOrders((prev) => [newOrder, ...prev]);

    // Save order to Supabase database
    supabase.from('arisan_orders').upsert({ id: orderId, data: newOrder }).then(({ error }) => {
      if (error) console.error('Supabase order write error:', error);
    });
    
    // Save order ID to local storage device history so user can find it later
    try {
      const existingStr = localStorage.getItem('arisan_device_order_ids');
      const orderIds = existingStr ? JSON.parse(existingStr) : [];
      if (!orderIds.includes(newOrder.id)) {
        orderIds.push(newOrder.id);
        localStorage.setItem('arisan_device_order_ids', JSON.stringify(orderIds));
      }
    } catch (err) {
      console.warn('Failed to save order to local history:', err);
    }

    clearCart();
    return newOrder;
  };

  // Track order
  const trackOrder = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    const order = orders.find((o) => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId);
    if (order) {
      setTrackedOrder(order);
      return order;
    }
    setTrackedOrder(null);
    return null;
  };  // Administration tasks
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...p,
      id: newId,
      rating: p.rating || 5.0,
      reviewsCount: p.reviewsCount || 0
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Supabase sync
    supabase.from('arisan_products').upsert({ id: newId, data: newProduct }).then(({ error }) => {
      if (error) console.error('Supabase add product error:', error);
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    // Supabase sync
    supabase.from('arisan_products').upsert({ id: updated.id, data: updated }).then(({ error }) => {
      if (error) console.error('Supabase update product error:', error);
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Supabase sync
    supabase.from('arisan_products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Supabase delete product error:', error);
    });
  };

  const updateSettings = (updated: WebsiteSettings) => {
    setSettings(updated);

    // Supabase sync
    supabase.from('arisan_settings').upsert({ id: 'default_settings', data: updated }).then(({ error }) => {
      if (error) console.error('Supabase update settings error:', error);
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => {
      const nextOrders = prev.map((o) => {
        if (o.id === orderId) {
          const updatedO = { ...o, status };
          // Supabase sync
          supabase.from('arisan_orders').upsert({ id: orderId, data: updatedO }).then(({ error }) => {
            if (error) console.error('Supabase update order status error:', error);
          });
          return updatedO;
        }
        return o;
      });
      return nextOrders;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    // Supabase sync
    supabase.from('arisan_orders').delete().eq('id', orderId).then(({ error }) => {
      if (error) console.error('Supabase delete order error:', error);
    });
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const clean = prev.filter((c) => c.code.toUpperCase() !== coupon.code.toUpperCase());
      const nextCoupons = [coupon, ...clean];
      return nextCoupons;
    });

    // Supabase sync
    supabase.from('arisan_coupons').upsert({ id: coupon.code, data: coupon }).then(({ error }) => {
      if (error) console.error('Supabase add coupon error:', error);
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));

    // Supabase sync
    supabase.from('arisan_coupons').delete().eq('id', code).then(({ error }) => {
      if (error) console.error('Supabase delete coupon error:', error);
    });
  };

  const addReview = (productId: string, author: string, rating: number, comment: string) => {
    const matchedProduct = products.find((p) => p.id === productId);
    const revId = `rev-${Date.now()}`;
    const newReview: Review = {
      id: revId,
      productTitle: matchedProduct ? matchedProduct.title : 'Premium Jewellery Item',
      author,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' // default
    };
    setReviews((prev) => [newReview, ...prev]);

    // Supabase sync
    supabase.from('arisan_reviews').upsert({ id: revId, data: newReview }).then(({ error }) => {
      if (error) console.error('Supabase add review error:', error);
    });

    // Update product rating average & review counts
    if (matchedProduct) {
      setProducts((prevProducts) => {
        const nextProducts = prevProducts.map((p) => {
          if (p.id === productId) {
            const counts = p.reviewsCount + 1;
            const newRating = parseFloat(((p.rating * p.reviewsCount + rating) / counts).toFixed(1));
            const updatedP = {
              ...p,
              reviewsCount: counts,
              rating: newRating
            };
            // Supabase sync
            supabase.from('arisan_products').upsert({ id: productId, data: updatedP }).then(({ error }) => {
              if (error) console.error('Supabase product review update error:', error);
            });
            return updatedP;
          }
          return p;
        });
        return nextProducts;
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        coupons,
        settings,
        reviews,
        currentUser,
        login,
        logout,
        registeredCustomers,
        registerCustomer,
        loginWithPhone,
        updateRegisteredCustomersList,
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        placeOrder,
        trackedOrder,
        trackOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        updateOrderStatus,
        deleteOrder,
        addCoupon,
        deleteCoupon,
        addReview,
        language,
        setLanguage,
        t,
        isVisualEditMode,
        setVisualEditMode,
        selectedEditableId,
        setSelectedEditableId,
        updateElementCustomization
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
