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
      <div className="max-w-2xl mx-auto px-5 py-8">
        <header className="mb-10">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="zaki-yama.dev"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                zaki-yama.dev
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                プログラマーの学習記録とアウトプット
              </p>
            </div>
          </div>
        </header>

        <section>
          <div className="space-y-0">
            {allPostsData.map(({ id, date, title, category }, index) => (
              <Link key={id} href={`/posts/${id}`} className="group block">
                <article className={`grid grid-cols-[90px_1fr] gap-4 py-3 ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
                  <div className="text-xs text-gray-400 dark:text-gray-500 pt-0.5 font-mono">
                    {date}
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-relaxed">
                      {title}
                    </h2>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 inline-block">
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
