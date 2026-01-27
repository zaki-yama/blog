import { NextResponse } from 'next/server';
import { getSortedPostsData } from '../../../lib/posts';
import { generateSitemap, formatDateForSitemap, getSitemapConfig } from '../../../lib/sitemap';

export async function GET() {
  const posts = await getSortedPostsData();
  const config = getSitemapConfig();
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    // Homepage
    {
      loc: config.baseUrl,
      lastmod: currentDate,
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    // Blog posts
    ...posts.map((post) => ({
      loc: `${config.baseUrl}/posts/${post.id}`,
      lastmod: formatDateForSitemap(post.date),
      changefreq: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const sitemapXml = generateSitemap(urls);

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
