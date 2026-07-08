'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/snacky', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/snacky', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://tiktok.com/@snacky', label: 'TikTok' },
];

const quickLinks = [
  { href: '/', label: 'nav.home' },
  { href: '/menu', label: 'nav.menu' },
  { href: '/about', label: 'nav.about' },
  { href: '/contact', label: 'nav.contact' },
  { href: '/faq', label: 'faq.title' },
];

function getLocalizedHref(href: string, lang: string): string {
  if (href === '/') return `/${lang}`;
  return `/${lang}${href}`;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Footer() {
  const { t, language } = useI18n();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="relative bg-[#050505] border-t border-border">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ffb400/5] pointer-events-none" />

      <div className="container-padding mx-auto relative">
        {/* Main Footer */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${language}`} className="inline-block mb-6">
              <span className="text-3xl font-bold text-gradient">Snacky</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('about.mission', 'Premium fast food experience with quality ingredients and exceptional taste.')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-muted hover:bg-primary/10 rounded-xl border border-border hover:border-primary/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalizedHref(link.href, language)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {t(link.label, link.label.split('.').pop())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">
              {t('contact.title', 'Contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  {t('contact.address', '28 May Street, Baku, Azerbaijan')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+994501234567" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  +994 50 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@snacky.az" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  info@snacky.az
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">
              {t('footer.newsletter', 'Subscribe for updates')}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get exclusive offers and new menu updates
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.email', 'Email address')}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none text-sm"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary py-3"
              >
                {t('footer.subscribe', 'Subscribe')}
              </motion.button>
            </form>

            {/* Opening Hours */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t('contact.hours', 'Opening Hours')}</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Mon-Sun: 10:00 - 22:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Snacky. {t('footer.rights', 'All rights reserved')}
            </p>

            <div className="flex items-center gap-6">
              <Link href={`/${language}/privacy`} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href={`/${language}/terms`} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
