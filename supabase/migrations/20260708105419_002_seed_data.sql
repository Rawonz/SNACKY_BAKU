/*
# Seed Data for Snacky Restaurant

Inserts default data for:
- 3 languages (AZ, TR, EN)
- 7 days of opening hours
- Default restaurant settings
- Global extras (cheese, sauce, fries, large portion)
- Sample categories (Burgers, Combos, Sides, Drinks, Desserts)
- Sample products with translations
- Sample testimonials
- Sample gallery images
*/

-- Insert default languages
INSERT INTO languages (code, name, native_name, flag_emoji) VALUES
  ('az', 'Azerbaijani', 'Azərbaycan', '🇦🇿'),
  ('tr', 'Turkish', 'Türkçe', '🇹🇷'),
  ('en', 'English', 'English', '🇬🇧')
ON CONFLICT (code) DO NOTHING;

-- Insert default opening hours (Mon-Sun, 0-6)
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '10:00', '22:00', false),
  (1, '10:00', '22:00', false),
  (2, '10:00', '22:00', false),
  (3, '10:00', '22:00', false),
  (4, '10:00', '23:00', false),
  (5, '10:00', '23:00', false),
  (6, '11:00', '21:00', false)
ON CONFLICT (day_of_week) DO NOTHING;

-- Insert default restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value) VALUES
  ('restaurant_name', 'Snacky'),
  ('restaurant_tagline', 'Premium Fast Food'),
  ('phone', '+994 50 123 45 67'),
  ('whatsapp', '+994501234567'),
  ('email', 'info@snacky.az'),
  ('address', 'Baku, Azerbaijan'),
  ('address_full', '28 May Street, Baku, Azerbaijan, AZ1000'),
  ('instagram', 'https://instagram.com/snacky'),
  ('facebook', 'https://facebook.com/snacky'),
  ('tiktok', 'https://tiktok.com/@snacky'),
  ('delivery_fee', '500'),
  ('free_delivery_min', '3000'),
  ('currency', 'AZN'),
  ('currency_symbol', '₼')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert global extras
INSERT INTO product_extras (is_global, slug, price, sort_order) VALUES
  (true, 'extra-cheese', 150, 1),
  (true, 'extra-sauce', 100, 2),
  (true, 'extra-fries', 200, 3),
  (true, 'large-portion', 300, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (slug, image_url, sort_order) VALUES
  ('burgers', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 1),
  ('combos', 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg', 2),
  ('sides', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 3),
  ('drinks', 'https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', 4),
  ('desserts', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 5)
ON CONFLICT (slug) DO NOTHING;