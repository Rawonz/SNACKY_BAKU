'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { SupportedLanguage } from '@/types';

interface Props {
  lang: SupportedLanguage;
}

const faqs = [
  {

    question: 'What are your delivery hours?',
    answer: 'We deliver during our opening hours, typically from 10:00 AM to 10:00 PM on weekdays and 11:00 AM to 9:00 PM on Sundays. Check our contact page for the most current hours.',
  },
  {
    question: 'How can I place an order?',
    answer: 'You can place an order through our website. Simply browse our menu, add items to your cart, and complete your checkout via WhatsApp. Our team will confirm your order and prepare it fresh for you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Currently, we accept cash on delivery and payment through WhatsApp. We are working on adding more payment options in the future.',
  },
  {
    question: 'Is there a minimum order amount?',
    answer: 'The minimum order amount for delivery varies by location. Contact us for specific details about your area. Orders above a certain amount may qualify for free delivery.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery times typically range from 30-45 minutes depending on your location and order size. We prepare every order fresh to ensure the best quality.',
  },
  {
    question: 'Do you have vegetarian options?',
    answer: 'Yes! We have a variety of vegetarian options including our popular Veggie Burger, salads, and vegetarian sides. Look for the vegetarian indicator on our menu items.',
  },
  {
    question: 'Are your products halal?',
    answer: 'Yes, all our meat products are sourced from halal-certified suppliers. We take great care in ensuring all our ingredients meet halal requirements.',
  },
  {
    question: 'How can I apply a coupon code?',
    answer: 'You can apply a coupon code in your cart before checkout. Enter the code in the coupon field and click "Apply" to see your discount reflected in the total.',
  },
];

export default function FAQClient({ lang }: Props) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-padding mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="heading-lg mb-4">{t('faq.title', 'Frequently Asked Questions')}</h1>
          <p className="text-muted-foreground">
            Find answers to the most common questions about Snacky
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-premium border-0 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left">
                  <span className="font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a href={`/${lang}/contact`} className="btn-primary inline-flex">
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
