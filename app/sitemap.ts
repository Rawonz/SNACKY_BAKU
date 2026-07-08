import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snacky.az';
  const languages = ['az', 'tr', 'en'];

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/menu', priority: 0.9 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.7 },
    { path: '/faq', priority: 0.6 },
  ];

  const routes: MetadataRoute.Sitemap = [];

  // Generate routes for each language
  languages.forEach((lang) => {
    staticRoutes.forEach(({ path, priority }) => {
      routes.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority,
      });
    });
  });

  return routes;
}
