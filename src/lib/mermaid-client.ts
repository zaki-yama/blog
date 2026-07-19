function currentTheme(): 'dark' | 'default' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default';
}

async function renderAll() {
  const nodes = document.querySelectorAll<HTMLElement>('div.mermaid');
  if (nodes.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({ startOnLoad: false, theme: currentTheme() });

  for (const node of nodes) {
    if (node.dataset.mermaidSource === undefined) {
      node.dataset.mermaidSource = node.textContent ?? '';
    }
    node.removeAttribute('data-processed');
    node.textContent = node.dataset.mermaidSource;
  }

  await mermaid.run({ nodes: Array.from(nodes) });
}

export function initMermaid() {
  renderAll();

  // Re-render with the matching theme when the user toggles dark mode.
  const observer = new MutationObserver(() => {
    renderAll();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}
