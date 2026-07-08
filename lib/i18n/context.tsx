'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { SupportedLanguage } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, string>;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function I18nProvider({
  children,
  initialLang
}: {
  children: ReactNode;
  initialLang?: SupportedLanguage;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLang || DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (lang: SupportedLanguage) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('key, value')
        .eq('language_code', lang);

      if (error) throw error;

      const transMap: Record<string, string> = {};
      (data as any[])?.forEach((t: any) => {
        transMap[t.key] = t.value;
      });
      setTranslations(transMap);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }, []);

  useEffect(() => {
    const langToUse = initialLang || DEFAULT_LANGUAGE;
    setLanguageState(langToUse);
    loadTranslations(langToUse).finally(() => setIsLoading(false));
    localStorage.setItem('language', langToUse);
  }, [initialLang, loadTranslations]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    loadTranslations(lang);
    document.documentElement.lang = lang;

    // Navigate to the new language path
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/(az|tr|en)/, `/${lang}`);
    router.push(newPath);
  }, [loadTranslations, pathname, router]);

  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translations, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, language } = useI18n();
  return { t, lang: language };
}
