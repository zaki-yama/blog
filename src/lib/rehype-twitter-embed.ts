import { visit } from 'unist-util-visit';
import { getBareLinkHref } from './hast-utils';

// Matches a bare link to a single tweet, e.g. https://x.com/user/status/123
const TWEET_URL_SOURCE = 'https?://(?:twitter\\.com|x\\.com)/[^/\\s]+/status/\\d+(?:\\?\\S*)?';
const TWEET_URL_PATTERN = new RegExp(`^${TWEET_URL_SOURCE}$`);

export function containsTweetUrl(text: string): boolean {
  return new RegExp(TWEET_URL_SOURCE).test(text);
}

export function isTweetUrl(url: string): boolean {
  return TWEET_URL_PATTERN.test(url);
}

// Turns a paragraph containing only a bare tweet URL into a twitter-tweet
// blockquote, which Twitter's widgets.js hydrates into a full embed on the client.
export function rehypeTwitterEmbed() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      const href = getBareLinkHref(node);
      if (!href || !TWEET_URL_PATTERN.test(href)) return;

      node.tagName = 'blockquote';
      node.properties = { className: ['twitter-tweet'] };
      node.children = [{ type: 'element', tagName: 'a', properties: { href }, children: [] }];
    });
  };
}
