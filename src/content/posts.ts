import { Post, allPosts } from "contentlayer/generated";

export const posts = allPosts.sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

export function getLastFivePosts(): Post[] {
  return posts.slice(0, 5);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

type GetRandomPostsParams = {
  excludeSlug: string;
  count: number;
};

export function getRandomPosts({ excludeSlug, count }: GetRandomPostsParams) {
  const filteredPosts = posts.filter((post) => post.slug !== excludeSlug);
  const randomPosts = filteredPosts.sort(() => 0.5 - Math.random());
  return randomPosts.slice(0, count);
}
