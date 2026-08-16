import type { Element } from 'hast';
import type { ShikiTransformer } from 'shiki';

// Adds a "copy code" button as a child of the generated <pre>, positioned via
// CSS. Must run before transformerFilename() in the transformers list: that
// transformer replaces the <pre> node with a wrapping <div>, so this hook
// needs to append the button while `node` is still the real <pre> element.
export function transformerCopyButton(): ShikiTransformer {
  return {
    name: 'copy-button',
    pre(node): void {
      node.children.push(createCopyButton(this.source));
    },
  };
}

function createCopyButton(code: string): Element {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: ['copy-code-button'],
      ariaLabel: 'コードをコピー',
      'data-code': code,
    },
    children: [
      {
        type: 'element',
        tagName: 'svg',
        properties: {
          className: ['icon-copy'],
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
            tagName: 'rect',
            properties: { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'path',
            properties: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' },
            children: [],
          },
        ],
      },
      {
        type: 'element',
        tagName: 'svg',
        properties: {
          className: ['icon-check'],
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
            tagName: 'polyline',
            properties: { points: '20 6 9 17 4 12' },
            children: [],
          },
        ],
      },
    ],
  };
}
