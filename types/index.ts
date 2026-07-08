// Database types
export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_active: boolean;
  created_at: string;
}

export interface Translation {
  id: string;
  key: string;
  language_code: string;
  value: string;
}

export interface Category {
  id: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  translations: CategoryTranslation[];
}

export interface CategoryTranslation {
  id: string;
  category_id: string;
  language_code: string;
  name: string;
  description: string | null;
}

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  sku: string | null;
  image_url: string | null;
  gallery_images: string[] | null;
  price: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_spicy: boolean;
  is_vegetarian: boolean;
  sort_order: number;
  is_active: boolean;
  model_3d_url: string | null;
  category?: Category;
  translations: ProductTranslation[];
  ingredients: ProductIngredient[];
}

export interface ProductTranslation {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  description: string | null;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  sort_order: number;
}

export interface ProductExtra {
  id: string;
  product_id: string | null;
  is_global: boolean;
  slug: string;
  price: number;
  sort_order: number;
  is_active: boolean;
  translations: ProductExtraTranslation[];
}

export interface ProductExtraTranslation {
  id: string;
  extra_id: string;
  language_code: string;
  name: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  delivery_fee: number;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  coupon_id: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  extras: OrderItemExtra[];
}

export interface OrderItemExtra {
  id: string;
  order_item_id: string;
  extra_id: string | null;
  extra_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

export interface Banner {
  id: string;
  image_url: string | null;
  video_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  translations: BannerTranslation[];
}

export interface BannerTranslation {
  id: string;
  banner_id: string;
  language_code: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
  translations: TestimonialTranslation[];
}

export interface TestimonialTranslation {
  id: string;
  testimonial_id: string;
  language_code: string;
  text: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  instagram_url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface OpeningHour {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export interface RestaurantSettings {
  restaurant_name: string;
  restaurant_tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  address_full: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  delivery_fee: number;
  free_delivery_min: number;
  currency: string;
  currency_symbol: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  extras: { extra: ProductExtra; quantity: number }[];
  notes: string;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  coupon: Coupon | null;
  total: number;
}

// Form types
export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Supported languages
export const SUPPORTED_LANGUAGES = ['az', 'tr', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Language map
export const LANGUAGE_MAP: Record<SupportedLanguage, { name: string; native: string; flag: string }> = {
  az: { name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
  tr: { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
};
