import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { generateWebSiteJsonLd, generateOrganizationJsonLd } from '../../lib/structured-data';

export default async function Home() {
  const allPostsData = await getSortedPostsData();
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
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-5">
            <img
              src="/logo.png"
              alt="zaki-yama.dev"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                zaki-yama.dev
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                プログラマーの学習記録とアウトプット
              </p>
            </div>
          </div>
        </header>

        <section>
          <div className="space-y-0">
            {allPostsData.map(({ id, date, title, category }, index) => (
              <Link key={id} href={`/posts/${id}`} className="group block">
                <article className={`grid grid-cols-[100px_1fr] gap-6 py-4 ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
                  <div className="text-sm text-gray-400 dark:text-gray-500 pt-0.5 font-mono">
                    {date}
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-relaxed">
                      {title}
                    </h2>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 inline-block">
                      {category}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
