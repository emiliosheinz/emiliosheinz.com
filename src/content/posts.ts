import { Post, allPosts } from 'contentlayer/generated'

export const posts = allPosts.sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
)

export function getLastFivePosts(): Post[] {
  return posts.slice(0, 5)
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}
