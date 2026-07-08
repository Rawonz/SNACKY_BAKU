'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Minus, Plus, TrendingUp, Sparkles, Flame, Leaf, Star, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { useCartStore, formatPrice } from '@/stores/cart';
import { toast } from 'sonner';
import type { Product, ProductExtra, SupportedLanguage } from '@/types';

interface Props {
  product: Product & {
    translations: { name: string; description: string }[];
    ingredients: { name: string }[];
    category: { slug: string; translations: { name: string }[] };
  };
  recommendedProducts: any[];
  extras: ProductExtra[];
  settings: Record<string, string>;
  lang: SupportedLanguage;
}

export default function ProductDetailClient({ product, recommendedProducts, extras, settings, lang }: Props) {
  const { t } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<{ extra: ProductExtra; quantity: number }[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const name = product.translations?.[0]?.name || product.slug;
  const description = product.translations?.[0]?.description || '';
  const category = product.category?.translations?.[0]?.name || '';
  const images = product.gallery_images?.length
    ? [product.image_url, ...product.gallery_images].filter(Boolean)
    : [product.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'];

  // Calculate total price
  const basePrice = product.price;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.extra.price * e.quantity), 0);
  const totalPrice = (basePrice + extrasTotal) * quantity;

  const handleExtraToggle = (extra: ProductExtra) => {
    setSelectedExtras((prev) => {
      const existing = prev.find((e) => e.extra.id === extra.id);
      if (existing) {
        return prev.filter((e) => e.extra.id !== extra.id);
      }
      return [...prev, { extra, quantity: 1 }];
    });
  };

  const handleExtraQuantity = (extraId: string, delta: number) => {
    setSelectedExtras((prev) =>
      prev.map((e) => {
        if (e.extra.id === extraId) {
          const newQty = e.quantity + delta;
          if (newQty <= 0) return null;
          return { ...e, quantity: newQty };
        }
        return e;
      }).filter(Boolean) as typeof selectedExtras
    );
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem(product as any, quantity, selectedExtras, notes);
      toast.success(t('success.added', 'Added to cart'), {
        action: {
          label: 'View Cart',
          onClick: () => {
            const event = new CustomEvent('cart-drawer:open');
            window.dispatchEvent(event);
          },
        },
      });
      // Reset form
      setQuantity(1);
      setSelectedExtras([]);
      setNotes('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container-padding mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href={`/${lang}/menu`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('nav.menu', 'Menu')}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[selectedImage] as string}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.is_popular && (
                  <span className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {product.is_new && (
                  <span className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}
                {product.is_spicy && (
                  <span className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Spicy
                  </span>
                )}
                {product.is_vegetarian && (
                  <span className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Vegetarian
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 ${
                      selectedImage === idx ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={img as string}
                      alt={`${name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category */}
            <p className="text-sm text-muted-foreground mb-2">{category}</p>

            {/* Name & Price */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="heading-md">{name}</h1>
              <span className="text-2xl font-bold text-gradient">
                {formatPrice(basePrice, settings.currency_symbol || '₼')}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{description}</p>

            {/* Nutrition Info */}
            {product.calories && (
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-lg font-semibold">{product.calories}</p>
                  <p className="text-xs text-muted-foreground">{t('menu.calories', 'cal')}</p>
                </div>
                {product.protein && (
                  <div className="text-center">
                    <p className="text-lg font-semibold">{product.protein}g</p>
                    <p className="text-xs text-muted-foreground">{t('product.protein', 'Protein')}</p>
                  </div>
                )}
                {product.carbs && (
                  <div className="text-center">
                    <p className="text-lg font-semibold">{product.carbs}g</p>
                    <p className="text-xs text-muted-foreground">{t('product.carbs', 'Carbs')}</p>
                  </div>
                )}
                {product.fat && (
                  <div className="text-center">
                    <p className="text-lg font-semibold">{product.fat}g</p>
                    <p className="text-xs text-muted-foreground">{t('product.fat', 'Fat')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">{t('product.ingredients', 'Ingredients')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                    >
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {extras.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">{t('product.extras', 'Extras')}</h3>
                <div className="space-y-2">
                  {extras.map((extra) => {
                    const extraName = extra.translations?.[0]?.name || extra.slug;
                    const isSelected = selectedExtras.some((e) => e.extra.id === extra.id);
                    const selectedExtra = selectedExtras.find((e) => e.extra.id === extra.id);

                    return (
                      <div
                        key={extra.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary/50'
                            : 'bg-card border-border hover:border-primary/30'
                        }`}
                        onClick={() => handleExtraToggle(extra)}
                      >
                        <div>
                          <p className="font-medium text-sm">{extraName}</p>
                          <p className="text-xs text-muted-foreground">
                            +{formatPrice(extra.price, settings.currency_symbol || '₼')}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExtraQuantity(extra.id, -1);
                              }}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {selectedExtra?.quantity || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExtraQuantity(extra.id, 1);
                              }}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">{t('product.quantity', 'Quantity')}</h3>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-masked border border-border flex items-center justify-center disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-2">{t('product.notes', 'Notes')}</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('product.notesPlaceholder', 'Write your special requests...')}
                className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border text-sm resize-none focus:border-primary focus:outline-none"
              />
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full btn-primary py-4 text-lg"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              ) : null}
              {t('product.addToCart', 'Add to Cart')} - {formatPrice(totalPrice, settings.currency_symbol || '₼')}
            </motion.button>
          </motion.div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="heading-sm mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((prod) => (
                <Link key={prod.id} href={`/${lang}/menu/${prod.slug}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="card-premium group"
                  >
                    <div className="relative aspect-square rounded-t-xl overflow-hidden">
                      <Image
                        src={prod.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
                        alt={prod.translations?.[0]?.name || prod.slug}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="25vw"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {prod.translations?.[0]?.name || prod.slug}
                      </h3>
                      <p className="text-sm text-gradient font-semibold mt-1">
                        {formatPrice(prod.price, settings.currency_symbol || '₼')}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
