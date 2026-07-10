function getSoleTextValue(node: any): string | null {
  if (node.children?.length !== 1) return null;
  const child = node.children[0];
  return child.type === 'text' ? child.value : null;
}

// A <p> containing nothing but a link whose text is the link's own URL,
// e.g. a URL pasted on its own line in Markdown.
export function getBareLinkHref(node: any): string | null {
  if (node.tagName !== 'p' || node.children.length !== 1) return null;

  const link = node.children[0];
  if (link.type !== 'element' || link.tagName !== 'a') return null;

  const href = link.properties?.href;
  if (typeof href !== 'string') return null;
  if (getSoleTextValue(link) !== href) return null;

  return href;
}
