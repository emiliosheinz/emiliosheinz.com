import { Metadata } from 'next'
import { PostCard } from '~/components/post-card'
import { posts } from '~/content/posts'

export const metadata: Metadata = {
  title: 'Blog Posts',
}

export default function BlogPostsPage() {
  return (
    <div className='flex flex-col gap-8'>
      <h1 className='font-bold text-4xl sm:text-5xl mb-2 sm:mb-5'>
        Blog posts
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
        {posts.map(post => (
          <PostCard key={post.title} {...post} className='w-full sm:w-full' />
        ))}
      </div>
    </div>
  )
}
