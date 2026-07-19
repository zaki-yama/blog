import { visit } from 'unist-util-visit';

// Matches a fenced code block marked as mermaid, e.g. ```mermaid
const MERMAID_FENCE_PATTERN = /^```\s*mermaid\b/m;

export function containsMermaidBlock(text: string): boolean {
  return MERMAID_FENCE_PATTERN.test(text);
}

function getCodeText(node: any): string {
  return (node.children ?? [])
    .filter((child: any) => child.type === 'text')
    .map((child: any) => child.value)
    .join('');
}

// Turns a `pre > code.language-mermaid` block (left unhighlighted by shiki via
// excludeLangs) into a `div.mermaid` container that mermaid.js hydrates client-side.
export function rehypeMermaid() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index, parent: any) => {
      if (node.tagName !== 'pre' || !parent || index == null) return;

      const code = (node.children ?? []).find(
        (child: any) => child.type === 'element' && child.tagName === 'code'
      );
      if (!code) return;

      const className: string[] = code.properties?.className ?? [];
      if (!className.includes('language-mermaid')) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid'] },
        children: [{ type: 'text', value: getCodeText(code) }],
      };
    });
  };
}
