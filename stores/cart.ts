import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductExtra } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: { code: string; discountType: string; discountValue: number } | null;
  deliveryFee: number;
  freeDeliveryMin: number;
  currencySymbol: string;
  settings: {
    deliveryFee: number;
    freeDeliveryMin: number;
    currencySymbol: string;
  };
}

interface CartActions {
  addItem: (product: Product, quantity: number, extras: { extra: ProductExtra; quantity: number }[], notes: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateItemExtras: (index: number, extras: { extra: ProductExtra; quantity: number }[]) => void;
  updateItemNotes: (index: number, notes: string) => void;
  applyCoupon: (code: string, discountType: string, discountValue: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  setSettings: (settings: { deliveryFee: number; freeDeliveryMin: number; currencySymbol: string }) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const calculateItemTotal = (
  product: Product,
  quantity: number,
  extras: { extra: ProductExtra; quantity: number }[]
): number => {
  let total = product.price;
  extras.forEach((e) => {
    total += e.extra.price * e.quantity;
  });
  return total * quantity;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      deliveryFee: 500, // Default in cents
      freeDeliveryMin: 3000,
      currencySymbol: '₼',
      settings: {
        deliveryFee: 500,
        freeDeliveryMin: 3000,
        currencySymbol: '₼',
      },

      setSettings: (settings) => {
        set({
          deliveryFee: settings.deliveryFee,
          freeDeliveryMin: settings.freeDeliveryMin,
          currencySymbol: settings.currencySymbol,
          settings,
        });
      },

      addItem: (product, quantity, extras, notes) => {
        const totalPrice = calculateItemTotal(product, quantity, extras);

        set((state) => ({
          items: [
            ...state.items,
            {
              product,
              quantity,
              extras,
              notes,
              totalPrice,
            },
          ],
        }));
      },

      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }));
      },

      updateQuantity: (index, quantity) => {
        set((state) => {
          const items = [...state.items];
          if (items[index]) {
            items[index].quantity = quantity;
            items[index].totalPrice = calculateItemTotal(
              items[index].product,
              quantity,
              items[index].extras
            );
          }
          return { items };
        });
      },

      updateItemExtras: (index, extras) => {
        set((state) => {
          const items = [...state.items];
          if (items[index]) {
            items[index].extras = extras;
            items[index].totalPrice = calculateItemTotal(
              items[index].product,
              items[index].quantity,
              extras
            );
          }
          return { items };
        });
      },

      updateItemNotes: (index, notes) => {
        set((state) => {
          const items = [...state.items];
          if (items[index]) {
            items[index].notes = notes;
          }
          return { items };
        });
      },

      applyCoupon: (code, discountType, discountValue) => {
        set({
          coupon: { code, discountType, discountValue },
        });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getDiscount: () => {
        const state = get();
        if (!state.coupon) return 0;

        const subtotal = state.getSubtotal();

        if (state.coupon.discountType === 'percentage') {
          return Math.floor((subtotal * state.coupon.discountValue) / 100);
        }
        return state.coupon.discountValue;
      },

      getDeliveryFee: () => {
        const state = get();
        const subtotal = state.getSubtotal();

        if (subtotal >= state.freeDeliveryMin) return 0;
        return state.deliveryFee;
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() - state.getDiscount() + state.getDeliveryFee();
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'snacky-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        settings: state.settings,
      }),
    }
  )
);

export const formatPrice = (cents: number, symbol: string = '₼'): string => {
  const amount = cents / 100;
  return `${amount.toFixed(2)} ${symbol}`;
};
