import { posts } from '~/content/posts'

export default async function sitemap() {
  const blogs = posts.map(post => ({
    url: `https://emiliosheinz.com/posts/${post.slug}`,
    lastModified: post.publishedAt,
  }))

  const routes = ['', '/posts', '/experiences'].map(route => ({
    url: `https://emiliosheinz.com${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
