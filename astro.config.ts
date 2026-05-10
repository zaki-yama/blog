import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

function rehypeHeadingIds() {
  return (tree: any) => {
    function getText(node: any): string {
      if (node.type === 'text') return node.value || '';
      if (Array.isArray(node.children)) {
        return node.children.map(getText).join('');
      }
      return '';
    }

    function slugify(text: string): string {
      return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
    }

    function visitNode(node: any): void {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (!node.properties) node.properties = {};
        if (!node.properties.id) {
          node.properties.id = slugify(getText(node));
        }
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          visitNode(child);
        }
      }
    }

    visitNode(tree);
  };
}

export default defineConfig({
  output: 'static',
  site: 'https://blog.zaki-yama.dev',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true,
    },
    rehypePlugins: [rehypeHeadingIds],
  },
});
