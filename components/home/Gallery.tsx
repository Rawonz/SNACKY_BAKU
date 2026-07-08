'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import type { GalleryImage } from '@/types';

interface Props {
  images: GalleryImage[];
}

export default function Gallery({ images }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={containerRef} className="section-padding relative overflow-hidden">
      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6"
          >
            <Instagram className="w-4 h-4" />
            @snacky.az
          </motion.div>

          <h2 className="heading-lg mb-4">{t('gallery.title', 'Gallery')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('gallery.follow', 'Follow us on social media')}
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4" style={{ columnFill: 'balance' }}>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid mb-4 group"
            >
              <a
                href={image.instagram_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative overflow-hidden rounded-2xl"
              >
                <motion.div
                  className="relative"
                  style={{ aspectRatio: index % 3 === 0 ? '1/1' : '4/3' }}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || 'Gallery image'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
