import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/inbox/'],
      },
    ],
    sitemap: [
      'https://porranenhuma.com/sitemap.xml',
      'https://xablau.email/sitemap.xml',
      'https://biscoito.email/sitemap.xml',
      'https://bolacha.email/sitemap.xml',
      'https://aquelaursa.email/sitemap.xml',
      'https://tuamaeaquelaursa.email/sitemap.xml',
    ],
  };
}
