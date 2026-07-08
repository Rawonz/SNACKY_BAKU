'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore, formatPrice } from '@/stores/cart';
import { useI18n } from '@/lib/i18n/context';

export const CART_DRAWER = {
  OPEN_EVENT: 'cart-drawer:open',
  CLOSE_EVENT: 'cart-drawer:close',
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawerContent({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { t, language } = useI18n();
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const {
    items,
    coupon,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
    freeDeliveryMin,
    currencySymbol,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);

    try {
      const response = await fetch(`/api/coupons/validate?code=${couponCode}`);
      const data = await response.json();

      if (data.valid) {
        applyCoupon(data.coupon.code, data.coupon.discount_type, data.coupon.discount_value);
        toast.success(t('success.coupon', 'Coupon applied'));
      } else {
        toast.error(data.message || t('error.generic', 'Invalid coupon'));
      }
    } catch (error) {
      toast.error(t('error.generic', 'An error occurred'));
    } finally {
      setIsValidating(false);
      setCouponCode('');
    }
  };

  const handleCheckout = () => {
    onClose();
    router.push(`/${language}/checkout`);
  };

  const amountToFreeDelivery = freeDeliveryMin - subtotal;
  const deliveryProgress = Math.min((subtotal / freeDeliveryMin) * 100, 100);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="h-full flex flex-col bg-background"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t('cart.title', 'Cart')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Free delivery progress */}
      {amountToFreeDelivery > 0 && (
        <div className="px-6 py-4 bg-muted/50 border-b border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Add {formatPrice(amountToFreeDelivery, currencySymbol)} for free delivery
            </span>
            <span className="text-primary font-medium">{deliveryProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${deliveryProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">{t('cart.empty', 'Your cart is empty')}</p>
            <p className="text-muted-foreground mb-6">{t('cart.emptyDesc', 'Add delicious items to cart')}</p>
            <Link href={`/${language}/menu`} onClick={onClose}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                {t('hero.cta.menu', 'View Menu')}
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
                      alt={item.product.translations?.[0]?.name || item.product.slug}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {item.product.translations?.[0]?.name || item.product.slug}
                    </h4>

                    {/* Extras */}
                    {item.extras.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        + {item.extras.map((e) => e.extra.translations?.[0]?.name || e.extra.slug).join(', ')}
                      </p>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground italic mt-0.5 truncate">
                        {item.notes}
                      </p>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(index, item.quantity - 1);
                            } else {
                              removeItem(index);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>

                      <span className="font-semibold text-primary">
                        {formatPrice(item.totalPrice, currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors self-start"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-6 border-t border-border space-y-4 bg-card">
          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={t('cart.coupon', 'Coupon code')}
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                disabled={!!coupon}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={coupon ? removeCoupon : handleApplyCoupon}
              disabled={isValidating || (!coupon && !couponCode)}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : coupon ? 'Remove' : t('cart.apply', 'Apply')}
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('cart.subtotal', 'Subtotal')}</span>
              <span>{formatPrice(subtotal, currencySymbol)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>{t('cart.discount', 'Discount')}</span>
                <span>-{formatPrice(discount, currencySymbol)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('cart.delivery', 'Delivery')}</span>
              <span className={deliveryFee === 0 ? 'text-green-500' : ''}>
                {deliveryFee === 0 ? t('cart.free', 'Free') : formatPrice(deliveryFee, currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-border text-base font-semibold">
              <span>{t('cart.total', 'Total')}</span>
              <span className="text-gradient">{formatPrice(total, currencySymbol)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full btn-primary py-4"
          >
            {t('cart.checkout', 'Complete Order')} ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener(CART_DRAWER.OPEN_EVENT, handleOpen);
    window.addEventListener(CART_DRAWER.CLOSE_EVENT, handleClose);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener(CART_DRAWER.OPEN_EVENT, handleOpen);
      window.removeEventListener(CART_DRAWER.CLOSE_EVENT, handleClose);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl"
          >
            <CartDrawerContent isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
