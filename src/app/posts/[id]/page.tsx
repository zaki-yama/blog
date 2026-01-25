import { getAllPostIds, getPostData } from '../../../../lib/posts';
import Link from 'next/link';
import SocialShareButtons from '../../../components/SocialShareButtons';
import TableOfContents from '../../../components/TableOfContents';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '../../../../lib/structured-data';
import { generateArticleMetadata } from '../../../../lib/meta-tags';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/posts/${id}`;

  return generateArticleMetadata({
    title: postData.title,
    description: postData.description || postData.title,
    url: currentUrl,
    publishedTime: postData.date,
    category: postData.category,
    author: 'zaki-yama',
  });
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/posts/${id}`;

  const articleJsonLd = generateArticleJsonLd({
    title: postData.title,
    description: postData.description || postData.title,
    author: 'zaki-yama',
    datePublished: postData.date,
    category: postData.category,
    url: currentUrl,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: baseUrl },
    { name: postData.title, url: currentUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <div className="relative px-8 py-8">
        {/* Main article - centered */}
        <article className="mx-auto max-w-[896px]">
          <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 inline-flex items-center gap-2 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-4 font-mono">
              <time>{postData.date}</time>
              <span>·</span>
              <span>{postData.category}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {postData.title}
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: postData.content }} />
          </div>

          <footer className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
            <SocialShareButtons
              title={postData.title}
              url={currentUrl}
              description={postData.description}
            />
          </footer>
        </article>

        {/* Table of Contents - fixed position on right side */}
        <aside className="hidden xl:block fixed top-24 right-8 w-64">
          <TableOfContents content={postData.content} />
        </aside>
      </div>
    </>
  );
}
