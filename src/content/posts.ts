import { Post, allPosts } from 'contentlayer/generated'

export const posts = allPosts.sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
)

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}
