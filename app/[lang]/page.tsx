import { Metadata } from 'next';
import { getProducts, getTestimonials, getGalleryImages, getSettings } from '@/lib/i18n/server';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';
import Gallery from '@/components/home/Gallery';
import type { SupportedLanguage } from '@/types';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const translations: Record<string, Record<string, string>> = {
    az: {
      title: 'Snacky - Premium Fast Food',
      description: 'Azərbaycanın ən yaxşı premium fast food təcrübəsi. Təzə və keyfiyyətli məhsullardan hazırlanan burgerlər, qarnirlər və içkilər.',
    },
    tr: {
      title: 'Snacky - Premium Fast Food',
      description: 'Azerbaycan\'ın en iyi premium fast food deneyimi. Taze ve kaliteli ürünlerden yapılan burgerler, yan ürünler ve içecekler.',
    },
    en: {
      title: 'Snacky - Premium Fast Food',
      description: 'Experience the best premium fast food in Azerbaijan. Gourmet burgers, sides, and drinks made with fresh, high-quality ingredients.',
    },
  };

  const t = translations[lang] || translations.en;

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://snacky.az/${lang}`,
      languages: {
        az: 'https://snacky.az/az',
        tr: 'https://snacky.az/tr',
        en: 'https://snacky.az/en',
      },
    },
  };
}

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const products = await getProducts(selectedLang);
  const testimonials = await getTestimonials(selectedLang);
  const galleryImages = await getGalleryImages();
  const settings = await getSettings(selectedLang);

  // Filter featured/popular products
  const featuredProducts = products
    .filter((p: any) => p.is_featured || p.is_popular)
    .slice(0, 12);

  return (
    <>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      {galleryImages.length > 0 && <Gallery images={galleryImages} />}
    </>
  );
}
