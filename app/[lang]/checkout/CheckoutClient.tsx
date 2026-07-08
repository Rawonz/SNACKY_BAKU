'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageCircle, Phone, MapPin, Loader2, Check, ShoppingBag, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/context';
import { useCartStore, formatPrice } from '@/stores/cart';
import type { OpeningHour, SupportedLanguage } from '@/types';

// Validation schema
const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter your delivery address'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface Props {
  settings: Record<string, string>;
  openingHours: OpeningHour[];
  lang: SupportedLanguage;
}

export default function CheckoutClient({ settings, openingHours, lang }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    items,
    coupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
    clearCart,
    currencySymbol,
  } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  // Generate WhatsApp message
  const generateWhatsAppMessage = (formData: CheckoutForm, orderNum: string) => {
    let message = `🍔 *SNACKY ORDER* 🍔\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 *Order #${orderNum}*\n\n`;
    message += `👤 *Customer:* ${formData.name}\n`;
    message += `📱 *Phone:* ${formData.phone}\n`;
    message += `📍 *Address:* ${formData.address}\n`;
    if (formData.notes) {
      message += `📝 *Notes:* ${formData.notes}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🛒 *ORDER ITEMS:*\n\n`;

    items.forEach((item, idx) => {
      const itemName = item.product.translations?.[0]?.name || item.product.slug;
      const unitPrice = item.extras.reduce((sum, e) => sum + e.extra.price, 0) + item.product.price;
      message += `${idx + 1}. *${itemName}*\n`;
      message += `   Qty: ${item.quantity} × ${formatPrice(unitPrice, currencySymbol)} = ${formatPrice(item.totalPrice, currencySymbol)}\n`;
      if (item.extras.length > 0) {
        message += `   Extras: ${item.extras.map((e) => `${e.extra.translations?.[0]?.name || e.extra.slug} (${e.quantity})`).join(', ')}\n`;
      }
      if (item.notes) {
        message += `   Note: ${item.notes}\n`;
      }
      message += `\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Subtotal:* ${formatPrice(subtotal, currencySymbol)}\n`;
    if (discount > 0) {
      message += `*Discount:* -${formatPrice(discount, currencySymbol)}\n`;
    }
    message += `*Delivery:* ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee, currencySymbol)}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL:* ${formatPrice(total, currencySymbol)}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Thank you for ordering from Snacky! 🙏`;

    return encodeURIComponent(message);
  };

  const onSubmit = async (formData: CheckoutForm) => {
    setIsSubmitting(true);

    try {
      // Create order in the database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          notes: formData.notes,
          items: items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.translations?.[0]?.name || item.product.slug,
            quantity: item.quantity,
            unit_price: item.product.price + item.extras.reduce((sum, e) => sum + e.extra.price, 0),
            total_price: item.totalPrice,
            notes: item.notes,
            extras: item.extras.map((e) => ({
              extra_id: e.extra.id,
              extra_name: e.extra.translations?.[0]?.name || e.extra.slug,
              quantity: e.quantity,
              unit_price: e.extra.price,
              total_price: e.extra.price * e.quantity,
            })),
          })),
          subtotal,
          discount,
          delivery_fee: deliveryFee,
          total,
          coupon_code: coupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const generatedOrderNumber = data.order_number;
      setOrderNumber(generatedOrderNumber);

      // Generate WhatsApp URL
      const whatsappNumber = settings.whatsapp?.replace(/\D/g, '') || '994501234567';
      const message = generateWhatsAppMessage(formData, generatedOrderNumber);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      toast.success('Order placed successfully!');

    } catch (error) {
      console.error('Order error:', error);
      toast.error(t('error.generic', 'An error occurred. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0 && !orderComplete) {
    router.push(`/${lang}/menu`);
    return null;
  }

  // Success state
  if (orderComplete) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-green-500" />
          </motion.div>

          <h1 className="heading-md mb-4">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Your order has been submitted successfully.
          </p>
          <p className="text-lg font-semibold mb-8">
            Order Number: <span className="text-gradient">{orderNumber}</span>
          </p>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A WhatsApp window should have opened with your order details. If not, you can contact us directly.
            </p>

            <motion.a
              href={`tel:${settings.phone}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </motion.a>

            <Link href={`/${lang}/menu`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-padding mx-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-lg mb-8">{t('checkout.title', 'Checkout')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('checkout.name', 'Your Name')} *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`input-premium ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('checkout.phone', 'Phone')} *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={`input-premium ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('checkout.address', 'Address')} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <textarea
                      {...register('address')}
                      className={`input-premium pl-12 h-24 ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Enter your full delivery address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('checkout.notes', 'Order Notes')}
                  </label>
                  <textarea
                    {...register('notes')}
                    className="input-premium h-24"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      {t('checkout.whatsapp', 'Order via WhatsApp')}
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-muted-foreground text-center">
                  By clicking this button, you will be redirected to WhatsApp with your order details.
                </p>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {t('checkout.summary', 'Order Summary')}
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.product.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
                          alt={item.product.translations?.[0]?.name || item.product.slug}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.product.translations?.[0]?.name || item.product.slug}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        {item.extras.length > 0 && (
                          <p className="text-xs text-muted-foreground truncate">
                            +{item.extras.map((e) => e.extra.translations?.[0]?.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="font-medium text-sm text-primary">
                        {formatPrice(item.totalPrice, currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.subtotal', 'Subtotal')}</span>
                    <span>{formatPrice(subtotal, currencySymbol)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>{t('cart.discount', 'Discount')}</span>
                      <span>-{formatPrice(discount, currencySymbol)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.delivery', 'Delivery')}</span>
                    <span className={deliveryFee === 0 ? 'text-green-500' : ''}>
                      {deliveryFee === 0 ? t('cart.free', 'Free') : formatPrice(deliveryFee, currencySymbol)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-border text-lg font-semibold">
                    <span>{t('cart.total', 'Total')}</span>
                    <span className="text-gradient">{formatPrice(total, currencySymbol)}</span>
                  </div>
                </div>

                {/* Coupon indicator */}
                {coupon && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">
                      Coupon {coupon.code} applied
                    </span>
                  </div>
                )}
              </div>

              {/* Opening Hours */}
              <div className="mt-6 card-premium p-6">
                <h3 className="text-sm font-semibold mb-3">Delivery Hours</h3>
                <p className="text-sm text-muted-foreground">
                  We deliver during our opening hours. Please check our working schedule.
                </p>
                <Link href={`/${lang}/contact`} className="text-sm text-primary hover:underline mt-2 inline-block">
                  View opening hours <ChevronRight className="w-4 h-4 inline" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
