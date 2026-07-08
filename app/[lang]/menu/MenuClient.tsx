'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, TrendingUp, Sparkles, Flame, Leaf, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { useCartStore, formatPrice } from '@/stores/cart';
import { toast } from 'sonner';
import type { Product, Category, ProductExtra, SupportedLanguage } from '@/types';

interface Props {
  initialProducts: (Product & { translations: { name: string; description: string }[] })[];
  categories: (Category & { translations: { name: string; description: string }[] })[];
  extras: ProductExtra[];
  settings: Record<string, string>;
  lang: SupportedLanguage;
}

export default function MenuClient({ initialProducts, categories, extras, settings, lang }: Props) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  const [showFilters, setShowFilters] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setSettings = useCartStore((state) => state.setSettings);

  // Update cart settings from server
  useEffect(() => {
    if (settings) {
      setSettings({
        deliveryFee: parseInt(settings.delivery_fee || '500'),
        freeDeliveryMin: parseInt(settings.free_delivery_min || '3000'),
        currencySymbol: settings.currency_symbol || '₼',
      });
    }
  }, [settings, setSettings]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = p.translations?.[0]?.name?.toLowerCase() || '';
        const desc = p.translations?.[0]?.description?.toLowerCase() || '';
        return name.includes(query) || desc.includes(query);
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
    }

    return filtered;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  const handleQuickAdd = (product: Product) => {
    addItem(product, 1, [], '');
    toast.success(t('success.added', 'Added to cart'), {
      action: {
        label: 'View Cart',
        onClick: () => {
          const event = new CustomEvent('cart-drawer:open');
          window.dispatchEvent(event);
        },
      },
    });
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container-padding mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-lg mb-4">{t('menu.title', 'Menu')}</h1>
          <p className="text-muted-foreground">
            Explore our full menu of premium fast food items
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menu.search', 'Search...')}
              className="w-full pl-12 pr-4 py-4 bg-card rounded-2xl border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              {t('menu.all', 'All')}
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                {cat.translations?.[0]?.name || cat.slug}
              </motion.button>
            ))}

            {/* Filter toggle for mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto px-5 py-2.5 rounded-full text-sm font-medium bg-card border border-border hover:border-primary/50 flex items-center gap-2 md:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
          </div>

          {/* Sort options */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            {[
              { value: 'default', label: 'Default' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value as any)}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === opt.value ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6"
        >
          {filteredProducts.length} items found
        </motion.p>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/${lang}/menu/${product.slug}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="card-premium group h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-product overflow-hidden rounded-t-2xl">
                      <Image
                        src={product.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
                        alt={product.translations?.[0]?.name || product.slug}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {product.is_popular && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                          </span>
                        )}
                        {product.is_new && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                        {product.is_spicy && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-red-500 text-white rounded-full flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                          </span>
                        )}
                        {product.is_vegetarian && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-green-500 text-white rounded-full flex items-center gap-1">
                            <Leaf className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Price badge */}
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-card/80 backdrop-blur rounded-xl border border-border/50">
                        <span className="font-bold text-gradient">
                          {formatPrice(product.price, settings.currency_symbol || '₼')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {product.translations?.[0]?.name || product.slug}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.translations?.[0]?.description}
                      </p>

                      {/* Nutrition */}
                      {product.calories && (
                        <div className="text-xs text-muted-foreground">
                          {product.calories} {t('menu.calories', 'cal')}
                        </div>
                      )}

                      {/* Quick Add Button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuickAdd(product);
                        }}
                        className="w-full mt-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-xl text-sm font-medium transition-all"
                      >
                        {t('product.addToCart', 'Add to Cart')}
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} className="btn-secondary">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
