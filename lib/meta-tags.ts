import { Metadata } from 'next';
import { SITE_CONFIG, getBaseUrl } from './site-config';

interface ArticleMetadata {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  category: string | string[];
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
  const baseUrl = getBaseUrl();

  // Handle category as string or array
  const categoryString = Array.isArray(data.category) ? data.category.join(',') : data.category;
  const categoryArray = Array.isArray(data.category) ? data.category : [data.category];

  // Generate dynamic OG image URL
  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('title', data.title);
  ogImageUrl.searchParams.set('category', categoryString);
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
      siteName: SITE_CONFIG.name,
      publishedTime: data.publishedTime,
      modifiedTime: data.modifiedTime || data.publishedTime,
      authors: [data.author],
      tags: categoryArray,
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
      creator: SITE_CONFIG.author.twitter,
      site: SITE_CONFIG.author.twitter,
    },
    authors: [{ name: data.author }],
    category: categoryString,
    keywords: [...categoryArray, ...SITE_CONFIG.keywords],
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
  const baseUrl = getBaseUrl();
  
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
      creator: SITE_CONFIG.author.twitter,
      site: SITE_CONFIG.author.twitter,
    },
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author.name }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
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
      // Google: 'your-google-verification-code',
      // Yandex: 'your-yandex-verification-code',
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