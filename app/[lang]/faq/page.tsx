import { Metadata } from 'next';
import { getSettings } from '@/lib/i18n/server';
import FAQClient from './FAQClient';
import type { SupportedLanguage } from '@/types';

export const metadata: Metadata = {
  title: 'FAQ - Snacky',
  description: 'Frequently asked questions about Snacky premium fast food.',
};

export default async function FAQPage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const settings = await getSettings(selectedLang);
  return <FAQClient lang={selectedLang} />;
}
