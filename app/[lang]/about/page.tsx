import { Metadata } from 'next';
import { getSettings } from '@/lib/i18n/server';
import AboutClient from './AboutClient';
import type { SupportedLanguage } from '@/types';

export const metadata: Metadata = {
  title: 'About Us - Snacky',
  description: 'Learn about Snacky, our mission, and our premium fast food philosophy.',
};

export default async function AboutPage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const settings = await getSettings(selectedLang);

  return <AboutClient settings={settings} lang={selectedLang} />;
}
