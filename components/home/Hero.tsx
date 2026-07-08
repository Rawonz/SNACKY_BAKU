'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';

// Animated particles component
function Particles() {
  const particleCount = 50;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: 0,
          }}
          animate={{
            y: [null, -20, -40],
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Smoke effect component
function SmokeEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-full h-1/2"
          style={{
            background: `radial-gradient(ellipse at ${30 + i * 20}% bottom, rgba(255, 180, 0, 0.03) 0%, transparent 50%)`,
            opacity: 0.5,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Floating food images
function FloatingFood() {
  const items = [
    { src: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg', alt: 'Burger', x: '10%', y: '20%', size: 80, delay: 0 },
    { src: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg', alt: 'Fries', x: '85%', y: '30%', size: 60, delay: 1 },
    { src: 'https://images.pexels.com/photos/5052870/pexels-photo-5052870.jpeg', alt: 'Drink', x: '15%', y: '70%', size: 70, delay: 2 },
    { src: 'https://images.pexels.com/photos/1481949/pexels-photo-1481949.jpeg', alt: 'Dessert', x: '88%', y: '65%', size: 50, delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: item.delay, duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="relative w-full h-full rounded-xl overflow-hidden"
            animate={{
              y: [0, -15, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover contrast-125 saturate-110"
              sizes={`${item.size}px`}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 50);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 50);
  };

  const mouseXSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.9]);
  const textY = useTransform(scrollY, [0, 400], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noise"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />

        {/* Background image with parallax */}
        <motion.div
          style={{ x: mouseXSpring, y: mouseYSpring }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg"
            alt="Background"
            fill
            className="object-cover opacity-20 scale-110"
            priority
          />
        </motion.div>

        {/* Gradient glow at center */}
        <div className="absolute inset-0 flex items-center justify-center z-5">
          <div className="w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
        </div>

        <SmokeEffect />
        <Particles />
        <div className="hidden lg:block">
          <FloatingFood />
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-20 container-padding mx-auto text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premium Fast Food
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            style={{ y: textY }}
            className="heading-xl text-balance mb-4"
          >
            <span className="text-gradient">{t('hero.title', 'Taste the Real')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            {t('hero.subtitle', 'Premium Fast Food Experience')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={`/${language}/menu`}>
              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary min-w-[180px] inline-block text-center"
              >
                {t('hero.cta.menu', 'View Menu')}
              </motion.span>
            </Link>

            <Link href={`/${language}/checkout`}>
              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline min-w-[180px] inline-block text-center"
              >
                {t('hero.cta.order', 'Order Now')}
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-16 border-t border-border/50 grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            {[
              { value: '50+', label: 'Menu Items' },
              { value: '100%', label: 'Fresh' },
              { value: '30min', label: 'Delivery' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">{t('hero.scroll', 'Scroll down')}</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </motion.div>
    </section>
  );
}
