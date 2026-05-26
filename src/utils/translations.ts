/**
 * ARISAN BD - Clean Bilingual Translation Engine
 */

import { Product } from '../types';

export const translations = {
  en: {
    // Nav & Tabs
    "nav.home": "Home",
    "nav.shop": "Shop (Filter Jewels)",
    "nav.aboutUs": "About Us",
    "nav.aboutOwner": "About Owner",
    "nav.contactUs": "Contact Us",
    "nav.faq": "Support Center & FAQ",
    "nav.trackOrder": "Track Order",
    "nav.trackStatus": "Track Order Status",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.searchPlaceholder": "Search royal bangles, emerald rings...",
    "nav.cart": "Cart",
    "nav.admin": "Admin Dashboard",
    "nav.forgotId": "Forgot ID? (Find by Mobile)",
    "nav.trackStatusShort": "Track Status",

    // Common Buttons
    "btn.shopNow": "Shop Now",
    "btn.addToCart": "Add To Cart",
    "btn.buyNow": "Order Now",
    "btn.orderNow": "Order Now",
    "btn.viewDetails": "View Details",
    "btn.checkout": "Proceed to Checkout",
    "btn.apply": "Apply",
    "btn.track": "Track Status",
    "btn.backToShop": "Back to Shop",
    "btn.placeOrder": "Confirm Order (অর্ডার কনফার্ম করুন)",
    "btn.submitting": "Processing...",
    "btn.trace": "Trace",
    "btn.find": "Find",

    // Product items
    "prod.bestseller": "Best Seller",
    "prod.featured": "Featured",
    "prod.newarrival": "New Arrival",
    "prod.instock": "In Stock",
    "prod.lowstock": "Low Stock",
    "prod.outofstock": "Out of Stock",
    "prod.reviews": "Reviews",
    "prod.sizes": "Sizes",
    "prod.colors": "Colors",
    "prod.quantity": "Quantity",
    "prod.price": "Price",
    "prod.originalPrice": "Original Price",

    // Banner & Headers
    "home.heroTitle": "Crafted Elegance For Every Occasion",
    "home.heroSubtitle": "ARISAN BD presents a curation of premium, minimalistic fashion jewellery styled for the modern lifestyle under a budget that respects your heart.",
    "home.announcement": "✨ FREE Express Home Delivery across Bangladesh on orders above 3,000 BDT! ✨",
    "home.categoriesTitle": "Curated Collections",
    "home.categoriesSubtitle": "Handcrafted to perfection matching your everyday simplicity.",
    "home.bestsellersTitle": "Best Selling Masterpieces",
    "home.bestsellersSubtitle": "Most loved by thousand of Bengali modern women.",
    "home.newArrivalsTitle": "New Arrivals",
    "home.newArrivalsSubtitle": "Freshly crafted pristine designs added this week.",

    // Cart Details
    "cart.title": "Your Luxury Cart",
    "cart.items": "Items in your bag",
    "cart.summary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Delivery Charge",
    "cart.discount": "Discount Coupon",
    "cart.total": "Total Amount",
    "cart.empty": "Your cart is quite empty",
    "cart.emptyNotice": "Explore our rich royalty collections to add luxurious sparkles here!",
    "cart.shippingNotice": "We deliver all over Bangladesh with pristine bubble-wrap protection.",
    "cart.expressShipping": "Standard Home Delivery",
    "cart.freeShipping": "Free Delivery (Promo)",

    // Checkout Details
    "checkout.title": "Express Secure Checkout",
    "checkout.subtitle": "Fill in details to confirm your COD/Prepaid order in 30 seconds",
    "checkout.formTitle": "Billing & Shipping Destination",
    "checkout.fullname": "Full Name",
    "checkout.fullnamePlaceholder": "e.g. Ayesha Rahman",
    "checkout.phone": "Mobile Number",
    "checkout.phonePlaceholder": "e.g. 017XXXXXXXX (Active Mobile Number)",
    "checkout.email": "Email Address",
    "checkout.address": "Full Delivery Address",
    "checkout.addressPlaceholder": "Road No, House No, Area Name...",
    "checkout.district": "District / Zila",
    "checkout.city": "City / Thana",
    "checkout.cityPlaceholder": "e.g. Dhanmondi or Mirpur",
    "checkout.deliveryOption": "Delivery Coverage Area",
    "checkout.insideDhaka": "Inside Dhaka (৳80 BDT)",
    "checkout.outsideDhaka": "Outside Dhaka (৳150 BDT)",
    "checkout.coupon": "Coupon / Promo Discount",
    "checkout.couponPlaceholder": "Enter Code (e.g. EID2026)",
    "checkout.paymentMethod": "Select Payment Method",
    "checkout.cod": "Cash On Delivery (হাতে পেয়ে টাকা পরিশোধ)",
    "checkout.bkash": "bKash (বিকাশ সেন্ড মানি)",
    "checkout.nagad": "Nagad (নগদ সেন্ড মানি)",
    "checkout.prepaymentNotice": "Please send money to our official wallet and upload screenshot below & Transaction ID:",
    "checkout.screenshot": "Upload Payment Receipt Proof Screenshot",
    "checkout.txId": "bKash / Nagad Transaction ID",
    "checkout.policyNotice": "By placing an order, you agree to our 3-days replacement policy and genuine quality pledge.",
    "checkout.success": "Order Placed Successfully!",
    "checkout.successSubtitle": "Thank you for shopping with ARISAN BD. Our team will call you shortly to confirm.",
    "checkout.orderId": "Your Order Reference ID",
    "checkout.saveIdNotice": "Please save this ID to trace your parcel courier status later.",

    // Support & FAQ
    "support.title": "Customer Help Desk",
    "support.subtitle": "Frequently Asked Questions & Support Tickets",

    // Tracking
    "track.title": "Real-time Trace System",
    "track.subtitle": "Track coordinates and delivery updates of your precious box",
    "track.searchMethodId": "Track Status (Order ID)",
    "track.searchMethodPhone": "Forgot ID? (Find by Mobile)",
    "track.placeholderId": "e.g. ARISAN-123456 or TRACK-...",
    "track.placeholderPhone": "e.g. 017XXXXXXXX or Customer Name",
    "track.btnTrace": "Trace",
    "track.btnFind": "Find",
    "track.idLabel": "Enter Order ID or Courier Tracking #",
    "track.phoneLabel": "Enter Mobile Number or Customer Name",
    "track.recentHistory": "Your Recent Ordered History",
    "track.deviceCache": "Your Device Cache",
    "track.recipient": "Recipient",
    "track.orderStatus": "Order Status",
    "track.placedOn": "Placed On",
    "track.deliveryCourier": "Delivery Courier Partner",
    "track.shippedVia": "Shipped via Steadfast / Pathao Express",
    "track.estDelivery": "Est. Delivery",
    "track.orderSummary": "Order Summary",
    "track.notFound": "Order ID Not Found",
    "track.notFoundSubtitle": "Please verify your code. Standard processing takes 1-2 hours to sync with Bangladeshi logistics hubs."
  },
  bn: {
    // Nav & Tabs
    "nav.home": "হোম",
    "nav.shop": "সব জুয়েলারি (কিনুন)",
    "nav.aboutUs": "আমাদের সম্পর্কে",
    "nav.aboutOwner": "প্রতিষ্ঠাতাদের কথা",
    "nav.contactUs": "যোগাযোগ",
    "nav.faq": "সহায়তা ও এফএকিউ",
    "nav.trackOrder": "অর্ডার ট্র্যাক",
    "nav.trackStatus": "অর্ডার ট্র্যাকিং",
    "nav.login": "লগইন",
    "nav.logout": "লগআউট",
    "nav.searchPlaceholder": "রয়্যাল চুড়ি, এমারেল্ড আংটি খুঁজুন...",
    "nav.cart": "কার্ট (ব্যাগ)",
    "nav.admin": "এডমিন ড্যাশবোর্ড",
    "nav.forgotId": "আইডি ভুলে গেছেন? (মোবাইল দিয়ে খোঁজুন)",
    "nav.trackStatusShort": "ট্র্যাক করুন",

    // Common Buttons
    "btn.shopNow": "এখনই কেনাকাটা করুন",
    "btn.addToCart": "কার্টে যোগ করুন",
    "btn.buyNow": "অর্ডার করুন",
    "btn.orderNow": "অর্ডার করুন",
    "btn.viewDetails": "বিস্তারিত দেখুন",
    "btn.checkout": "চেকআউট করুন (পরবর্তী ধাপ)",
    "btn.apply": "প্রয়োগ করুন",
    "btn.track": "ট্র্যাক করুন",
    "btn.backToShop": "আবার জুয়েলারি দেখুন",
    "btn.placeOrder": "অর্ডার কনফার্ম করুন",
    "btn.submitting": "প্রক্রিয়াকরণ হচ্ছে...",
    "btn.trace": "ট্র্যাক করুন",
    "btn.find": "খুঁজুন",

    // Product items
    "prod.bestseller": "সবচেয়ে জনপ্রিয় (Best Seller)",
    "prod.featured": "বিশেষ আকর্ষণ",
    "prod.newarrival": "নতুন কালেকশন",
    "prod.instock": "স্টকে আছে",
    "prod.lowstock": "সীমিত স্টক",
    "prod.outofstock": "স্টকে নেই",
    "prod.reviews": "রিভিউসমূহ",
    "prod.sizes": "সাইজ",
    "prod.colors": "কালার",
    "prod.quantity": "পরিমাণ",
    "prod.price": "মূল্য",
    "prod.originalPrice": "আসল মূল্য",

    // Banner & Headers
    "home.heroTitle": "প্রতিটি মুহূর্তের জন্য অভিজাত জুয়েলারি",
    "home.heroSubtitle": "ARISAN BD নিয়ে এসেছে অত্যন্ত প্রিমিয়াম এবং ট্রেন্ডি ফ্যাশন জুয়েলারি কালেকশন, যা আপনার প্রতিদিনের সাধারণ রূপকেও করে তুলবে অনন্য এবং রাজকীয়।",
    "home.announcement": "✨ ৩,০০০ টাকার বেশি অর্ডারে সারা বাংলাদেশে ফ্রী ক্যাশ অন ডেলিভারি! ✨",
    "home.categoriesTitle": "আমাদের ক্যাটাগরিসমূহ",
    "home.categoriesSubtitle": "আপনার প্রতিদিনের ছিমছাম সাজের জন্য নিখুঁত কারুকাজ সম্পন্ন গহনা।",
    "home.bestsellersTitle": "সেরা বিক্রিত চমৎকার গহনা",
    "home.bestsellersSubtitle": "হাজারো আধুনিক নারীর সবচেয়ে পছন্দের এবং নির্ভরযোগ্য জুয়েলারি ডিজাইন।",
    "home.newArrivalsTitle": "নতুন কালেকশন সমূহ",
    "home.newArrivalsSubtitle": "চলতি সপ্তাহের সবচেয়ে লেটেস্ট ও অভিজাত সব ডিজাইনসমূহ দেখে নিন।",

    // Cart Details
    "cart.title": "আপনার শপিং ব্যাগ",
    "cart.items": "ব্যাগে থাকা আইটেমসমূহ",
    "cart.summary": "অর্ডার মেমো (বিল হিসাব)",
    "cart.subtotal": "উপমোট (পণ্যমূল্য)",
    "cart.shipping": "ডেলিভারি চার্জ",
    "cart.discount": "কুপন ডিসকাউন্ট",
    "cart.total": "সর্বমোট বিল",
    "cart.empty": "আপনার কার্ট একদম খালি!",
    "cart.emptyNotice": "আমাদের রাজকীয় গাউন ও স্পার্কলিং অরনামেন্ট কালেকশন দেখতে শপ পেইজে ঘুরে আসুন এবং আপনার ব্যাগ সাজান!",
    "cart.shippingNotice": "আমরা সারা বাংলাদেশে বাবল র‍্যাপ প্রটেকশন সহ শতভাগ নিরাপদে হোম ডেলিভারি নিশ্চিত করি।",
    "cart.expressShipping": "হোম ডেলিভারি",
    "cart.freeShipping": "ফ্রী ডেলিভারি (ফ্রি অফার)",

    // Checkout Details
    "checkout.title": "দ্রুত ও নিরাপদ চেকআউট",
    "checkout.subtitle": "মাত্র ৩০ সেকেন্ডে আপনার অর্ডারটি সম্পূর্ণ করতে নিচের তথ্যগুলো পূরণ করুন",
    "checkout.formTitle": "ডেলিভারি ঠিকানা ও তথ্য",
    "checkout.fullname": "আপনার সম্পূর্ণ নাম",
    "checkout.fullnamePlaceholder": "যেমনঃ আয়েশা রহমান",
    "checkout.phone": "সচল মোবাইল নম্বর",
    "checkout.phonePlaceholder": "যেমনঃ 017XXXXXXXX (অর্ডারের বিষয়ে কল দেওয়া হবে)",
    "checkout.email": "ইমেইল এড্রেস",
    "checkout.address": "আপনার সম্পূর্ণ ঠিকানা",
    "checkout.addressPlaceholder": "গ্রাম/রোড নং, বাসা নম্বর, এলাকার নাম ইত্যাদি লিখে দিন...",
    "checkout.district": "জেলা (District)",
    "checkout.city": "শহর / থানা (Thana)",
    "checkout.cityPlaceholder": "যেমনঃ ধানমন্ডি বা মিরপুর",
    "checkout.deliveryOption": "ডেলিভারি অঞ্চল",
    "checkout.insideDhaka": "ঢাকার ভিতরে (৳৮০ টাকা)",
    "checkout.outsideDhaka": "ঢাকার বাইরে (৳১৫০ টাকা)",
    "checkout.coupon": "ডিসকাউন্ট কুপন কোড (যদি থাকে)",
    "checkout.couponPlaceholder": "কোড দিন (যেমনঃ EID2026)",
    "checkout.paymentMethod": "পেমেন্ট মাধ্যম সিলেক্ট করুন",
    "checkout.cod": "ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা পরিশোধ)",
    "checkout.bkash": "বিকাশ (bKash Send Money)",
    "checkout.nagad": "নগদ (Nagad Send Money)",
    "checkout.prepaymentNotice": "দয়া করে আমাদের অফিশিয়াল ওয়ালেট নম্বরে টাকা পাঠিয়ে নিচে ট্রানজেকশন আইডি এবং স্ক্রিনশট আপলোড দিনঃ",
    "checkout.screenshot": "পেমেন্ট স্ক্রিনশট বা প্রুফ আপলোড দিন",
    "checkout.txId": "বিকাশ বা নগদ ট্রানজেকশন আইডি (TxID)",
    "checkout.policyNotice": "অর্ডার প্লেস করার মাধ্যমে আপনি আমাদের ৩ দিনের এক্সচেঞ্জ বা রিপ্লেসমেন্ট পলিসির সাথে একমত পোষণ করছেন।",
    "checkout.success": "অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!",
    "checkout.successSubtitle": "আরেজান বিডি থেকে কেনাকাটা করার জন্য ধন্যবাদ। অর্ডার কনফার্মেশনের জন্য আমাদের প্রতিনিধি খুব শীঘ্রই আপনাকে কল দেবেন।",
    "checkout.orderId": "আপনার অর্ডার রেফারেন্স আইডি",
    "checkout.saveIdNotice": "পরবর্তীতে আপনার পার্সেল ট্র্যাক করতে বা খোঁজ নিতে এই আইডিটি সংরক্ষণ করুন।",

    // Support & FAQ
    "support.title": "গ্রাহক সহায়তা কেন্দ্র",
    "support.subtitle": "সাধারণ জিজ্ঞাসা এবং তাৎক্ষণিক হোয়াটসঅ্যাপ সাপোর্ট পোর্টাল",

    // Tracking
    "track.title": "লাইভ অর্ডার ট্র্যাকিং সিস্টেম",
    "track.subtitle": "আপনার প্রিয় জুয়েলারি সমৃদ্ধ বক্সটির বর্তমান ডেলিভারি অবস্থা দেখুন",
    "track.searchMethodId": "অর্ডার আইডি দিয়ে ট্র্যাকিং",
    "track.searchMethodPhone": "আইডি ভুলে গেছেন? (মোবাইল দিয়ে অনুসন্ধান)",
    "track.placeholderId": "যেমনঃ ARISAN-123456 বা TRACK-...",
    "track.placeholderPhone": "যেমনঃ 017XXXXXXXX বা গ্রাহকের নাম",
    "track.btnTrace": "ট্র্যাক করুন",
    "track.btnFind": "অনুসন্ধান",
    "track.idLabel": "অর্ডার আইডি বা কুরিয়ার ট্র্যাকিং নং দিন",
    "track.phoneLabel": "অর্ডার করার সময় ব্যবহৃত মোবাইল নং বা নাম দিন",
    "track.recentHistory": "আপনার পূর্ববর্তী অর্ডার হিস্ট্রি",
    "track.deviceCache": "আপনার ডিভাইস হিস্ট্রি",
    "track.recipient": "প্রাপক",
    "track.orderStatus": "অর্ডারের অবস্থা",
    "track.placedOn": "অর্ডার করার তারিখ",
    "track.deliveryCourier": "কুরিয়ার এবং শিপিং পার্টনার",
    "track.shippedVia": "স্টেডফাস্ট বা পাঠাও এক্সপ্রেসের মাধ্যমে পাঠানো হয়েছে",
    "track.estDelivery": "সম্ভাব্য ডেলিভারি সময়",
    "track.orderSummary": "অর্ডারে থাকা গহনা সমূহ",
    "track.notFound": "অর্ডার আইডি খুঁজে পাওয়া যায়নি",
    "track.notFoundSubtitle": "অনুগ্রহ করে আপনার দেওয়া অর্ডার আইডি পুনরায় ভালো করে দেখুন। সাধারণত অর্ডার ডাটাবেজে আপডেট হতে ১-২ ঘণ্টা সময় লাগতে পারে।"
  }
};

const PRODUCT_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'prod-emerald-royale': {
    title: 'এমারেল্ড রয়্যাল আংটি (Emerald Royale Ring)',
    desc: 'একটি চমৎকার নকশাকৃত রাজকীয় আংটি যাতে রয়েছে ২.৫ ক্যারেটের গহীন কলম্বিয়ান পান্না (Emerald), এবং চারপাশে বসানো নিখুঁত ডায়মন্ড কাট খণ্ড। ১৮ ক্যারেট সলিড গোল্ড প্লেটেড এই রিংটি দেবে এক অনন্য আভিজাত্যের অনুভূতি।'
  },
  'prod-empress-choker': {
    title: 'এম্প্রেস এমারেল্ড চোকার (Empress Emerald Choker)',
    desc: 'অভিজাতদের জন্য তৈরি একটি অনবদ্য শিল্পকর্ম। ২২ ক্যারেট হলুদ সোনার চেইনের সাথে ঝুলে থাকা আটটি চমৎকার টিয়ারড্রপ পান্না পাথরের কারুকাজ। আপনার গলার লকেটের সাথে স্বাচ্ছন্দ্যে পরার উপযোগী ডিজাইন।'
  },
  'prod-elixir-drops': {
    title: 'এলিক্সির এমারেল্ড ইয়াররিংস (Elixir Emerald Drops)',
    desc: 'এই ঝুলন্ত কানের দুলজোড়া প্রতিটি পদক্ষেপে ছড়িয়ে দেবে আভিজাত্য। উজ্জ্বল হলুদ সোনার ওপর বসানো কুশন-কাট প্রিমিয়াম গ্রেডের উজ্জ্বল প্রাকৃতিক পান্না সিন্থেটিক রেসিন দিয়ে তৈরি।'
  },
  'prod-aurum-bangle': {
    title: 'অরাম মিনিমাল চুড়ি/বালা (Aurum Minimal Bangle)',
    desc: 'আমাদের "সিম্পল লুক, প্রিমিয়াম জুয়েলারি" ধারণার এক অনবদ্য সৃষ্টি হাতের পলিশ করা এই বালা। ভেতরের অংশে রয়েছে নিখুঁত জ্যামিতিক নকশার ছোঁয়া। প্রতিদিনের সাধারণ ও ট্রেন্ডি ব্যবহারের জন্য পারফেক্ট।'
  },
  'prod-sovereign-pendant': {
    title: 'সভেরিন রেডিয়েন্ট লকেট (Sovereign Radiant Pendant)',
    desc: 'রেক্টেঙ্গেল কাট ডিপ গ্রিন ল্যাবরেটরি থেকে সংগৃহীত পান্না যা রোপ চেইনে ঝোলানো। আমাদের ঐতিহ্যবাহী জমকালো শাড়ি এবং আধুনিক সব পোশাকেরই সৌন্দর্যের মাত্রা বাড়িয়ে দেয়।'
  },
  'prod-gilded-leaf': {
    title: 'গিল্ডেড ফার্ন ব্রেসলেট (Gilded Fern Cuff)',
    desc: 'প্রাকৃতিক পাতার জ্যামিতিক নকশায় অনুপ্রাণিত, এই ব্রেসলেটটি অত্যন্ত চমৎকার যার ওপরে ক্ষুদ্র ক্ষুদ্র সবুজ পান্না রত্ন অত্যন্ত নিখুঁতভাবে বসানো হয়েছে যা আপনার হাতের শোভাবর্ধন করবে।'
  },
  'prod-zenith-studs': {
    title: 'জেনিত জিওমেট্রিক কানের টপ (Zenith Geometric Studs)',
    desc: 'নিখুঁত হেক্সাগোনাল হ্যালো জ্যামিতিক প্যাটার্নে সাজানো ক্ষুদ্র এমারেল্ড ক্রিস্টাল সমৃদ্ধ কানের টপ। আমাদের ব্র্যান্ডের প্রতিটি গহনার পেছনের স্লোগানই হলোঃ ভারী বা অতিরিক্ত গাদাগাদি ছাড়া সাবলীল সাধারণ আভিজাত্য।'
  }
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'rings': 'আংটি (Rings)',
  'necklaces': 'নেকলেস (Necklaces)',
  'earrings': 'কানের দুল (Earrings)',
  'bracelets': 'চুড়ি ও ব্রেসলেট (Bracelets)',
  'Rings': 'আংটি (Rings)',
  'Necklaces': 'নেকলেস (Necklaces)',
  'Earrings': 'কানের দুল (Earrings)',
  'Bracelets': 'চুড়ি ও ব্রেসলেট (Bracelets)',
  'Royalty Rings': 'আংটি (Rings)',
  'Luxurious Necklaces': 'নেকলেস (Necklaces)',
  'Elixir Earrings': 'কানের দুল (Earrings)',
  'Gilded Bracelets': 'চুড়ি ও ব্রেসলেট (Bracelets)'
};

export function getTranslatedProduct(product: Product, lang: 'bn' | 'en'): Product {
  if (lang === 'en') return product;
  const translation = PRODUCT_TRANSLATIONS[product.id];
  if (translation) {
    return {
      ...product,
      title: translation.title,
      description: translation.desc,
      category: CATEGORY_TRANSLATIONS[product.category] || product.category
    };
  }
  return {
    ...product,
    category: CATEGORY_TRANSLATIONS[product.category] || product.category
  };
}

export function getTranslatedCategoryName(catName: string, lang: 'bn' | 'en'): string {
  if (lang === 'en') return catName;
  return CATEGORY_TRANSLATIONS[catName] || catName;
}

export function getTranslation(key: string, lang: 'bn' | 'en'): string {
  const dict = translations[lang] || translations['en'];
  return (dict as any)[key] || (translations['en'] as any)[key] || key;
}
