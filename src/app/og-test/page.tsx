'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';

export default function OGTestPage() {
  // Only allow access in development environment
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  const [title, setTitle] = useState('React Hooksの基本的な使い方');
  const [category, setCategory] = useState('React');
  
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('title', title);
  ogImageUrl.searchParams.set('category', category);
  ogImageUrl.searchParams.set('type', 'article');

  const siteOgImageUrl = new URL(`${baseUrl}/api/og`);
  siteOgImageUrl.searchParams.set('title', "zaki-yama's blog");
  siteOgImageUrl.searchParams.set('type', 'site');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">OG Image Generator Test</h1>
      
      <div className="space-y-8">
        {/* Article OG Image Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Article OG Image</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogImageUrl.toString()}
              alt="Generated OG Image"
              className="w-full"
            />
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono break-all">
            {ogImageUrl.toString()}
          </div>
        </div>

        {/* Site OG Image Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Site OG Image</h2>
          
          <div className="border rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteOgImageUrl.toString()}
              alt="Generated Site OG Image"
              className="w-full"
            />
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono break-all">
            {siteOgImageUrl.toString()}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Note:</strong> This test page is for development purposes only.</p>
        <p>Generated images are 1200x630px and optimized for social sharing.</p>
      </div>
    </div>
  );
}