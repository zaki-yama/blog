/**
 * Site-wide configuration constants
 * All site metadata should be defined here to maintain consistency
 */

export const SITE_CONFIG = {
  // Site information
  name: 'zaki-yama.dev',
  description: 'A blog for sharing programming knowledge and learning experiences',

  // Author information
  author: {
    name: 'zaki-yama',
    twitter: '@zaki___yama',
  },

  // URL configuration
  url: {
    base: 'https://blog.zaki-yama.dev',
    logo: 'https://blog.zaki-yama.dev/logo.png',
  },

  // Localization
  locale: 'ja_JP',

  // SEO
  keywords: ['プログラミング', '技術ブログ', 'エンジニア', 'Web開発'] as string[],
};

/**
 * Get base URL with fallback to environment variable
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url.base;
}
