import { getBaseUrl } from './site-config';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map((url) => {
      return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`.trim();
}

export function formatDateForSitemap(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function getSitemapConfig() {
  return {
    baseUrl: getBaseUrl(),
  };
}