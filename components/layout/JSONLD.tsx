export function RestaurantJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Snacky',
    description: 'Premium Fast Food Experience - Gourmet burgers, sides, and drinks made with fresh ingredients.',
    url: 'https://snacky.az',
    logo: 'https://snacky.az/logo.png',
    image: 'https://snacky.az/og-image.jpg',
    priceRange: '$$',
    servesCuisine: ['Fast Food', 'Burgers', 'American'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '28 May Street',
      addressLocality: 'Baku',
      addressCountry: 'AZ',
      postalCode: 'AZ1000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.4093',
      longitude: '49.8671',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '10:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '10:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '21:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+994-50-123-45-67',
      contactType: 'orders',
    },
    hasMenu: {
      '@type': 'Menu',
      name: 'Snacky Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Burgers',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Classic Burger',
              description: '100% beef patty, fresh vegetables and special sauce',
              offers: {
                '@type': 'Offer',
                price: '9.50',
                priceCurrency: 'AZN',
              },
            },
            {
              '@type': 'MenuItem',
              name: 'Double Cheese',
              description: 'Double cheese, double meat - pure delight',
              offers: {
                '@type': 'Offer',
                price: '12.50',
                priceCurrency: 'AZN',
              },
            },
          ],
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2500',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Snacky',
    url: 'https://snacky.az',
    logo: 'https://snacky.az/logo.png',
    sameAs: [
      'https://instagram.com/snacky.az',
      'https://facebook.com/snacky.az',
      'https://tiktok.com/@snacky.az',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+994-50-123-45-67',
      contactType: 'customer service',
      availableLanguage: ['Azerbaijani', 'Turkish', 'English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': 'https://snacky.az/#local-business',
    name: 'Snacky Premium Fast Food',
    image: 'https://snacky.az/og-image.jpg',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '28 May Street',
      addressLocality: 'Baku',
      addressRegion: 'Baku',
      postalCode: 'AZ1000',
      addressCountry: 'AZ',
    },
    telephone: '+994501234567',
    servesCuisine: ['Fast Food', 'Burger', 'American'],
    hasDeliveryService: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
