'use client';

import { useEffect, useState } from 'react';
import { I18nProvider } from '@/lib/i18n/context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/layout/CustomCursor';
import CartDrawer from '@/components/cart/CartDrawer';
import { RestaurantJsonLd, OrganizationJsonLd } from '@/components/layout/JSONLD';
import SplashScreen from '@/components/layout/SplashScreen';
import type { SupportedLanguage } from '@/types';

const VALID_LANGS: SupportedLanguage[] = ['az', 'tr', 'en'];

export default function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Validate language
  const validLang = VALID_LANGS.includes(lang as SupportedLanguage) ? lang : 'en';

  useEffect(() => {
    setMounted(true);

    // Set document language
    if (typeof document !== 'undefined') {
      document.documentElement.lang = validLang;
    }
  }, [validLang]);

  useEffect(() => {
    // Hide splash after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <I18nProvider initialLang={validLang as SupportedLanguage}>
      {showSplash && <SplashScreen />}
      <div className="relative min-h-screen bg-background text-foreground">
        {/* Structured Data for SEO */}
        <RestaurantJsonLd />
        <OrganizationJsonLd />

        {/* Custom cursor for desktop */}
        <CustomCursor />

        {/* Navigation */}
        <Navbar />

        {/* Main content with proper padding for navbar */}
        <main className="pt-20 pb-20 md:pb-0">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Mobile bottom spacing for fixed nav */}
        <div className="h-16 md:hidden" />
      </div>
    </I18nProvider>
  );
}
