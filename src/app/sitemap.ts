import { MetadataRoute } from 'next';
import { ALLOWED_DOMAINS } from '@/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrls = ALLOWED_DOMAINS.map((domain) => ({
    url: `https://${domain}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  return [
    ...baseUrls,
  ];
}
