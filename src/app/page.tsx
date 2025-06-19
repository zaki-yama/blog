import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { generateWebSiteJsonLd, generateOrganizationJsonLd } from '../../lib/structured-data';

export default function Home() {
  const allPostsData = getSortedPostsData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const websiteJsonLd = generateWebSiteJsonLd({
    name: 'Technical Blog',
    description: 'A blog for sharing programming knowledge and learning experiences',
    url: baseUrl,
    author: 'zaki-yama',
  });

  const organizationJsonLd = generateOrganizationJsonLd(baseUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
      />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tech Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">プログラマーの学習記録とアウトプット</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPostsData.map(({ id, date, title, category, description }) => (
          <Link key={id} href={`/posts/${id}`} className="group">
            <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-900/25 transition-shadow duration-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>📅 {date}</span>
                <span>•</span>
                <span>🏷️ {category}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
