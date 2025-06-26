import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// Static list of post files for Cloudflare Workers compatibility
const POST_FILES = [
  'hello-world.md',
  'getting-started-with-react.md',
];

export type PostData = {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
};

export async function getSortedPostsData(): Promise<Omit<PostData, 'content'>[]> {
  const allPostsData = await Promise.all(
    POST_FILES.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fileContents = await import(`../posts/${fileName}?raw`).then(m => m.default);
      const matterResult = matter(fileContents);

      return {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category: matterResult.data.category,
        description: matterResult.data.description,
      };
    })
  );

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  return POST_FILES.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fileName = `${id}.md`;
  const fileContents = await import(`../posts/${fileName}?raw`).then(m => m.default);
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    content: contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: matterResult.data.category,
    description: matterResult.data.description,
  };
}