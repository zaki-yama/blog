import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../../../lib/site-config';
import { getAllTags, getPostsByTag } from '../../../lib/tags';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const tags = getAllTags(posts);
  return tags.map(({ tag }) => ({
    params: { tag },
    props: { posts: getPostsByTag(posts, tag) },
  }));
}

interface Props {
  posts: Awaited<ReturnType<typeof getCollection<'posts'>>>;
}

export async function GET({ params, props }: { params: { tag?: string }; props: Props }) {
  const { tag } = params;
  const { posts } = props;

  return rss({
    title: `${tag} | ${SITE_CONFIG.name}`,
    description: `「${tag}」タグが付いた記事の一覧`,
    site: SITE_CONFIG.url.base,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/posts/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
