import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../lib/site-config';

type Theme = 'light' | 'dark' | 'system';

function resolveIsDark(theme: Theme, prefersDark: boolean): boolean {
  return theme === 'system' ? prefersDark : theme === 'dark';
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme | null) ?? 'system';
    setTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (currentTheme: Theme) => {
      document.documentElement.classList.toggle(
        'dark',
        resolveIsDark(currentTheme, mediaQuery.matches)
      );
    };

    applyTheme(savedTheme);

    const handleSystemChange = () => {
      const currentTheme = (localStorage.getItem('theme') as Theme | null) ?? 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Theme;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', resolveIsDark(newTheme, prefersDark));
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto px-8 py-5 max-w-[1200px]">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <img
              src="/512x512.png"
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
            {SITE_CONFIG.name}
          </a>

          <nav className="flex items-center space-x-5">
            <a
              href="/rss.xml"
              className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="RSS Feed"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.5 3.25a.75.75 0 0 1 .75-.75C14.053 2.5 22 10.447 22 20.25a.75.75 0 0 1-1.5 0C20.5 11.275 13.225 4 4.25 4a.75.75 0 0 1-.75-.75Zm.75 6.25C10.187 9.5 15 14.313 15 20.25a.75.75 0 0 1-1.5 0A9.25 9.25 0 0 0 4.25 11a.75.75 0 0 1 0-1.5ZM3.5 19a2 2 0 1 1 3.999-.001A2 2 0 0 1 3.5 19Z" />
              </svg>
            </a>

            <a
              href="https://github.com/zaki-yama/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub Repository"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
              </svg>
            </a>

            <select
              value={theme}
              onChange={handleThemeChange}
              aria-label="テーマ切り替え"
              className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="system">システム</option>
            </select>
          </nav>
        </div>
      </div>
    </header>
  );
}
