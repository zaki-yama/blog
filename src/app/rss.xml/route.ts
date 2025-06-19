import { NextResponse } from 'next/server';
import { getSortedPostsData } from '../../../lib/posts';
import { generateRSSFeed, getRSSConfig } from '../../../lib/rss';

export async function GET() {
  const posts = getSortedPostsData();
  const config = getRSSConfig();

  const rssItems = posts.map((post) => ({
    title: post.title,
    description: post.description || post.title,
    url: `${config.siteUrl}/posts/${post.id}`,
    date: post.date,
    category: post.category,
  }));

  const rssXml = generateRSSFeed(rssItems, config);

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}