import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Blog</h1>
          <p className="text-lg text-gray-600">プログラマーの学習記録とアウトプット</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allPostsData.map(({ id, date, title, category, description }) => (
            <Link key={id} href={`/posts/${id}`} className="group">
              <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>📅 {date}</span>
                  <span>•</span>
                  <span>🏷️ {category}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
