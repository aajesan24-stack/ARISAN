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

interface AppContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  coupons: Coupon[];
  settings: WebsiteSettings;
  reviews: Review[];
  
  // Auth state
  currentUser: { email: string; name: string; role: 'admin' | 'customer'; phone?: string } | null;
  login: (email: string, name: string, role: 'admin' | 'customer', phone?: string) => void;
  logout: () => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence layers via localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('arisan_products');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
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
      // Migrate old WhatsApp numbers to the new correct one
      if (
        parsed.whatsappNumber === '+8801700000000' || 
        parsed.whatsappNumber === '01700000000' || 
        parsed.whatsappNumber === '+8801873392781' || 
        parsed.whatsappNumber === '+8801312840136' ||
        !parsed.whatsappNumber
      ) {
        parsed.whatsappNumber = '+8801313840136';
      }
      // Migrate old emails
      if (parsed.email === 'support@arisanbd.com' || !parsed.email) {
        parsed.email = 'arisanbd26@gmail.com';
      }
      // Force migrate style presets to match the gorgeous new Shopping template-inspired premium gold, dark slate, and action-red theme
      if (parsed.buttonBgColor !== '#e23e38' || parsed.secondaryNavBgColor !== '#202226' || !parsed.headerBgColor) {
        parsed.headerBgColor = '#ffffff';
        parsed.headerTextColor = '#202226';
        parsed.secondaryNavBgColor = '#202226';
        parsed.secondaryNavTextColor = '#ffffff';
        parsed.buttonBgColor = '#e23e38';
        parsed.buttonTextColor = '#ffffff';
      }
      localStorage.setItem('arisan_settings', JSON.stringify(parsed));
      return parsed;
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
  const login = (email: string, name: string, role: 'admin' | 'customer', phone?: string) => {
    setCurrentUser({ email, name, role, phone });
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
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

    // Deduct stocks
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const orderItem = cart.find((i) => i.product.id === p.id);
        if (orderItem) {
          const remainingStock = Math.max(0, p.stockCount - orderItem.quantity);
          return {
            ...p,
            stockCount: remainingStock,
            stockStatus: remainingStock === 0 ? 'Out of Stock' : remainingStock < 10 ? 'Low Stock' : 'In Stock'
          };
        }
        return p;
      });
    });

    setOrders((prev) => [newOrder, ...prev]);
    
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
  };

  // Administration tasks
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...p,
      id: newId,
      rating: p.rating || 5.0,
      reviewsCount: p.reviewsCount || 0
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSettings = (updated: WebsiteSettings) => {
    setSettings(updated);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      // Avoid duplicate codes
      const clean = prev.filter((c) => c.code.toUpperCase() !== coupon.code.toUpperCase());
      return [coupon, ...clean];
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const addReview = (productId: string, author: string, rating: number, comment: string) => {
    const matchedProduct = products.find((p) => p.id === productId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productTitle: matchedProduct ? matchedProduct.title : 'Premium Jewellery Item',
      author,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' // default
    };
    setReviews((prev) => [newReview, ...prev]);

    // Update product rating average & review counts
    if (matchedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === productId) {
            const counts = p.reviewsCount + 1;
            const newRating = parseFloat(((p.rating * p.reviewsCount + rating) / counts).toFixed(1));
            return {
              ...p,
              reviewsCount: counts,
              rating: newRating
            };
          }
          return p;
        })
      );
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
        t
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
