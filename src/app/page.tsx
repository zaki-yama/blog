import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { generateWebSiteJsonLd, generateOrganizationJsonLd } from '../../lib/structured-data';
import { SITE_CONFIG, getBaseUrl } from '../../lib/site-config';

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  const baseUrl = getBaseUrl();

  const websiteJsonLd = generateWebSiteJsonLd({
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: baseUrl,
    author: SITE_CONFIG.author.name,
  });

  const organizationJsonLd = generateOrganizationJsonLd(baseUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd }} />
      <div className="mx-auto px-8 py-12 max-w-[896px]">
        <header className="mb-12">
          <div className="flex items-center gap-5">
            <img src="/logo.png" alt={SITE_CONFIG.name} className="w-24 h-24 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {SITE_CONFIG.name}
              </h1>
            </div>
          </div>
        </header>

        <section>
          <div className="space-y-0">
            {allPostsData.map(({ id, date, title, category }, index) => (
              <Link key={id} href={`/posts/${id}`} className="group block">
                <article
                  className={`grid grid-cols-[100px_1fr] gap-6 py-4 ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
                >
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
