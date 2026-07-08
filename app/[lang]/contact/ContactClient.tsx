'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import type { OpeningHour, SupportedLanguage } from '@/types';

interface Props {
  settings: Record<string, string>;
  openingHours: OpeningHour[];
  lang: SupportedLanguage;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ContactClient({ settings, openingHours, lang }: Props) {
  const { t } = useI18n();

  const socials = [
    { icon: Instagram, href: settings.instagram || '#', label: 'Instagram' },
    { icon: Facebook, href: settings.facebook || '#', label: 'Facebook' },
    { icon: MessageCircle, href: `https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`, label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-padding mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="heading-lg mb-4">{t('contact.title', 'Contact')}</h1>
          <p className="text-muted-foreground">
            Visit us or get in touch. We&apos;d love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Address */}
            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contact.address', 'Address')}</h3>
                  <p className="text-muted-foreground">{settings.address_full}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('checkout.phone', 'Phone')}</h3>
                  <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('footer.email', 'Email')}</h3>
                  <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card-premium p-6">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Opening Hours & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Opening Hours */}
            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{t('contact.hours', 'Opening Hours')}</h3>
              </div>

              <div className="space-y-3">
                {openingHours.map((hour) => (
                  <div
                    key={hour.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">{DAYS[hour.day_of_week]}</span>
                    <span className={hour.is_closed ? 'text-red-500' : 'font-medium'}>
                      {hour.is_closed
                        ? t('contact.closed', 'Closed')
                        : `${hour.open_time} - ${hour.close_time}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="card-premium overflow-hidden h-[300px]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(settings.address_full || 'Baku, Azerbaijan')}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Call to Action */}
            <motion.a
              href={`tel:${settings.phone}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full text-center flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
