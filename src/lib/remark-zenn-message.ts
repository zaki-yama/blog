import { visit } from 'unist-util-visit';

// Zenn-style message syntax:
// :::message
// ...
// :::
// :::message alert
// ...
// :::
// The "alert" variant isn't valid remark-directive attribute syntax, so it's
// rewritten into `:::message{.alert}` before parsing.
const ALERT_FENCE_PATTERN = /^:::message[ \t]+alert[ \t]*$/gm;

export function remarkZennMessage(this: any) {
  const previousParser = this.parser;
  this.parser = (doc: string, file: any) =>
    previousParser(doc.replace(ALERT_FENCE_PATTERN, ':::message{.alert}'), file);

  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'message') return;

      const isAlert = node.attributes?.class === 'alert';
      node.data ??= {};
      node.data.hName = 'div';
      node.data.hProperties = {
        className: ['msg-block', isAlert ? 'msg-block-alert' : 'msg-block-info'],
      };
    });
  };
}
