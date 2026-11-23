import { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../lib/site-config';

type Theme = 'light' | 'dark' | 'system';

const SunIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zM12 19a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM5.05 6.464L3.636 5.05a1 1 0 00-1.414 1.414L3.636 7.88a1 1 0 001.414-1.415zM18.95 17.536l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zM22 12a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM5 12a1 1 0 01-1 1H2a1 1 0 110-2h2a1 1 0 011 1zM18.95 6.464a1 1 0 001.414-1.414L18.95 3.636a1 1 0 00-1.414 1.414l1.414 1.414zM5.05 17.536a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414L5.05 17.536z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SystemIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path strokeLinecap="round" d="M8 20h8M12 16v4" />
  </svg>
);

const THEME_OPTIONS: { value: Theme; label: string; Icon: () => React.ReactElement }[] = [
  { value: 'light', label: 'ライト', Icon: SunIcon },
  { value: 'dark', label: 'ダーク', Icon: MoonIcon },
  { value: 'system', label: 'システム', Icon: SystemIcon },
];

function resolveIsDark(theme: Theme, prefersDark: boolean): boolean {
  return theme === 'system' ? prefersDark : theme === 'dark';
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>('system');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

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

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setMenuOpen(false);
    localStorage.setItem('theme', newTheme);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', resolveIsDark(newTheme, prefersDark));
  };

  const currentOption = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[2];

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

            <div ref={menuRef} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={`テーマ切り替え（現在: ${currentOption.label}）`}
                title={`テーマ: ${currentOption.label}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <currentOption.Icon />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 z-10 flex flex-col gap-1 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                >
                  {THEME_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={theme === value}
                      aria-label={label}
                      title={label}
                      onClick={() => handleThemeChange(value)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        theme === value
                          ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800'
                          : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
