import type { CollectionEntry } from 'astro:content';

export interface TagCount {
  tag: string;
  count: number;
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
}

export function getPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string,
): CollectionEntry<'posts'>[] {
  return posts
    .filter((post) => post.data.tags.includes(tag))
    .toSorted((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}
