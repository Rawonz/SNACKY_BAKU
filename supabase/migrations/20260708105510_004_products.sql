/*
# Sample Products

Adds sample products for each category with:
- Product details (price, calories, nutrition)
- Translations in AZ, TR, EN
- Ingredients
*/

-- Get category IDs
DO $$
DECLARE
  burger_cat uuid;
  combo_cat uuid;
  side_cat uuid;
  drink_cat uuid;
  dessert_cat uuid;
BEGIN
  SELECT id INTO burger_cat FROM categories WHERE slug = 'burgers';
  SELECT id INTO combo_cat FROM categories WHERE slug = 'combos';
  SELECT id INTO side_cat FROM categories WHERE slug = 'sides';
  SELECT id INTO drink_cat FROM categories WHERE slug = 'drinks';
  SELECT id INTO dessert_cat FROM categories WHERE slug = 'desserts';

  -- BURGERS
  INSERT INTO products (category_id, slug, image_url, gallery_images, price, calories, protein, carbs, fat, is_featured, is_popular) VALUES
    (burger_cat, 'classic-burger', 'https://images.pexels.com/photos/1561759/pexels-photo-1561759.jpeg', 
     ARRAY['https://images.pexels.com/photos/1561759/pexels-photo-1561759.jpeg', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'], 
     950, 650, 35.5, 45.0, 32.0, true, true),
    (burger_cat, 'double-cheese', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 
     ARRAY['https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 'https://images.pexels.com/photos/1561759/pexels-photo-1561759.jpeg'], 
     1250, 850, 52.0, 48.0, 45.0, true, true),
    (burger_cat, 'bbq-bacon', 'https://images.pexels.com/photos/1556628/pexels-photo-1556628.jpeg', 
     ARRAY['https://images.pexels.com/photos/1556628/pexels-photo-1556628.jpeg'], 
     1350, 920, 48.0, 52.0, 48.0, false, true),
    (burger_cat, 'spicy-chicken', 'https://images.pexels.com/photos/16270550/pexels-photo-16270550.jpeg', 
     ARRAY['https://images.pexels.com/photos/16270550/pexels-photo-16270550.jpeg'], 
     1050, 580, 32.0, 42.0, 28.0, true, false),
    (burger_cat, 'veggie-delight', 'https://images.pexels.com/photos/15276072/pexels-photo-15276072.jpeg', 
     ARRAY['https://images.pexels.com/photos/15276072/pexels-photo-15276072.jpeg'], 
     850, 420, 18.0, 55.0, 16.0, false, false)
  ON CONFLICT (slug) DO NOTHING;

  -- COMBOS
  INSERT INTO products (category_id, slug, image_url, gallery_images, price, calories, is_featured, is_popular) VALUES
    (combo_cat, 'classic-combo', 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg', 
     ARRAY['https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg'], 
     1500, 1250, true, true),
    (combo_cat, 'double-combo', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 
     ARRAY['https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'], 
     1800, 1550, true, true),
    (combo_cat, 'family-combo', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 
     ARRAY['https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'], 
     3500, 3200, false, true)
  ON CONFLICT (slug) DO NOTHING;

  -- SIDES
  INSERT INTO products (category_id, slug, image_url, price, calories, is_popular) VALUES
    (side_cat, 'french-fries', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 350, 380, true),
    (side_cat, 'onion-rings', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 400, 420, false),
    (side_cat, 'chicken-nuggets', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 550, 480, true),
    (side_cat, 'mozzarella-sticks', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 450, 350, false)
  ON CONFLICT (slug) DO NOTHING;

  -- DRINKS
  INSERT INTO products (category_id, slug, image_url, price, calories, is_popular) VALUES
    (drink_cat, 'cola', 'https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', 200, 140, true),
    (drink_cat, 'fresh-lemonade', 'https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', 250, 120, true),
    (drink_cat, 'milkshake-chocolate', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 450, 480, true),
    (drink_cat, 'milkshake-strawberry', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 450, 460, false),
    (drink_cat, 'iced-tea', 'https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', 200, 80, false)
  ON CONFLICT (slug) DO NOTHING;

  -- DESSERTS
  INSERT INTO products (category_id, slug, image_url, price, calories, is_popular) VALUES
    (dessert_cat, 'chocolate-cake', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 450, 420, true),
    (dessert_cat, 'apple-pie', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 350, 380, false),
    (dessert_cat, 'ice-cream-sundae', 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 400, 350, true)
  ON CONFLICT (slug) DO NOTHING;
END $$;