import { Metadata } from 'next';
import { getSettings, getOpeningHours } from '@/lib/i18n/server';
import ContactClient from './ContactClient';
import type { SupportedLanguage } from '@/types';

export const metadata: Metadata = {
  title: 'Contact - Snacky',
  description: 'Contact Snacky - Find our location, opening hours, and get in touch.',
};

export default async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const [settings, openingHours] = await Promise.all([
    getSettings(selectedLang),
    getOpeningHours(),
  ]);

  return <ContactClient settings={settings} openingHours={openingHours} lang={selectedLang} />;
}
