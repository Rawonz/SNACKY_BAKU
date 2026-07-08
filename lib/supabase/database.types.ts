export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      languages: {
        Row: {
          id: string;
          code: string;
          name: string;
          native_name: string;
          flag_emoji: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          native_name: string;
          flag_emoji: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          native_name?: string;
          flag_emoji?: string;
          is_active?: boolean;
        };
      };
      translations: {
        Row: {
          id: string;
          key: string;
          language_code: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          language_code: string;
          value: string;
        };
        Update: {
          id?: string;
          key?: string;
          language_code?: string;
          value?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      category_translations: {
        Row: {
          id: string;
          category_id: string;
          language_code: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          category_id: string;
          language_code: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string;
          language_code?: string;
          name?: string;
          description?: string | null;
        };
      };
      products: {
        Row: {
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
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          sku?: string | null;
          image_url?: string | null;
          gallery_images?: string[] | null;
          price: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          is_featured?: boolean;
          is_popular?: boolean;
          is_new?: boolean;
          is_spicy?: boolean;
          is_vegetarian?: boolean;
          sort_order?: number;
          is_active?: boolean;
          model_3d_url?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          sku?: string | null;
          image_url?: string | null;
          gallery_images?: string[] | null;
          price?: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          is_featured?: boolean;
          is_popular?: boolean;
          is_new?: boolean;
          is_spicy?: boolean;
          is_vegetarian?: boolean;
          sort_order?: number;
          is_active?: boolean;
          model_3d_url?: string | null;
        };
      };
      product_translations: {
        Row: {
          id: string;
          product_id: string;
          language_code: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          language_code: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          language_code?: string;
          name?: string;
          description?: string | null;
        };
      };
      product_extras: {
        Row: {
          id: string;
          product_id: string | null;
          is_global: boolean;
          slug: string;
          price: number;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          is_global?: boolean;
          slug: string;
          price?: number;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          is_global?: boolean;
          slug?: string;
          price?: number;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      product_extra_translations: {
        Row: {
          id: string;
          extra_id: string;
          language_code: string;
          name: string;
        };
        Insert: {
          id?: string;
          extra_id: string;
          language_code: string;
          name: string;
        };
        Update: {
          id?: string;
          extra_id?: string;
          language_code?: string;
          name?: string;
        };
      };
      orders: {
        Row: {
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
          status: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_address?: string | null;
          delivery_fee?: number;
          subtotal: number;
          discount?: number;
          total: number;
          notes?: string | null;
          coupon_id?: string | null;
          status?: string;
          payment_method?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: string | null;
          delivery_fee?: number;
          subtotal?: number;
          discount?: number;
          total?: number;
          notes?: string | null;
          coupon_id?: string | null;
          status?: string;
          payment_method?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity?: number;
          unit_price: number;
          total_price: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          notes?: string | null;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_amount: number;
          max_uses: number | null;
          current_uses: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type?: string;
          discount_value: number;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: string;
          discount_value?: number;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
        };
      };
      banners: {
        Row: {
          id: string;
          image_url: string | null;
          video_url: string | null;
          link_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          video_url?: string | null;
          link_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          video_url?: string | null;
          link_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      banner_translations: {
        Row: {
          id: string;
          banner_id: string;
          language_code: string;
          title: string | null;
          subtitle: string | null;
          button_text: string | null;
        };
        Insert: {
          id?: string;
          banner_id: string;
          language_code: string;
          title?: string | null;
          subtitle?: string | null;
          button_text?: string | null;
        };
        Update: {
          id?: string;
          banner_id?: string;
          language_code?: string;
          title?: string | null;
          subtitle?: string | null;
          button_text?: string | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          avatar_url: string | null;
          rating: number;
          is_active: boolean;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          customer_name: string;
          avatar_url?: string | null;
          rating?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          customer_name?: string;
          avatar_url?: string | null;
          rating?: number;
          is_active?: boolean;
        };
      };
      testimonial_translations: {
        Row: {
          id: string;
          testimonial_id: string;
          language_code: string;
          text: string;
        };
        Insert: {
          id?: string;
          testimonial_id: string;
          language_code: string;
          text: string;
        };
        Update: {
          id?: string;
          testimonial_id?: string;
          language_code?: string;
          text?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          instagram_url: string | null;
          alt_text: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          instagram_url?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          image_url?: string;
          instagram_url?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      opening_hours: {
        Row: {
          id: string;
          day_of_week: number;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
      };
      restaurant_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
        };
      };
    };
    Functions: {
      generate_order_number: {
        Args: never;
        Returns: string;
      };
    };
  };
}
