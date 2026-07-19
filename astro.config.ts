import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import { remarkImageSize } from './src/lib/remark-image-size';
import { remarkZennMessage } from './src/lib/remark-zenn-message';
import { rehypeTwitterEmbed } from './src/lib/rehype-twitter-embed';
import { rehypeLinkCard } from './src/lib/rehype-link-card';
import { rehypeMermaid } from './src/lib/rehype-mermaid';

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

    function createAnchorLink(id: string) {
      return {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          className: ['heading-anchor'],
          ariaLabel: 'この見出しへのリンク',
        },
        children: [
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              ariaHidden: 'true',
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
                },
                children: [],
              },
            ],
          },
        ],
      };
    }

    function visitNode(node: any): void {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (!node.properties) node.properties = {};
        if (!node.properties.id) {
          node.properties.id = slugify(getText(node));
        }
        node.children = node.children || [];
        node.children.push(createAnchorLink(node.properties.id));
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
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    remarkPlugins: [remarkImageSize, remarkDirective, remarkZennMessage],
    rehypePlugins: [rehypeMermaid, rehypeHeadingIds, rehypeTwitterEmbed, rehypeLinkCard],
  },
});
