/*
# Initial Schema for Snacky Restaurant - Part 1: Core Tables

Creates all tables for the restaurant website including:
- Languages and translations (i18n system)
- Categories and products (menu system)
- Orders and order items (order management)
- Coupons, banners, testimonials (content management)
- Gallery, opening hours, settings (configuration)

Security: RLS enabled on all tables with appropriate policies.
Single-tenant public app - customers don't need to sign in.
*/

-- Languages
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  native_name text NOT NULL,
  flag_emoji text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Translations
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Category translations
CREATE TABLE IF NOT EXISTS category_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  UNIQUE(category_id, language_code)
);

-- Coupons (create before products since products can reference them)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value int NOT NULL,
  min_order_amount int NOT NULL DEFAULT 0,
  max_uses int,
  current_uses int NOT NULL DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  sku text,
  image_url text,
  gallery_images text[],
  price int NOT NULL,
  calories int,
  protein decimal(5,2),
  carbs decimal(5,2),
  fat decimal(5,2),
  is_featured boolean NOT NULL DEFAULT false,
  is_popular boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  is_vegetarian boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  model_3d_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Product translations
CREATE TABLE IF NOT EXISTS product_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  UNIQUE(product_id, language_code)
);

-- Product ingredients
CREATE TABLE IF NOT EXISTS product_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- Product extras (add-ons)
CREATE TABLE IF NOT EXISTS product_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  is_global boolean NOT NULL DEFAULT false,
  slug text NOT NULL UNIQUE,
  price int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Product extra translations
CREATE TABLE IF NOT EXISTS product_extra_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extra_id uuid NOT NULL REFERENCES product_extras(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE(extra_id, language_code)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text,
  delivery_fee int NOT NULL DEFAULT 0,
  subtotal int NOT NULL,
  discount int NOT NULL DEFAULT 0,
  total int NOT NULL,
  notes text,
  coupon_id uuid REFERENCES coupons(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'whatsapp',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price int NOT NULL,
  total_price int NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Order item extras
CREATE TABLE IF NOT EXISTS order_item_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  extra_id uuid REFERENCES product_extras(id) ON DELETE SET NULL,
  extra_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price int NOT NULL,
  total_price int NOT NULL
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  video_url text,
  link_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Banner translations
CREATE TABLE IF NOT EXISTS banner_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id uuid NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title text,
  subtitle text,
  button_text text,
  UNIQUE(banner_id, language_code)
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  avatar_url text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Testimonial translations
CREATE TABLE IF NOT EXISTS testimonial_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id uuid NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  text text NOT NULL,
  UNIQUE(testimonial_id, language_code)
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  instagram_url text,
  alt_text text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Opening hours
CREATE TABLE IF NOT EXISTS opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean NOT NULL DEFAULT false,
  UNIQUE(day_of_week)
);

-- Restaurant settings
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_extra_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Languages: public read, authenticated write
DROP POLICY IF EXISTS "public_read_languages" ON languages;
CREATE POLICY "public_read_languages" ON languages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_languages" ON languages;
CREATE POLICY "auth_write_languages" ON languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Translations
DROP POLICY IF EXISTS "public_read_translations" ON translations;
CREATE POLICY "public_read_translations" ON translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_translations" ON translations;
CREATE POLICY "auth_write_translations" ON translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categories
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (deleted_at IS NULL);
DROP POLICY IF EXISTS "auth_write_categories" ON categories;
CREATE POLICY "auth_write_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Category translations
DROP POLICY IF EXISTS "public_read_category_translations" ON category_translations;
CREATE POLICY "public_read_category_translations" ON category_translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_category_translations" ON category_translations;
CREATE POLICY "auth_write_category_translations" ON category_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND is_active = true);
DROP POLICY IF EXISTS "auth_write_products" ON products;
CREATE POLICY "auth_write_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product translations
DROP POLICY IF EXISTS "public_read_product_translations" ON product_translations;
CREATE POLICY "public_read_product_translations" ON product_translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_product_translations" ON product_translations;
CREATE POLICY "auth_write_product_translations" ON product_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product ingredients
DROP POLICY IF EXISTS "public_read_product_ingredients" ON product_ingredients;
CREATE POLICY "public_read_product_ingredients" ON product_ingredients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_product_ingredients" ON product_ingredients;
CREATE POLICY "auth_write_product_ingredients" ON product_ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product extras
DROP POLICY IF EXISTS "public_read_product_extras" ON product_extras;
CREATE POLICY "public_read_product_extras" ON product_extras FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "auth_write_product_extras" ON product_extras;
CREATE POLICY "auth_write_product_extras" ON product_extras FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product extra translations
DROP POLICY IF EXISTS "public_read_product_extra_translations" ON product_extra_translations;
CREATE POLICY "public_read_product_extra_translations" ON product_extra_translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_product_extra_translations" ON product_extra_translations;
CREATE POLICY "auth_write_product_extra_translations" ON product_extra_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: anyone can insert, authenticated can manage
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_manage_orders" ON orders;
CREATE POLICY "auth_manage_orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order items
DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_manage_order_items" ON order_items;
CREATE POLICY "auth_manage_order_items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order item extras
DROP POLICY IF EXISTS "public_insert_order_item_extras" ON order_item_extras;
CREATE POLICY "public_insert_order_item_extras" ON order_item_extras FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_manage_order_item_extras" ON order_item_extras;
CREATE POLICY "auth_manage_order_item_extras" ON order_item_extras FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Coupons
DROP POLICY IF EXISTS "public_read_active_coupons" ON coupons;
CREATE POLICY "public_read_active_coupons" ON coupons FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND is_active = true);
DROP POLICY IF EXISTS "auth_manage_coupons" ON coupons;
CREATE POLICY "auth_manage_coupons" ON coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Banners
DROP POLICY IF EXISTS "public_read_banners" ON banners;
CREATE POLICY "public_read_banners" ON banners FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND is_active = true);
DROP POLICY IF EXISTS "auth_manage_banners" ON banners;
CREATE POLICY "auth_manage_banners" ON banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Banner translations
DROP POLICY IF EXISTS "public_read_banner_translations" ON banner_translations;
CREATE POLICY "public_read_banner_translations" ON banner_translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_banner_translations" ON banner_translations;
CREATE POLICY "auth_manage_banner_translations" ON banner_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Testimonials
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND is_active = true);
DROP POLICY IF EXISTS "auth_manage_testimonials" ON testimonials;
CREATE POLICY "auth_manage_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Testimonial translations
DROP POLICY IF EXISTS "public_read_testimonial_translations" ON testimonial_translations;
CREATE POLICY "public_read_testimonial_translations" ON testimonial_translations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_testimonial_translations" ON testimonial_translations;
CREATE POLICY "auth_manage_testimonial_translations" ON testimonial_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery images
DROP POLICY IF EXISTS "public_read_gallery_images" ON gallery_images;
CREATE POLICY "public_read_gallery_images" ON gallery_images FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "auth_manage_gallery_images" ON gallery_images;
CREATE POLICY "auth_manage_gallery_images" ON gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Opening hours
DROP POLICY IF EXISTS "public_read_opening_hours" ON opening_hours;
CREATE POLICY "public_read_opening_hours" ON opening_hours FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_opening_hours" ON opening_hours;
CREATE POLICY "auth_manage_opening_hours" ON opening_hours FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Restaurant settings
DROP POLICY IF EXISTS "public_read_settings" ON restaurant_settings;
CREATE POLICY "public_read_settings" ON restaurant_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_settings" ON restaurant_settings;
CREATE POLICY "auth_manage_settings" ON restaurant_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);