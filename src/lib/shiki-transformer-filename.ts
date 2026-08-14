import type { Element } from 'hast';
import type { ShikiTransformer } from 'shiki';

const FILENAME_META_PATTERN = /filename="([^"]*)"/;

// Reads the `filename="..."` meta added by remark-code-filename.ts and wraps
// the rendered <pre> with a real title-bar element above it, so the filename
// is selectable/copyable text rather than CSS-generated content.
export function transformerFilename(): ShikiTransformer {
  return {
    name: 'filename',
    pre(node): Element | void {
      const raw = this.options.meta?.__raw;
      if (!raw) return;

      const match = FILENAME_META_PATTERN.exec(raw);
      if (!match) return;

      return {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-wrapper'] },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-filename'] },
            children: [{ type: 'text', value: match[1] }],
          },
          node,
        ],
      };
    },
  };
}
