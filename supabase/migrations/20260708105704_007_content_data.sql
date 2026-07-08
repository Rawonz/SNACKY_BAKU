/*
# Content Data: Testimonials and Gallery

Adds sample testimonials and gallery images for the website.
*/

-- Testimonials
INSERT INTO testimonials (customer_name, avatar_url, rating) VALUES
  ('Aykhan Mammadov', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', 5),
  ('Leyla Aliyeva', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', 5),
  ('Murad Hasanov', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', 5),
  ('Gunay Karimova', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 4),
  ('Rashad Gasimov', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', 5)
ON CONFLICT DO NOTHING;

-- Testimonial translations
INSERT INTO testimonial_translations (testimonial_id, language_code, text)
SELECT id, 'az', 
  CASE customer_name 
    WHEN 'Aykhan Mammadov' THEN 'Ən yaxşı burgerlər! Hər dəfə gəldiyimdə eyni keyfiyyət. Mütəmadi olaraq gəlirəm!'
    WHEN 'Leyla Aliyeva' THEN 'Super fast delivery və dadlı yeməklər. Şokolad milkshake-i çox sevirəm!'
    WHEN 'Murad Hasanov' THEN 'Ailə menyusu üçün ən yaxşı seçim. Uşaqlar çox sevindi!'
    WHEN 'Gunay Karimova' THEN 'Vegetarian burger möhtəşəmdir! Təzə məhsullardan hazırlanır.'
    WHEN 'Rashad Gasimov' THEN 'Keyfiyyət və dad baxımından ən yaxşı fast food restoranı. Məsləhət görürəm!'
  END
FROM testimonials
ON CONFLICT DO NOTHING;

INSERT INTO testimonial_translations (testimonial_id, language_code, text)
SELECT id, 'tr', 
  CASE customer_name 
    WHEN 'Aykhan Mammadov' THEN 'En iyi burgerler! Her geldiğimde aynı kalite. Sürekli geliyorum!'
    WHEN 'Leyla Aliyeva' THEN 'Süper hızlı teslimat ve lezzetli yemekler. Çikolatalı milkshake''i çok seviyorum!'
    WHEN 'Murad Hasanov' THEN 'Aile menüsü için en iyi seçenek. Çocuklar çok sevindi!'
    WHEN 'Gunay Karimova' THEN 'Vejetaryen burger muhteşem! Taze ürünlerden yapılıyor.'
    WHEN 'Rashad Gasimov' THEN 'Kalite ve lezzet açısından en iyi fast food restoranı. Tavsiye ederim!'
  END
FROM testimonials
ON CONFLICT DO NOTHING;

INSERT INTO testimonial_translations (testimonial_id, language_code, text)
SELECT id, 'en', 
  CASE customer_name 
    WHEN 'Aykhan Mammadov' THEN 'Best burgers in town! Same quality every time I visit. I come here regularly!'
    WHEN 'Leyla Aliyeva' THEN 'Super fast delivery and delicious food. I love the chocolate milkshake!'
    WHEN 'Murad Hasanov' THEN 'Best choice for family meals. Kids were so happy!'
    WHEN 'Gunay Karimova' THEN 'The veggie burger is amazing! Made with fresh ingredients.'
    WHEN 'Rashad Gasimov' THEN 'Best fast food restaurant in terms of quality and taste. Highly recommended!'
  END
FROM testimonials
ON CONFLICT DO NOTHING;

-- Gallery Images
INSERT INTO gallery_images (image_url, instagram_url, alt_text, sort_order) VALUES
  ('https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', 'https://instagram.com/p/1', 'Classic Burger', 1),
  ('https://images.pexels.com/photos/1561759/pexels-photo-1561759.jpeg', 'https://instagram.com/p/2', 'Double Cheese', 2),
  ('https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg', 'https://instagram.com/p/3', 'Combo Meal', 3),
  ('https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', 'https://instagram.com/p/4', 'French Fries', 4),
  ('https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', 'https://instagram.com/p/5', 'Desserts', 5),
  ('https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', 'https://instagram.com/p/6', 'Fresh Drinks', 6)
ON CONFLICT DO NOTHING;

-- Create function for order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  prefix text := 'SNK';
  date_part text := to_char(NOW(), 'YYMMDD');
  seq int;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS int)), 0) + 1
  INTO seq
  FROM orders
  WHERE order_number LIKE prefix || date_part || '%';
  
  RETURN prefix || date_part || LPAD(seq::text, 4, '0');
END;
$$ LANGUAGE plpgsql;