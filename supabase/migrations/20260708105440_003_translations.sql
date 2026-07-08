/*
# Translations and Extra Translations

Adds translations for:
- Category names and descriptions (AZ, TR, EN)
- Product extra names (AZ, TR, EN)
*/

-- Category translations
INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'az', 
  CASE slug 
    WHEN 'burgers' THEN 'Burgerlər'
    WHEN 'combos' THEN 'Kombolar'
    WHEN 'sides' THEN 'Qarnirlər'
    WHEN 'drinks' THEN 'İçkilər'
    WHEN 'desserts' THEN 'Desertlər'
  END,
  CASE slug 
    WHEN 'burgers' THEN 'Dadlı və şirəli burgerlər'
    WHEN 'combos' THEN 'Sərfəli menyu kombinasiyaları'
    WHEN 'sides' THEN 'Əlavə qəlyanaltılar'
    WHEN 'drinks' THEN 'Sərinləşdirici içkilər'
    WHEN 'desserts' THEN 'Şirin desertlər'
  END
FROM categories WHERE slug IN ('burgers', 'combos', 'sides', 'drinks', 'desserts')
ON CONFLICT DO NOTHING;

INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'tr', 
  CASE slug 
    WHEN 'burgers' THEN 'Burgerler'
    WHEN 'combos' THEN 'Menüler'
    WHEN 'sides' THEN 'Yan Ürünler'
    WHEN 'drinks' THEN 'İçecekler'
    WHEN 'desserts' THEN 'Tatlılar'
  END,
  CASE slug 
    WHEN 'burgers' THEN 'Lezzetli ve sulu burgerler'
    WHEN 'combos' THEN 'Ekonomik menü kombinasyonları'
    WHEN 'sides' THEN 'Ekstra atıştırmalıklar'
    WHEN 'drinks' THEN 'Serinletici içecekler'
    WHEN 'desserts' THEN 'Tatlı tatlılar'
  END
FROM categories WHERE slug IN ('burgers', 'combos', 'sides', 'drinks', 'desserts')
ON CONFLICT DO NOTHING;

INSERT INTO category_translations (category_id, language_code, name, description)
SELECT id, 'en', 
  CASE slug 
    WHEN 'burgers' THEN 'Burgers'
    WHEN 'combos' THEN 'Combos'
    WHEN 'sides' THEN 'Sides'
    WHEN 'drinks' THEN 'Drinks'
    WHEN 'desserts' THEN 'Desserts'
  END,
  CASE slug 
    WHEN 'burgers' THEN 'Delicious and juicy burgers'
    WHEN 'combos' THEN 'Value menu combinations'
    WHEN 'sides' THEN 'Extra snacks and sides'
    WHEN 'drinks' THEN 'Refreshing beverages'
    WHEN 'desserts' THEN 'Sweet treats'
  END
FROM categories WHERE slug IN ('burgers', 'combos', 'sides', 'drinks', 'desserts')
ON CONFLICT DO NOTHING;

-- Extra translations
INSERT INTO product_extra_translations (extra_id, language_code, name)
SELECT id, 'az', CASE slug
  WHEN 'extra-cheese' THEN 'Əlavə Pendir'
  WHEN 'extra-sauce' THEN 'Əlavə Sous'
  WHEN 'extra-fries' THEN 'Əlavə Kartof Fri'
  WHEN 'large-portion' THEN 'Böyük Porsiya'
END
FROM product_extras
WHERE slug IN ('extra-cheese', 'extra-sauce', 'extra-fries', 'large-portion')
ON CONFLICT DO NOTHING;

INSERT INTO product_extra_translations (extra_id, language_code, name)
SELECT id, 'tr', CASE slug
  WHEN 'extra-cheese' THEN 'Ekstra Peynir'
  WHEN 'extra-sauce' THEN 'Ekstra Sos'
  WHEN 'extra-fries' THEN 'Ekstra Patates Kızartması'
  WHEN 'large-portion' THEN 'Büyük Porsiyon'
END
FROM product_extras
WHERE slug IN ('extra-cheese', 'extra-sauce', 'extra-fries', 'large-portion')
ON CONFLICT DO NOTHING;

INSERT INTO product_extra_translations (extra_id, language_code, name)
SELECT id, 'en', CASE slug
  WHEN 'extra-cheese' THEN 'Extra Cheese'
  WHEN 'extra-sauce' THEN 'Extra Sauce'
  WHEN 'extra-fries' THEN 'Extra Fries'
  WHEN 'large-portion' THEN 'Large Portion'
END
FROM product_extras
WHERE slug IN ('extra-cheese', 'extra-sauce', 'extra-fries', 'large-portion')
ON CONFLICT DO NOTHING;