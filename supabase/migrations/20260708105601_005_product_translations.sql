/*
# Product Translations

Adds translations for all products in AZ, TR, EN languages.
*/

-- Burger translations
INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'classic-burger' THEN 'Klassik Burger'
    WHEN 'double-cheese' THEN 'Double Cheese'
    WHEN 'bbq-bacon' THEN 'BBQ Bacon'
    WHEN 'spicy-chicken' THEN 'Acı Toyuq'
    WHEN 'veggie-delight' THEN 'Vegetarian Burger'
  END,
  CASE slug 
    WHEN 'classic-burger' THEN '100% mal əti, təzə tərəvəz və xüsusi sous ilə'
    WHEN 'double-cheese' THEN 'İki qat pendir, iki qat ət - əsl zövq'
    WHEN 'bbq-bacon' THEN 'Qızardılmış bekon, BBQ sous və karamelizə soğan'
    WHEN 'spicy-chicken' THEN 'Xırtıldağan toyuq, jalapeno və acı sous'
    WHEN 'veggie-delight' THEN 'Təzə tərəvəz, qızardılmış göbək və avokado'
  END
FROM products WHERE slug IN ('classic-burger', 'double-cheese', 'bbq-bacon', 'spicy-chicken', 'veggie-delight')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'classic-burger' THEN 'Klasik Burger'
    WHEN 'double-cheese' THEN 'Double Cheese'
    WHEN 'bbq-bacon' THEN 'BBQ Bacon'
    WHEN 'spicy-chicken' THEN 'Acılı Tavuk'
    WHEN 'veggie-delight' THEN 'Vejetaryen Burger'
  END,
  CASE slug 
    WHEN 'classic-burger' THEN '100% dana eti, taze sebze ve özel sos ile'
    WHEN 'double-cheese' THEN 'İki kat peynir, iki kat et - gerçek lezzet'
    WHEN 'bbq-bacon' THEN 'Kızarmış domuz pastırması, BBQ sos ve karamel soğan'
    WHEN 'spicy-chicken' THEN 'Çıtır tavuk, jalapeno ve acılı sos'
    WHEN 'veggie-delight' THEN 'Taze sebze, kızarmış mantar ve avokado'
  END
FROM products WHERE slug IN ('classic-burger', 'double-cheese', 'bbq-bacon', 'spicy-chicken', 'veggie-delight')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'classic-burger' THEN 'Classic Burger'
    WHEN 'double-cheese' THEN 'Double Cheese'
    WHEN 'bbq-bacon' THEN 'BBQ Bacon'
    WHEN 'spicy-chicken' THEN 'Spicy Chicken'
    WHEN 'veggie-delight' THEN 'Veggie Delight'
  END,
  CASE slug 
    WHEN 'classic-burger' THEN '100% beef patty, fresh vegetables and special sauce'
    WHEN 'double-cheese' THEN 'Double cheese, double meat - pure delight'
    WHEN 'bbq-bacon' THEN 'Crispy bacon, BBQ sauce and caramelized onions'
    WHEN 'spicy-chicken' THEN 'Crispy chicken, jalapeños and spicy sauce'
    WHEN 'veggie-delight' THEN 'Fresh vegetables, grilled mushrooms and avocado'
  END
FROM products WHERE slug IN ('classic-burger', 'double-cheese', 'bbq-bacon', 'spicy-chicken', 'veggie-delight')
ON CONFLICT DO NOTHING;

-- Combo translations
INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'classic-combo' THEN 'Klassik Menyu'
    WHEN 'double-combo' THEN 'Double Menyu'
    WHEN 'family-combo' THEN 'Ailə Menyusu'
  END,
  CASE slug 
    WHEN 'classic-combo' THEN 'Klassik burger + kartof + içki'
    WHEN 'double-combo' THEN 'Double cheese burger + böyük kartof + içki'
    WHEN 'family-combo' THEN '4 burger + 2 böyük kartof + 4 içki'
  END
FROM products WHERE slug IN ('classic-combo', 'double-combo', 'family-combo')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'classic-combo' THEN 'Klasik Menü'
    WHEN 'double-combo' THEN 'Double Menü'
    WHEN 'family-combo' THEN 'Aile Menüsü'
  END,
  CASE slug 
    WHEN 'classic-combo' THEN 'Klasik burger + patates + içecek'
    WHEN 'double-combo' THEN 'Double cheese burger + büyük patates + içecek'
    WHEN 'family-combo' THEN '4 burger + 2 büyük patates + 4 içecek'
  END
FROM products WHERE slug IN ('classic-combo', 'double-combo', 'family-combo')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'classic-combo' THEN 'Classic Combo'
    WHEN 'double-combo' THEN 'Double Combo'
    WHEN 'family-combo' THEN 'Family Combo'
  END,
  CASE slug 
    WHEN 'classic-combo' THEN 'Classic burger + fries + drink'
    WHEN 'double-combo' THEN 'Double cheese burger + large fries + drink'
    WHEN 'family-combo' THEN '4 burgers + 2 large fries + 4 drinks'
  END
FROM products WHERE slug IN ('classic-combo', 'double-combo', 'family-combo')
ON CONFLICT DO NOTHING;

-- Sides translations
INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'french-fries' THEN 'Kartof Fri'
    WHEN 'onion-rings' THEN 'Soğan Halqaları'
    WHEN 'chicken-nuggets' THEN 'Toyuq Naqqetləri'
    WHEN 'mozzarella-sticks' THEN 'Mozzarella Çubuqları'
  END,
  CASE slug 
    WHEN 'french-fries' THEN 'Xırtıldağan qızardılmış kartof'
    WHEN 'onion-rings' THEN 'Qızıl rəngli soğan halqaları'
    WHEN 'chicken-nuggets' THEN '8 ədəd xırtıldağan toyuq naqqeti'
    WHEN 'mozzarella-sticks' THEN '6 ədəd mozzarella çubuqları'
  END
FROM products WHERE slug IN ('french-fries', 'onion-rings', 'chicken-nuggets', 'mozzarella-sticks')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'french-fries' THEN 'Patates Kızartması'
    WHEN 'onion-rings' THEN 'Soğan Halkaları'
    WHEN 'chicken-nuggets' THEN 'Tavuk Nuggetları'
    WHEN 'mozzarella-sticks' THEN 'Mozzarella Çubukları'
  END,
  CASE slug 
    WHEN 'french-fries' THEN 'Çıtır kızarmış patates'
    WHEN 'onion-rings' THEN 'Altın rengi soğan halkaları'
    WHEN 'chicken-nuggets' THEN '8 adet çıtır tavuk nugget'
    WHEN 'mozzarella-sticks' THEN '6 adet mozzarella çubuğu'
  END
FROM products WHERE slug IN ('french-fries', 'onion-rings', 'chicken-nuggets', 'mozzarella-sticks')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'french-fries' THEN 'French Fries'
    WHEN 'onion-rings' THEN 'Onion Rings'
    WHEN 'chicken-nuggets' THEN 'Chicken Nuggets'
    WHEN 'mozzarella-sticks' THEN 'Mozzarella Sticks'
  END,
  CASE slug 
    WHEN 'french-fries' THEN 'Crispy golden fries'
    WHEN 'onion-rings' THEN 'Golden battered onion rings'
    WHEN 'chicken-nuggets' THEN '8 pieces of crispy chicken nuggets'
    WHEN 'mozzarella-sticks' THEN '6 pieces of mozzarella sticks'
  END
FROM products WHERE slug IN ('french-fries', 'onion-rings', 'chicken-nuggets', 'mozzarella-sticks')
ON CONFLICT DO NOTHING;

-- Drinks translations
INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'cola' THEN 'Kola'
    WHEN 'fresh-lemonade' THEN 'Təzə Limonad'
    WHEN 'milkshake-chocolate' THEN 'Şokolad Milkshake'
    WHEN 'milkshake-strawberry' THEN 'Çiyələk Milkshake'
    WHEN 'iced-tea' THEN 'Buzlu Çay'
  END,
  CASE slug 
    WHEN 'cola' THEN 'Sərinləşdirici klassik kola'
    WHEN 'fresh-lemonade' THEN 'Təzə sıxılmış limonad'
    WHEN 'milkshake-chocolate' THEN 'Kremli şokolad milkshake'
    WHEN 'milkshake-strawberry' THEN 'Kremli çiyələk milkshake'
    WHEN 'iced-tea' THEN 'Təzə buzlu çay'
  END
FROM products WHERE slug IN ('cola', 'fresh-lemonade', 'milkshake-chocolate', 'milkshake-strawberry', 'iced-tea')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'cola' THEN 'Kola'
    WHEN 'fresh-lemonade' THEN 'Taze Limonata'
    WHEN 'milkshake-chocolate' THEN 'Çikolatalı Milkshake'
    WHEN 'milkshake-strawberry' THEN 'Çilekli Milkshake'
    WHEN 'iced-tea' THEN 'Buzlu Çay'
  END,
  CASE slug 
    WHEN 'cola' THEN 'Serinletici klasik kola'
    WHEN 'fresh-lemonade' THEN 'Taze sıkılmış limonata'
    WHEN 'milkshake-chocolate' THEN 'Kremalı çikolatalı milkshake'
    WHEN 'milkshake-strawberry' THEN 'Kremalı çilekli milkshake'
    WHEN 'iced-tea' THEN 'Taze buzlu çay'
  END
FROM products WHERE slug IN ('cola', 'fresh-lemonade', 'milkshake-chocolate', 'milkshake-strawberry', 'iced-tea')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'cola' THEN 'Cola'
    WHEN 'fresh-lemonade' THEN 'Fresh Lemonade'
    WHEN 'milkshake-chocolate' THEN 'Chocolate Milkshake'
    WHEN 'milkshake-strawberry' THEN 'Strawberry Milkshake'
    WHEN 'iced-tea' THEN 'Iced Tea'
  END,
  CASE slug 
    WHEN 'cola' THEN 'Refreshing classic cola'
    WHEN 'fresh-lemonade' THEN 'Freshly squeezed lemonade'
    WHEN 'milkshake-chocolate' THEN 'Creamy chocolate milkshake'
    WHEN 'milkshake-strawberry' THEN 'Creamy strawberry milkshake'
    WHEN 'iced-tea' THEN 'Fresh brewed iced tea'
  END
FROM products WHERE slug IN ('cola', 'fresh-lemonade', 'milkshake-chocolate', 'milkshake-strawberry', 'iced-tea')
ON CONFLICT DO NOTHING;

-- Desserts translations
INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Şokolad Tortu'
    WHEN 'apple-pie' THEN 'Alma Pastası'
    WHEN 'ice-cream-sundae' THEN 'Dondma Sundae'
  END,
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Zəngin şokolad tortu'
    WHEN 'apple-pie' THEN 'Ev usulu alma pastası'
    WHEN 'ice-cream-sundae' THEN 'Vanil dondma, şokolad sous və qaymaqla'
  END
FROM products WHERE slug IN ('chocolate-cake', 'apple-pie', 'ice-cream-sundae')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Çikolatalı Pasta'
    WHEN 'apple-pie' THEN 'Elma Tartı'
    WHEN 'ice-cream-sundae' THEN 'Dondurma Sundae'
  END,
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Zengin çikolatalı pasta'
    WHEN 'apple-pie' THEN 'Ev yapımı elma tartı'
    WHEN 'ice-cream-sundae' THEN 'Vanilya dondurma, çikolata sos ve krem şanti ile'
  END
FROM products WHERE slug IN ('chocolate-cake', 'apple-pie', 'ice-cream-sundae')
ON CONFLICT DO NOTHING;

INSERT INTO product_translations (product_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Chocolate Cake'
    WHEN 'apple-pie' THEN 'Apple Pie'
    WHEN 'ice-cream-sundae' THEN 'Ice Cream Sundae'
  END,
  CASE slug 
    WHEN 'chocolate-cake' THEN 'Rich chocolate layer cake'
    WHEN 'apple-pie' THEN 'Homemade apple pie'
    WHEN 'ice-cream-sundae' THEN 'Vanilla ice cream, chocolate sauce and whipped cream'
  END
FROM products WHERE slug IN ('chocolate-cake', 'apple-pie', 'ice-cream-sundae')
ON CONFLICT DO NOTHING;