import { SITE_CONFIG } from './site-config';

interface ArticleStructuredData {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  category: string;
  url: string;
  imageUrl?: string;
}

interface WebSiteStructuredData {
  name: string;
  description: string;
  url: string;
  author: string;
}

export function generateArticleJsonLd(data: ArticleStructuredData) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${data.url.split('/posts')[0]}/favicon.ico`,
      },
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    url: data.url,
    ...(data.imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: data.imageUrl,
      },
    }),
    articleSection: data.category,
    inLanguage: 'ja-JP',
  };

  return JSON.stringify(jsonLd);
}

export function generateWebSiteJsonLd(data: WebSiteStructuredData) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    description: data.description,
    url: data.url,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: data.name,
      logo: {
        '@type': 'ImageObject',
        url: `${data.url}/favicon.ico`,
      },
    },
    inLanguage: 'ja-JP',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${data.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(jsonLd);
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(jsonLd);
}

export function generateOrganizationJsonLd(baseUrl: string) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    sameAs: [
      'https://github.com/zaki-yama/blog',
    ],
  };

  return JSON.stringify(jsonLd);
}