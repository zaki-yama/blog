import { visit } from 'unist-util-visit';

// Matches a bare link to a single tweet, e.g. https://x.com/user/status/123
const TWEET_URL_SOURCE = 'https?://(?:twitter\\.com|x\\.com)/[^/\\s]+/status/\\d+(?:\\?\\S*)?';
const TWEET_URL_PATTERN = new RegExp(`^${TWEET_URL_SOURCE}$`);

export function containsTweetUrl(text: string): boolean {
  return new RegExp(TWEET_URL_SOURCE).test(text);
}

function getSoleTextValue(node: any): string | null {
  if (node.children?.length !== 1) return null;
  const child = node.children[0];
  return child.type === 'text' ? child.value : null;
}

// Turns a paragraph containing only a bare tweet URL into a twitter-tweet
// blockquote, which Twitter's widgets.js hydrates into a full embed on the client.
export function rehypeTwitterEmbed() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'p' || node.children.length !== 1) return;

      const link = node.children[0];
      if (link.type !== 'element' || link.tagName !== 'a') return;

      const href = link.properties?.href;
      if (typeof href !== 'string' || !TWEET_URL_PATTERN.test(href)) return;
      if (getSoleTextValue(link) !== href) return;

      node.tagName = 'blockquote';
      node.properties = { className: ['twitter-tweet'] };
      node.children = [{ type: 'element', tagName: 'a', properties: { href }, children: [] }];
    });
  };
}
