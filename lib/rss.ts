interface RSSItem {
  title: string;
  description: string;
  url: string;
  date: string;
  category: string;
}

interface RSSConfig {
  title: string;
  description: string;
  siteUrl: string;
  language: string;
  author: string;
}

export function generateRSSFeed(items: RSSItem[], config: RSSConfig): string {
  const { title, description, siteUrl, language, author } = config;
  
  const rssItems = items
    .map((item) => {
      const pubDate = new Date(item.date).toUTCString();
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${item.category}]]></category>
      <author><![CDATA[${author}]]></author>
    </item>`;
    })
    .join('');

  const lastBuildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${siteUrl}</link>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastBuildDate}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor><![CDATA[${author}]]></managingEditor>
    <webMaster><![CDATA[${author}]]></webMaster>
    <generator>Next.js Blog</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>${rssItems}
  </channel>
</rss>`.trim();
}

export function getRSSConfig(): RSSConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    title: 'Technical Blog',
    description: 'A blog for sharing programming knowledge and learning experiences',
    siteUrl: baseUrl,
    language: 'ja',
    author: 'zaki-yama',
  };
}