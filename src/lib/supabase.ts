import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Key from environment, with hardcoded developer fallbacks
// so that the AI Studio live preview is instantly functional.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://gqqwplaqlqrwweovrece.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcXdwbGFxbHFyd3dlb3ZyZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODY4MTAsImV4cCI6MjA5NTQ2MjgxMH0.VN9HQsvgqSMfH1CImR6LDiNFhjU3A1HuKRk5ZAkpZhk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Flag to track Supabase connection health dynamically
export interface SupabaseHealth {
  connected: boolean;
  errorMsg: string | null;
  tableStatus: {
    products: boolean;
    categories: boolean;
    orders: boolean;
    coupons: boolean;
    reviews: boolean;
    settings: boolean;
    customers: boolean;
  };
}

/**
 * Checks connection health and table readiness
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const health: SupabaseHealth = {
    connected: true,
    errorMsg: null,
    tableStatus: {
      products: false,
      categories: false,
      orders: false,
      coupons: false,
      reviews: false,
      settings: false,
      customers: false,
    }
  };

  try {
    // Check products table
    const { error: pErr } = await supabase.from('arisan_products').select('id').limit(1);
    health.tableStatus.products = !pErr;

    // Check categories table
    const { error: catErr } = await supabase.from('arisan_categories').select('id').limit(1);
    health.tableStatus.categories = !catErr;

    // Check orders table
    const { error: ordErr } = await supabase.from('arisan_orders').select('id').limit(1);
    health.tableStatus.orders = !ordErr;

    // Check coupons table
    const { error: coupErr } = await supabase.from('arisan_coupons').select('id').limit(1);
    health.tableStatus.coupons = !coupErr;

    // Check reviews table
    const { error: revErr } = await supabase.from('arisan_reviews').select('id').limit(1);
    health.tableStatus.reviews = !revErr;

    // Check settings table
    const { error: setErr } = await supabase.from('arisan_settings').select('id').limit(1);
    health.tableStatus.settings = !setErr;

    // Check customers table
    const { error: custErr } = await supabase.from('arisan_customers').select('id').limit(1);
    health.tableStatus.customers = !custErr;

    // Supabase compiles as connected if at least one query didn't throw network level error
    const anyTableSucceeded = Object.values(health.tableStatus).some(status => status === true);
    if (!anyTableSucceeded) {
      // If we got distinct "relation does not exist" errors, we are connected to Supabase, but schema is uninitialized
      // Let's check if the client URL resolves correctly
      const { data, error } = await supabase.from('arisan_products').select('id').limit(1);
      if (error && error.message.includes('fetch')) {
        health.connected = false;
        health.errorMsg = 'Network failed. Could not query Supabase.';
      } else {
        health.connected = true;
        health.errorMsg = 'Connected, but tables are missing in database. Please apply the SQL Schema below.';
      }
    }
  } catch (err: any) {
    health.connected = false;
    health.errorMsg = err.message || 'Supabase setup validation failed.';
  }

  return health;
}

// SQL Schema for users to run in their Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- =================================================================================
-- ARISAN BD JEWELERS - COMPLETE SUPABASE SCHEMATIC DATABASE SETUP WITH DEMO VALUES
-- =================================================================================
-- Copy and paste this complete block into your Supabase Dashboard SQL Editor
-- (https://supabase.com -> Project -> SQL Editor -> New Query) and click Run.

-- 1. Create table for Products
CREATE TABLE IF NOT EXISTS arisan_products (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_products;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_products;
CREATE POLICY "Public Read Access" ON arisan_products FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_products FOR ALL USING (true) WITH CHECK (true);

-- 2. Create table for Categories
CREATE TABLE IF NOT EXISTS arisan_categories (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_categories;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_categories;
CREATE POLICY "Public Read Access" ON arisan_categories FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_categories FOR ALL USING (true) WITH CHECK (true);

-- 3. Create table for Orders
CREATE TABLE IF NOT EXISTS arisan_orders (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_orders;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_orders;
CREATE POLICY "Public Read Access" ON arisan_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_orders FOR ALL USING (true) WITH CHECK (true);

-- 4. Create table for Coupons
CREATE TABLE IF NOT EXISTS arisan_coupons (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_coupons;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_coupons;
CREATE POLICY "Public Read Access" ON arisan_coupons FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_coupons FOR ALL USING (true) WITH CHECK (true);

-- 5. Create table for Reviews
CREATE TABLE IF NOT EXISTS arisan_reviews (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_reviews;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_reviews;
CREATE POLICY "Public Read Access" ON arisan_reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_reviews FOR ALL USING (true) WITH CHECK (true);

-- 6. Create table for Website settings
CREATE TABLE IF NOT EXISTS arisan_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_settings;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_settings;
CREATE POLICY "Public Read Access" ON arisan_settings FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Create table for Customer accounts
CREATE TABLE IF NOT EXISTS arisan_customers (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE arisan_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON arisan_customers;
DROP POLICY IF EXISTS "Public Insert/Update/Delete Access" ON arisan_customers;
CREATE POLICY "Public Read Access" ON arisan_customers FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Access" ON arisan_customers FOR ALL USING (true) WITH CHECK (true);


-- ==========================================
-- SEED DATA ENTRY (প্রাথমিক ডেমো ডাটাবেজ ইন্সার্ট)
-- ==========================================

-- A. Populating Categories
INSERT INTO arisan_categories (id, data) VALUES
('cat-rings', '{"id": "cat-rings", "name": "Royalty Rings", "slug": "rings", "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"}'::jsonb),
('cat-necklaces', '{"id": "cat-necklaces", "name": "Luxurious Necklaces", "slug": "necklaces", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"}'::jsonb),
('cat-earrings', '{"id": "cat-earrings", "name": "Elixir Earrings", "slug": "earrings", "image": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop"}'::jsonb),
('cat-bracelets', '{"id": "cat-bracelets", "name": "Gilded Bracelets", "slug": "bracelets", "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- B. Populating Coupons
INSERT INTO arisan_coupons (id, data) VALUES
('EID2026', '{"code": "EID2026", "value": 15, "isActive": true, "minSpend": 2000, "discountType": "Percentage"}'::jsonb),
('ARISANGOLD', '{"code": "ARISANGOLD", "value": 500, "isActive": true, "minSpend": 5000, "discountType": "Fixed"}'::jsonb),
('FIRSTLOVE', '{"code": "FIRSTLOVE", "value": 10, "isActive": true, "minSpend": 1000, "discountType": "Percentage"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- C. Populating Products
INSERT INTO arisan_products (id, data) VALUES
('prod-emerald-royale', '{"id": "prod-emerald-royale", "title": "Emerald Royale Ring", "description": "An exquisitely structured ring featuring a 2.5-carat pear-cut deep Colombian Emerald, flanked by brilliant-cut micro diamonds. Plated in majestic 18K solid gold, this makes a bold statement of timeless luxury.", "price": 3200, "discountPrice": 2450, "category": "rings", "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 45, "sizes": ["6", "7", "8", "9"], "colors": ["Emerald Gold", "Silver Diamond"], "featured": true, "bestSelling": true, "newArrival": false, "rating": 4.9, "reviewsCount": 18}'::jsonb),
('prod-empress-choker', '{"id": "prod-empress-choker", "title": "Empress Emerald Choker", "description": "A masterpiece created for the elite. Eight teardrop emerald gemstones suspended from a chain intricately sculpted in 22K yellow gold. Designed for a comfortable but lavish fit around your collarbone.", "price": 8500, "discountPrice": 6990, "category": "necklaces", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 12, "sizes": ["Standard 14\\"", "Extended 16\\""], "colors": ["Imperial Gold", "Platinum Shimmer"], "featured": true, "bestSelling": false, "newArrival": true, "rating": 5.0, "reviewsCount": 24}'::jsonb),
('prod-elixir-drops', '{"id": "prod-elixir-drops", "title": "Elixir Emerald Drops", "description": "These dangling earrings reflect sophistication in every turn. Crafted with a duo of cushion-cut natural emerald synthetic resins of extremely premium grades, enclosed in high-gloss yellow gold bezels.", "price": 2600, "discountPrice": 1950, "category": "earrings", "image": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 30, "sizes": ["One Size"], "colors": ["Emerald Gold"], "featured": false, "bestSelling": true, "newArrival": false, "rating": 4.8, "reviewsCount": 14}'::jsonb),
('prod-aurum-bangle', '{"id": "prod-aurum-bangle", "title": "Aurum Minimal Bangle", "description": "A classic hand-polished sleek bangle embodying the “Simple Look, Premium Jewellery” concept. Features micro-etchings of geometric patterns along the inner circumference. Perfect for daily luxury wear.", "price": 4500, "discountPrice": 3800, "category": "bracelets", "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 22, "sizes": ["S", "M", "L"], "colors": ["22K Gold Plated", "Rose Gold Plated"], "featured": true, "bestSelling": true, "newArrival": true, "rating": 4.7, "reviewsCount": 31}'::jsonb),
('prod-sovereign-pendant', '{"id": "prod-sovereign-pendant", "title": "Sovereign Radiant Pendant", "description": "A stunning bezel-set rectangle cut deep green laboratory emerald suspended from an exquisite rope chain. Matches beautifully with both traditional Bangladeshi festive wear and contemporary attire.", "price": 3800, "discountPrice": 2990, "category": "necklaces", "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"], "stockStatus": "Low Stock", "stockCount": 5, "sizes": ["18 Inches"], "colors": ["Gold Plated"], "featured": false, "bestSelling": false, "newArrival": true, "rating": 4.9, "reviewsCount": 9}'::jsonb),
('prod-gilded-leaf', '{"id": "prod-gilded-leaf", "title": "Gilded Fern Cuff", "description": "Inspired by botanical geometry, this cuff bracelet embraces the wrist elegantly with overlapping gold ferns. Adorned with microscopic green emerald gems aligned to the master leaf veins.", "price": 5200, "discountPrice": 4200, "category": "bracelets", "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 15, "sizes": ["Adjustable Size"], "colors": ["Yellow Gold"], "featured": false, "bestSelling": true, "newArrival": false, "rating": 4.6, "reviewsCount": 11}'::jsonb),
('prod-zenith-studs', '{"id": "prod-zenith-studs", "title": "Zenith Geometric Studs", "description": "A minimal designer pair with micro emerald crystals aligned in a geometric hexagonal halo. Truly captures our brand philosophy: extremely elegant structure with zero unnecessary bulk.", "price": 1800, "discountPrice": 1450, "category": "earrings", "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop", "gallery": ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop"], "stockStatus": "In Stock", "stockCount": 60, "sizes": ["Standard Pair"], "colors": ["Gold", "Silver"], "featured": false, "bestSelling": false, "newArrival": true, "rating": 4.9, "reviewsCount": 22}'::jsonb),
('prod-royal-pearl-earrings', '{"id": "prod-royal-pearl-earrings", "title": "Royal Pearl Jhumka Earrings", "description": "Exquisite traditional golden circular dangled jhumka earrings featuring premium filigree metal patterns, clear hand-set marquise white crystal petals details on the arc, and a beautiful long hanging cascade of lustrous white pearls. Styled perfect for wedding, parties, and glamorous outfits.", "price": 450, "discountPrice": 450, "category": "earrings", "image": "/src/assets/images/royal_pearl_earrings_1779973980356.png", "gallery": ["/src/assets/images/royal_pearl_earrings_1779973980356.png"], "stockStatus": "In Stock", "stockCount": 50, "sizes": ["Standard Size"], "colors": ["Gold with Pearls"], "featured": true, "bestSelling": true, "newArrival": true, "rating": 5.0, "reviewsCount": 37}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- D. Populating Reviews
INSERT INTO arisan_reviews (id, data) VALUES
('rev-1', '{"id": "rev-1", "productTitle": "Emerald Royale Ring", "author": "Tasmia Rahman", "rating": 5, "comment": "The finishing is absolutely top-notch! The green shade looks so regal and the gold plating hasn''t faded at all after weeks of wear. Definitely buying more earrings soon!", "date": "2026-05-18", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"}'::jsonb),
('rev-2', '{"id": "rev-2", "productTitle": "Empress Emerald Choker", "author": "Farhana Akhter", "rating": 5, "comment": "Wore this choker on my Eid cousins-meetup and got endless compliments. It sits comfortably and feels very premium and heavy. ARISAN BD is indeed providing high-end quality!", "date": "2026-05-20", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"}'::jsonb),
('rev-3', '{"id": "rev-3", "productTitle": "Aurum Minimal Bangle", "author": "Samir Chowdhury", "rating": 4, "comment": "Bought this as an anniversary gift for my wife. She loved the minimalistic design. The packaging was also beautiful with a custom gold-foiled card in an emerald box.", "date": "2026-05-22", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- E. Populating Default Settings
INSERT INTO arisan_settings (id, data) VALUES
('default_settings', '{"brandName": "ARISAN BD", "tagline": "Where Every Piece Tells a Story", "announcementText": "✨ Premium Fashion Jewellery | Nationwide Delivery Available ✨", "whatsappNumber": "+8801313840136", "email": "arisanbd26@gmail.com", "facebookUrl": "https://www.facebook.com/share/18ZkTRas19/", "instagramUrl": "https://www.instagram.com/ari_san01", "tiktokUrl": "", "heroHeadline": "Elegant Jewellery for Every Occasion", "heroSubheadline": "Discover timeless beauty with premium jewellery designed to complement your unique style.", "heroImage": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop", "eidImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", "eidOfferActive": true, "eidDiscountPercent": 20, "headerBgColor": "#ffffff", "headerTextColor": "#111827", "secondaryNavBgColor": "#0B6B3A", "secondaryNavTextColor": "#ffffff", "buttonBgColor": "#0B6B3A", "buttonTextColor": "#ffffff", "adminEmail": "jesanbinary07@gmail.com", "adminPassword": "jesan2026", "deliveryChargeInsideDhaka": 80, "deliveryChargeOutsideDhaka": 150, "freeDeliveryThreshold": 3000, "fontFamily": "Inter", "fontSizeScale": "normal", "customCSS": "", "translationOverrides": {"en": {}, "bn": {}}, "btnBorderRadius": "md", "btnPaddingStyle": "normal", "btnShadowStyle": "soft", "mobileStickyCart": true, "hideHeroOnMobile": false, "hideEidSectionOnMobile": false, "mobileFontSizeScale": "normal", "bodyBgColor": "#ffffff", "bodyTextColor": "#111827", "heroBgColor": "#DDECCF", "heroTextColor": "#0B6B3A", "categoriesBgColor": "#ffffff", "categoriesTextColor": "#111827", "bestsellersBgColor": "#ffffff", "bestsellersTextColor": "#111827", "newArrivalsBgColor": "#f3f4f6", "newArrivalsTextColor": "#111827", "eidSectionBgColor": "#004b23", "eidSectionTextColor": "#ffffff", "footerBgColor": "#111827", "footerTextColor": "#ebeef2", "newsletterBgColor": "#0b6b3a", "newsletterTextColor": "#ffffff"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
`;
