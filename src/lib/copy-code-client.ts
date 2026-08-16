const COPIED_LABEL = 'コピーしました';
const DEFAULT_LABEL = 'コードをコピー';
const COPIED_DURATION_MS = 2000;

async function copyCode(button: HTMLButtonElement) {
  const code = button.dataset.code ?? '';

  try {
    await navigator.clipboard.writeText(code);
  } catch {
    return;
  }

  window.clearTimeout(Number(button.dataset.resetTimeoutId));

  button.classList.add('copied');
  button.setAttribute('aria-label', COPIED_LABEL);

  const timeoutId = window.setTimeout(() => {
    button.classList.remove('copied');
    button.setAttribute('aria-label', DEFAULT_LABEL);
  }, COPIED_DURATION_MS);
  button.dataset.resetTimeoutId = String(timeoutId);
}

export function initCopyCodeButtons() {
  document.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.copy-code-button');
    if (!button) return;

    copyCode(button);
  });
}
