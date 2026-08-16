import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../../lib/site-config';
import { renderOgImage } from '../../lib/og-image';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { id: post.id },
    props: {
      title: post.data.title,
      tags: post.data.tags,
    },
  }));
}

interface Props {
  title: string;
  tags: string[];
}

export async function GET({ props }: { props: Props }) {
  return renderOgImage({
    title: props.title,
    tags: props.tags,
    footerText: SITE_CONFIG.name,
  });
}
