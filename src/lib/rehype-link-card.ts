import { visit } from 'unist-util-visit';
import { getBareLinkHref } from './hast-utils';
import { isTweetUrl } from './rehype-twitter-embed';
import { fetchLinkCardData, type LinkCardData } from './link-card-data';

function buildCardChildren(data: LinkCardData): any[] {
  const textChildren: any[] = [
    {
      type: 'element',
      tagName: 'p',
      properties: { className: ['link-card-title'] },
      children: [{ type: 'text', value: data.title }],
    },
  ];

  if (data.description) {
    textChildren.push({
      type: 'element',
      tagName: 'p',
      properties: { className: ['link-card-description'] },
      children: [{ type: 'text', value: data.description }],
    });
  }

  const metaChildren: any[] = [];
  if (data.favicon) {
    metaChildren.push({
      type: 'element',
      tagName: 'img',
      properties: { className: ['link-card-favicon'], src: data.favicon, alt: '' },
      children: [],
    });
  }
  metaChildren.push({
    type: 'element',
    tagName: 'span',
    properties: { className: ['link-card-domain'] },
    children: [{ type: 'text', value: data.siteName || new URL(data.url).hostname }],
  });

  textChildren.push({
    type: 'element',
    tagName: 'div',
    properties: { className: ['link-card-meta'] },
    children: metaChildren,
  });

  const children: any[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: { className: ['link-card-body'] },
      children: textChildren,
    },
  ];

  if (data.image) {
    children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['link-card-thumbnail'] },
      children: [
        { type: 'element', tagName: 'img', properties: { src: data.image, alt: '' }, children: [] },
      ],
    });
  }

  return children;
}

// Turns a paragraph containing only a bare URL into a card-style preview
// linking out to the page, using its OGP metadata (fetched at build time).
export function rehypeLinkCard() {
  return async (tree: any) => {
    const targets: { node: any; href: string }[] = [];

    visit(tree, 'element', (node: any) => {
      const href = getBareLinkHref(node);
      if (!href || !/^https?:\/\//.test(href) || isTweetUrl(href)) return;
      targets.push({ node, href });
    });

    await Promise.all(
      targets.map(async ({ node, href }) => {
        const data = await fetchLinkCardData(href);
        if (!data) return;

        node.tagName = 'a';
        node.properties = {
          className: ['link-card'],
          href: data.url,
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        };
        node.children = buildCardChildren(data);
      }),
    );
  };
}
