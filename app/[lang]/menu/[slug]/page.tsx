import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getGlobalExtras, getSettings } from '@/lib/i18n/server';
import ProductDetailClient from './ProductDetailClient';
import type { SupportedLanguage } from '@/types';

export async function generateMetadata({ params: { lang, slug } }: { params: { lang: string; slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(lang as SupportedLanguage, slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const name = product.translations?.[0]?.name || slug;

  return {
    title: `${name} - Snacky Menu`,
    description: product.translations?.[0]?.description || 'Delicious menu item at Snacky',
    openGraph: {
      title: `${name} - Snacky`,
      description: product.translations?.[0]?.description,
      images: [{ url: product.image_url || '/og-image.jpg' }],
    },
    alternates: {
      canonical: `https://snacky.az/${lang}/menu/${slug}`,
      languages: {
        az: `https://snacky.az/az/menu/${slug}`,
        tr: `https://snacky.az/tr/menu/${slug}`,
        en: `https://snacky.az/en/menu/${slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({ params: { lang, slug } }: { params: { lang: string; slug: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const [product, recommendedProducts, extras, settings] = await Promise.all([
    getProductBySlug(selectedLang, slug),
    getProducts(selectedLang).then((products) => products.filter((p: any) => p.slug !== slug).slice(0, 4)),
    getGlobalExtras(selectedLang),
    getSettings(selectedLang),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={product as any}
      recommendedProducts={recommendedProducts}
      extras={extras}
      settings={settings}
      lang={selectedLang}
    />
  );
}
