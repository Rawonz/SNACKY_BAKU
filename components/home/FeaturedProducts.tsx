'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Sparkles, Flame } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { formatPrice } from '@/stores/cart';
import type { Product } from '@/types';

interface Props {
  products: (Product & { translations: { name: string; description: string }[] })[];
}

export default function FeaturedProducts({ products }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const containerY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const getProductName = (product: Product) => {
    const translation = product.translations?.find((t) => t.language_code === language);
    return translation?.name || product.slug;
  };

  const getProductDesc = (product: Product) => {
    const translation = product.translations?.find((t) => t.language_code === language);
    return translation?.description || '';
  };

  return (
    <section ref={containerRef} className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t('menu.popular', 'Popular')}
          </motion.div>

          <h2 className="heading-lg mb-4">
            {t('menu.title', 'Menu')}
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our most loved items, crafted with premium ingredients
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.slice(0, 6).map((product, index) => (
            <motion.div key={product.id} variants={cardVariants}>
              <Link href={`/menu/${product.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card-premium group cursor-pointer h-full"
                >
                  {/* Product Image */}
                  <div className="relative aspect-product overflow-hidden">
                    <Image
                      src={product.image_url || 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'}
                      alt={getProductName(product)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {product.is_popular && (
                        <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                      {product.is_new && (
                        <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          New
                        </span>
                      )}
                      {product.is_spicy && (
                        <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Spicy
                        </span>
                      )}
                    </div>

                    {/* Price badge */}
                    <div className="absolute bottom-4 right-4 px-4 py-2 bg-card/90 backdrop-blur rounded-xl border border-border/50">
                      <span className="text-lg font-bold text-gradient">
                        {formatPrice(product.price, '₼')}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="heading-sm mb-2 group-hover:text-primary transition-colors">
                      {getProductName(product)}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {getProductDesc(product)}
                    </p>

                    {/* Nutrition info */}
                    {product.calories && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{product.calories} {t('menu.calories', 'cal')}</span>
                        {product.protein && <span>{product.protein}g protein</span>}
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              {t('hero.cta.menu', 'View Full Menu')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
