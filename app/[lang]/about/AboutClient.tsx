'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { Award, Heart, Leaf, Timer } from 'lucide-react';
import type { SupportedLanguage } from '@/types';

interface Props {
  settings: Record<string, string>;
  lang: SupportedLanguage;
}

export default function AboutClient({ settings, lang }: Props) {
  const { t } = useI18n();

  const values = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'We use only the freshest, highest-quality ingredients sourced from trusted local suppliers.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Every item is crafted with care and attention to detail, ensuring exceptional taste every time.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Our passion for great food drives everything we do. You can taste the difference.',
    },
    {
      icon: Timer,
      title: 'Quick Service',
      description: 'Premium doesn\'t mean slow. We deliver quality food fast, without compromising taste.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-padding mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            {t('about.title', 'About Us')}
          </span>
          <h1 className="heading-lg mb-6">{t('about.story', 'Our Story')}</h1>
          <p className="text-lg text-muted-foreground">
            Born from a passion for exceptional fast food, Snacky brings you the finest burgers,
            sides, and drinks with a commitment to quality that sets us apart.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] rounded-3xl overflow-hidden mb-20"
        >
          <Image
            src="https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg"
            alt="Snacky Restaurant"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">{t('about.mission', 'Our Mission')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              To redefine fast food by combining premium ingredients, innovative recipes,
              and exceptional service to create unforgettable dining experiences.
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-premium p-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2020', label: 'Founded' },
              { value: '50+', label: 'Menu Items' },
              { value: '10000+', label: 'Happy Customers' },
              { value: '100%', label: 'Fresh Daily' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
