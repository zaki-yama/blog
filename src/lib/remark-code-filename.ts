import { visit } from 'unist-util-visit';

// Allows specifying a filename in fenced code blocks via a `lang:filename`
// info string, e.g. ```js:main.js```. The filename is moved into the code
// node's `meta` string as `filename="..."` so a Shiki transformer can pick
// it up later (see shiki-transformer-filename.ts).
const LANG_FILENAME_PATTERN = /^([\w+#-]+):(.+)$/;

export function remarkCodeFilename() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (!node.lang) return;

      const match = LANG_FILENAME_PATTERN.exec(node.lang);
      if (!match) return;

      const [, lang, filename] = match;
      node.lang = lang;

      const filenameMeta = `filename="${filename.replace(/"/g, '&quot;')}"`;
      node.meta = node.meta ? `${filenameMeta} ${node.meta}` : filenameMeta;
    });
  };
}
