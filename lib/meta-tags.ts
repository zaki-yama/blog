import { Metadata } from 'next';

interface ArticleMetadata {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  category: string;
  author: string;
  image?: string;
}

interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function generateArticleMetadata(data: ArticleMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Generate dynamic OG image URL
  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('title', data.title);
  ogImageUrl.searchParams.set('category', data.category);
  ogImageUrl.searchParams.set('type', 'article');
  
  const image = data.image || ogImageUrl.toString();

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.description,
      url: data.url,
      siteName: 'Technical Blog',
      publishedTime: data.publishedTime,
      modifiedTime: data.modifiedTime || data.publishedTime,
      authors: [data.author],
      tags: [data.category],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [image],
      creator: '@zaki_yama',
      site: '@zaki_yama',
    },
    authors: [{ name: data.author }],
    category: data.category,
    keywords: [data.category, 'プログラミング', '技術ブログ', 'エンジニア'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateSiteMetadata(data: SiteMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Generate dynamic OG image URL for site
  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('title', data.title);
  ogImageUrl.searchParams.set('type', 'site');
  
  const image = data.image || ogImageUrl.toString();

  return {
    title: {
      default: data.title,
      template: `%s | ${data.title}`,
    },
    description: data.description,
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    openGraph: {
      type: 'website',
      title: data.title,
      description: data.description,
      url: data.url,
      siteName: data.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [image],
      creator: '@zaki_yama',
      site: '@zaki_yama',
    },
    keywords: ['プログラミング', '技術ブログ', 'エンジニア', 'Web開発', 'JavaScript', 'TypeScript'],
    authors: [{ name: 'zaki-yama' }],
    creator: 'zaki-yama',
    publisher: 'zaki-yama',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add verification codes when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: data.url,
      types: {
        'application/rss+xml': '/rss.xml',
      },
    },
  };
}