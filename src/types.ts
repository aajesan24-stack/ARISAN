/**
 * ARISAN BD - Types & Initial Database Seed
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in BDT
  discountPrice?: number; // Optional promo price
  category: string;
  image: string;
  gallery: string[];
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  bestSelling?: boolean;
  newArrival?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  id: string; // Combined productId + size + color
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentScreenshot?: string;
  transactionId?: string;
  deliveryOption?: 'Inside Dhaka' | 'Outside Dhaka';
  trackingNumber: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  minSpend: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productTitle: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  announcementText: string;
  whatsappNumber: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  eidImage?: string;
  eidOfferActive: boolean;
  eidDiscountPercent: number;
  headerBgColor?: string;
  headerTextColor?: string;
  secondaryNavBgColor?: string;
  secondaryNavTextColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  adminEmail?: string;
  adminPassword?: string;
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
  freeDeliveryThreshold?: number;
  
  // Font override options
  fontFamily?: string;
  fontSizeScale?: 'compact' | 'normal' | 'spacious';
  
  // Custom CSS block override
  customCSS?: string;
  
  // Custom Translation overrides
  translationOverrides?: {
    en?: Record<string, string>;
    bn?: Record<string, string>;
  };
  
  // Section background & color overrides
  bodyBgColor?: string;
  bodyTextColor?: string;
  heroBgColor?: string;
  heroTextColor?: string;
  categoriesBgColor?: string;
  categoriesTextColor?: string;
  bestsellersBgColor?: string;
  bestsellersTextColor?: string;
  newArrivalsBgColor?: string;
  newArrivalsTextColor?: string;
  eidSectionBgColor?: string;
  eidSectionTextColor?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  newsletterBgColor?: string;
  newsletterTextColor?: string;
  
  // Button design styles
  btnBorderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  btnPaddingStyle?: 'compact' | 'normal' | 'spacious';
  btnShadowStyle?: 'none' | 'soft' | 'intense';
  
  // Desktop vs Mobile specific parameters
  mobileStickyCart?: boolean;
  hideHeroOnMobile?: boolean;
  hideEidSectionOnMobile?: boolean;
  mobileFontSizeScale?: 'compact' | 'normal' | 'spacious';
}

// Initial Mock Seed Data
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-rings',
    name: 'Royalty Rings',
    slug: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'cat-necklaces',
    name: 'Luxurious Necklaces',
    slug: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'cat-earrings',
    name: 'Elixir Earrings',
    slug: 'earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'cat-bracelets',
    name: 'Gilded Bracelets',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-emerald-royale',
    title: 'Emerald Royale Ring',
    description: 'An exquisitely structured ring featuring a 2.5-carat pear-cut deep Colombian Emerald, flanked by brilliant-cut micro diamonds. Plated in majestic 18K solid gold, this makes a bold statement of timeless luxury.',
    price: 3200,
    discountPrice: 2450,
    category: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 45,
    sizes: ['6', '7', '8', '9'],
    colors: ['Emerald Gold', 'Silver Diamond'],
    featured: true,
    bestSelling: true,
    newArrival: false,
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: 'prod-empress-choker',
    title: 'Empress Emerald Choker',
    description: 'A masterpiece created for the elite. Eight teardrop emerald gemstones suspended from a chain intricately sculpted in 22K yellow gold. Designed for a comfortable but lavish fit around your collarbone.',
    price: 8500,
    discountPrice: 6990,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 12,
    sizes: ['Standard 14"', 'Extended 16"'],
    colors: ['Imperial Gold', 'Platinum Shimmer'],
    featured: true,
    bestSelling: false,
    newArrival: true,
    rating: 5.0,
    reviewsCount: 24
  },
  {
    id: 'prod-elixir-drops',
    title: 'Elixir Emerald Drops',
    description: 'These dangling earrings reflect sophistication in every turn. Crafted with a duo of cushion-cut natural emerald synthetic resins of extremely premium grades, enclosed in high-gloss yellow gold bezels.',
    price: 2600,
    discountPrice: 1950,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 30,
    sizes: ['One Size'],
    colors: ['Emerald Gold'],
    featured: false,
    bestSelling: true,
    newArrival: false,
    rating: 4.8,
    reviewsCount: 14
  },
  {
    id: 'prod-aurum-bangle',
    title: 'Aurum Minimal Bangle',
    description: 'A classic hand-polished sleek bangle embodying the “Simple Look, Premium Jewellery” concept. Features micro-etchings of geometric patterns along the inner circumference. Perfect for daily luxury wear.',
    price: 4500,
    discountPrice: 3800,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 22,
    sizes: ['S', 'M', 'L'],
    colors: ['22K Gold Plated', 'Rose Gold Plated'],
    featured: true,
    bestSelling: true,
    newArrival: true,
    rating: 4.7,
    reviewsCount: 31
  },
  {
    id: 'prod-sovereign-pendant',
    title: 'Sovereign Radiant Pendant',
    description: 'A stunning bezel-set rectangle cut deep green laboratory emerald suspended from an exquisite rope chain. Matches beautifully with both traditional Bangladeshi festive wear and contemporary attire.',
    price: 3800,
    discountPrice: 2990,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'Low Stock',
    stockCount: 5,
    sizes: ['18 Inches'],
    colors: ['Gold Plated'],
    featured: false,
    bestSelling: false,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 9
  },
  {
    id: 'prod-gilded-leaf',
    title: 'Gilded Fern Cuff',
    description: 'Inspired by botanical geometry, this cuff bracelet embraces the wrist elegantly with overlapping gold ferns. Adorned with microscopic green emerald gems aligned to the master leaf veins.',
    price: 5200,
    discountPrice: 4200,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 15,
    sizes: ['Adjustable Size'],
    colors: ['Yellow Gold'],
    featured: false,
    bestSelling: true,
    newArrival: false,
    rating: 4.6,
    reviewsCount: 11
  },
  {
    id: 'prod-zenith-studs',
    title: 'Zenith Geometric Studs',
    description: 'A minimal designer pair with micro emerald crystals aligned in a geometric hexagonal halo. Truly captures our brand philosophy: extremely elegant structure with zero unnecessary bulk.',
    price: 1800,
    discountPrice: 1450,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'
    ],
    stockStatus: 'In Stock',
    stockCount: 60,
    sizes: ['Standard Pair'],
    colors: ['Gold', 'Silver'],
    featured: false,
    bestSelling: false,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 22
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productTitle: 'Emerald Royale Ring',
    author: 'Tasmia Rahman',
    rating: 5,
    comment: 'The finishing is absolutely top-notch! The green shade looks so regal and the gold plating hasn’t faded at all after weeks of wear. Definitely buying more earrings soon!',
    date: '2026-05-18',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'rev-2',
    productTitle: 'Empress Emerald Choker',
    author: 'Farhana Akhter',
    rating: 5,
    comment: 'Wore this choker on my Eid cousins-meetup and got endless compliments. It sits comfortably and feels very premium and heavy. ARISAN BD is indeed providing high-end quality!',
    date: '2026-05-20',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'rev-3',
    productTitle: 'Aurum Minimal Bangle',
    author: 'Samir Chowdhury',
    rating: 4,
    comment: 'Bought this as an anniversary gift for my wife. She loved the minimalistic design. The packaging was also beautiful with a custom gold-foiled card in an emerald box.',
    date: '2026-05-22',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'EID2026', discountType: 'Percentage', value: 15, minSpend: 2000, isActive: true },
  { code: 'ARISANGOLD', discountType: 'Fixed', value: 500, minSpend: 5000, isActive: true },
  { code: 'FIRSTLOVE', discountType: 'Percentage', value: 10, minSpend: 1000, isActive: true }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  brandName: 'ARISAN BD',
  tagline: 'Simple Look, Premium Jewellery',
  announcementText: '✨ FREE Express Home Delivery across Bangladesh on orders above 3,000 BDT! ✨',
  whatsappNumber: '+8801313840136',
  email: 'arisanbd26@gmail.com',
  facebookUrl: 'https://facebook.com/arisan.bd',
  instagramUrl: 'https://instagram.com/arisan.bd',
  tiktokUrl: 'https://tiktok.com/@arisan.bd',
  heroHeadline: 'Crafted Elegance For Every Occasion',
  heroSubheadline: 'ARISAN BD presents a curation of premium, minimalistic fashion jewellery styled for the modern lifestyle under a budget that respects your heart.',
  heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
  eidImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
  eidOfferActive: true,
  eidDiscountPercent: 20,
  headerBgColor: '#ffffff',
  headerTextColor: '#202226',
  secondaryNavBgColor: '#202226',
  secondaryNavTextColor: '#ffffff',
  buttonBgColor: '#e23e38',
  buttonTextColor: '#ffffff',
  adminEmail: 'jesanbinary07@gmail.com',
  adminPassword: 'jesan2026',
  deliveryChargeInsideDhaka: 80,
  deliveryChargeOutsideDhaka: 150,
  freeDeliveryThreshold: 3000,
  
  // Font defaults
  fontFamily: 'Inter',
  fontSizeScale: 'normal',
  customCSS: '',
  translationOverrides: {
    en: {},
    bn: {}
  },
  
  // Button design style defaults
  btnBorderRadius: 'md',
  btnPaddingStyle: 'normal',
  btnShadowStyle: 'soft',
  
  // Layout defaults
  mobileStickyCart: true,
  hideHeroOnMobile: false,
  hideEidSectionOnMobile: false,
  mobileFontSizeScale: 'normal',
  
  // Custom section background & text colors
  bodyBgColor: '#f6f7f9',
  bodyTextColor: '#202226',
  heroBgColor: '#f6f7f9',
  heroTextColor: '#202226',
  categoriesBgColor: '#ffffff',
  categoriesTextColor: '#202226',
  bestsellersBgColor: '#ffffff',
  bestsellersTextColor: '#202226',
  newArrivalsBgColor: '#f6f7f9',
  newArrivalsTextColor: '#202226',
  eidSectionBgColor: '#064e3b',
  eidSectionTextColor: '#ffffff',
  footerBgColor: '#1c1e21',
  footerTextColor: '#ebeef2',
  newsletterBgColor: '#064e3b',
  newsletterTextColor: '#ffffff'
};

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Comilla', 'Cox\'s Bazar', 'Bogra', 'Jessore', 'Feni', 'Tangail'
];
