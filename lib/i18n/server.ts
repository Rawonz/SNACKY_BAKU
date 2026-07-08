import { createClient } from '@supabase/supabase-js';
import type { SupportedLanguage } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTranslations(lang: SupportedLanguage): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('translations')
    .select('key, value')
    .eq('language_code', lang);

  if (error) {
    console.error('Failed to fetch translations:', error);
    return {};
  }

  const transMap: Record<string, string> = {};
  (data as any[])?.forEach((t: any) => {
    transMap[t.key] = t.value;
  });
  return transMap;
}

export async function getCategories(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      image_url,
      sort_order,
      is_active,
      category_translations!inner(name, description, language_code)
    `)
    .eq('is_active', true)
    .is('deleted_at', null)
    .eq('category_translations.language_code', lang)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }

  return data?.map((cat: any) => ({
    ...cat,
    translations: cat.category_translations,
  })) || [];
}

export async function getProducts(lang: SupportedLanguage, categoryId?: string) {
  let query = supabase
    .from('products')
    .select(`
      id,
      category_id,
      slug,
      sku,
      image_url,
      gallery_images,
      price,
      calories,
      protein,
      carbs,
      fat,
      is_featured,
      is_popular,
      is_new,
      is_spicy,
      is_vegetarian,
      sort_order,
      is_active,
      model_3d_url,
      product_translations!inner(name, description, language_code)
    `)
    .eq('is_active', true)
    .is('deleted_at', null)
    .eq('product_translations.language_code', lang)
    .order('sort_order');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }

  return data?.map((prod: any) => ({
    ...prod,
    translations: prod.product_translations,
  })) || [];
}

export async function getProductBySlug(lang: SupportedLanguage, slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      category_id,
      slug,
      sku,
      image_url,
      gallery_images,
      price,
      calories,
      protein,
      carbs,
      fat,
      is_featured,
      is_popular,
      is_new,
      is_spicy,
      is_vegetarian,
      sort_order,
      is_active,
      model_3d_url,
      product_translations!inner(name, description, language_code),
      product_ingredients(name, sort_order, language_code),
      categories!inner(slug, category_translations!inner(name, language_code))
    `)
    .eq('slug', slug)
    .eq('product_translations.language_code', lang)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }

  if (!data) return null;

  const productData = data as any;

  return {
    ...productData,
    translations: productData.product_translations,
    ingredients: productData.product_ingredients?.filter((i: any) => i.language_code === lang),
    category: {
      ...productData.categories,
      translations: productData.categories?.category_translations,
    },
  };
}

export async function getExtras(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('product_extras')
    .select(`
      id,
      product_id,
      is_global,
      slug,
      price,
      sort_order,
      is_active,
      product_extra_translations!inner(name, language_code)
    `)
    .eq('is_active', true)
    .eq('product_extra_translations.language_code', lang)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch extras:', error);
    return [];
  }

  return data?.map((extra: any) => ({
    ...extra,
    translations: extra.product_extra_translations,
  })) || [];
}

export async function getGlobalExtras(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('product_extras')
    .select(`
      id,
      slug,
      price,
      sort_order,
      product_extra_translations!inner(name, language_code)
    `)
    .eq('is_active', true)
    .eq('is_global', true)
    .eq('product_extra_translations.language_code', lang)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch global extras:', error);
    return [];
  }

  return data?.map((extra: any) => ({
    ...extra,
    translations: extra.product_extra_translations,
  })) || [];
}

export async function getSettings(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('setting_key, setting_value');

  if (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }

  const settings: Record<string, string> = {};
  (data as any[])?.forEach((s: any) => {
    settings[s.setting_key] = s.setting_value;
  });
  return settings;
}

export async function getOpeningHours() {
  const { data, error } = await supabase
    .from('opening_hours')
    .select('*')
    .order('day_of_week');

  if (error) {
    console.error('Failed to fetch opening hours:', error);
    return [];
  }

  return data || [];
}

export async function getTestimonials(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('testimonials')
    .select(`
      id,
      customer_name,
      avatar_url,
      rating,
      testimonial_translations!inner(text, language_code)
    `)
    .eq('is_active', true)
    .is('deleted_at', null)
    .eq('testimonial_translations.language_code', lang);

  if (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }

  return data?.map((t: any) => ({
    ...t,
    translations: t.testimonial_translations,
  })) || [];
}

export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch gallery:', error);
    return [];
  }

  return data || [];
}

export async function getBanners(lang: SupportedLanguage) {
  const { data, error } = await supabase
    .from('banners')
    .select(`
      id,
      image_url,
      video_url,
      link_url,
      sort_order,
      is_active,
      banner_translations!inner(title, subtitle, button_text, language_code)
    `)
    .eq('is_active', true)
    .is('deleted_at', null)
    .eq('banner_translations.language_code', lang)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch banners:', error);
    return [];
  }

  return data?.map((b: any) => ({
    ...b,
    translations: b.banner_translations,
  })) || [];
}

export async function validateCoupon(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    console.error('Failed to validate coupon:', error);
    return null;
  }

  if (!data) return null;

  const now = new Date();
  const validFrom = new Date(data.valid_from);
  const validUntil = data.valid_until ? new Date(data.valid_until) : null;

  if (now < validFrom) return null;
  if (validUntil && now > validUntil) return null;
  if (data.max_uses && data.current_uses >= data.max_uses) return null;

  return data;
}
