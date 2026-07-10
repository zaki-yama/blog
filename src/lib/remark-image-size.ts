import { visit } from 'unist-util-visit';

// Zenn-style image size syntax: ![alt](image.jpg =250x) / (=x250) / (=250x250)
// CommonMark doesn't allow an unquoted space inside a link destination, so this
// pattern is rewritten into a valid `title` attribute before parsing, then read
// back out and converted into width/height attributes on the image element.
const RAW_SYNTAX_PATTERN = /!\[([^\]]*)\]\(([^()\s]+)\s+=(\d+x\d*|\d*x\d+)\)/g;
const SIZE_TITLE_PATTERN = /^size=(\d*)x(\d*)$/;

export function remarkImageSize(this: any) {
  const previousParser = this.parser;
  this.parser = (doc: string, file: any) =>
    previousParser(doc.replace(RAW_SYNTAX_PATTERN, '![$1]($2 "size=$3")'), file);

  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      const match = node.title?.match(SIZE_TITLE_PATTERN);
      if (!match) return;

      const [, width, height] = match;
      node.title = null;
      node.data ??= {};
      node.data.hProperties ??= {};
      if (width) node.data.hProperties.width = width;
      if (height) node.data.hProperties.height = height;
    });
  };
}
