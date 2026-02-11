import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import Header from '../components/Header';
import { generateSiteMetadata } from '../../lib/meta-tags';
import { SITE_CONFIG, getBaseUrl } from '../../lib/site-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = generateSiteMetadata({
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  url: getBaseUrl(),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <Header />
        <main>{children}</main>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
