'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X, Globe, Search, Home, UtensilsCrossed, Info, Phone } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useI18n } from '@/lib/i18n/context';
import { CART_DRAWER } from '@/components/cart/CartDrawer';
import type { SupportedLanguage } from '@/types';
import { cn } from '@/lib/utils';

const LANGUAGE_MAP: Record<string, { name: string; native: string; flag: string }> = {
  az: { name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
  tr: { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useI18n();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { scrollY } = useScroll();

  const headerBg = useTransform(scrollY, [0, 100], ['rgba(9, 9, 9, 0)', 'rgba(9, 9, 9, 0.95)']);
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      setIsScrolled(y > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCart = () => {
    const event = new CustomEvent(CART_DRAWER.OPEN_EVENT);
    window.dispatchEvent(event);
  };

  const navLinks = [
    { href: `/${language}`, label: t('nav.home', 'Home'), icon: Home },
    { href: `/${language}/menu`, label: t('nav.menu', 'Menu'), icon: UtensilsCrossed },
    { href: `/${language}/about`, label: t('nav.about', 'About'), icon: Info },
    { href: `/${language}/contact`, label: t('nav.contact', 'Contact'), icon: Phone },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
      >
        <div className="container-padding mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href={`/${language}`} className="flex items-center gap-2 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl md:text-3xl font-bold text-gradient">Snacky</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <div className="relative" ref={langDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Change language"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{LANGUAGE_MAP[language].flag}</span>
                </motion.button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 py-2 w-48 rounded-xl glass-strong border border-border shadow-glass"
                    >
                      {Object.entries(LANGUAGE_MAP).map(([code, info]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setLanguage(code as SupportedLanguage);
                            setIsLangOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3 transition-colors',
                            code === language && 'bg-muted text-primary'
                          )}
                        >
                          <span className="text-lg">{info.flag}</span>
                          <div>
                            <p className="text-sm font-medium">{info.native}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative p-2"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-strong border-t border-border"
            >
              <div className="container-padding py-6">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium py-2 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">{t('lang.select', 'Select language')}</p>
                  <div className="flex gap-2">
                    {Object.entries(LANGUAGE_MAP).map(([code, info]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code as SupportedLanguage);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          code === language
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {info.flag} {info.native}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{link.label}</span>
              </Link>
            );
          })}
          <button onClick={openCart} className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px]">{t('nav.cart', 'Cart')}</span>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
