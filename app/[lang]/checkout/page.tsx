import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSettings, getOpeningHours } from '@/lib/i18n/server';
import CheckoutClient from './CheckoutClient';
import type { SupportedLanguage } from '@/types';

export const metadata: Metadata = {
  title: 'Checkout - Snacky',
  description: 'Complete your order at Snacky Premium Fast Food',
};

export default async function CheckoutPage({ params: { lang } }: { params: { lang: string } }) {
  const selectedLang = lang as SupportedLanguage;
  const [settings, openingHours] = await Promise.all([
    getSettings(selectedLang),
    getOpeningHours(),
  ]);

  return (
    <CheckoutClient
      settings={settings}
      openingHours={openingHours}
      lang={selectedLang}
    />
  );
}
