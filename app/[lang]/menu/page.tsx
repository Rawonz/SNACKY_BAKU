import { Metadata } from 'next';
import { getProducts, getCategories, getGlobalExtras, getSettings } from '@/lib/i18n/server';
import MenuClient from './MenuClient';
import type { SupportedLanguage } from '@/types';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const translations: Record<string, Record<string, string>> = {
    az: { title: 'Menyu - Snacky', description: 'Bütün menyumuzu kəşf edin: dadlı burgerlər, qarnirlər və içkilər.' },
    tr: { title: 'Menü - Snacky', description: 'Tüm menümüzü keşfedin: lezzetli burgerler, yan ürünler ve içecekler.' },
    en: { title: 'Menu - Snacky', description: 'Explore our full menu: delicious burgers, sides, and drinks.' },
  };

  const t = translations[lang] || translations.en;

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://snacky.az/${lang}/menu`,
      languages: {
        az: 'https://snacky.az/az/menu',
        tr: 'https://snacky.az/tr/menu',
        en: 'https://snacky.az/en/menu',
      },
    },
  };
}

export default async function MenuPage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const [products, categories, extras, settings] = await Promise.all([
    getProducts(selectedLang),
    getCategories(selectedLang),
    getGlobalExtras(selectedLang),
    getSettings(selectedLang),
  ]);

  return (
    <MenuClient
      initialProducts={products}
      categories={categories}
      extras={extras}
      settings={settings}
      lang={selectedLang}
    />
  );
}
