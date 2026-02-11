import { NextResponse } from 'next/server';
import { getBaseUrl } from '../../../lib/site-config';

export async function GET() {
  const baseUrl = getBaseUrl();

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
