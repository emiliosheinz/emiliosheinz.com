import { useMDXComponent } from 'next-contentlayer/hooks'
import { Image } from '~/components/image'
import { getPostBySlug, posts } from '~/content/posts'

type PostPageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  const MDXContent = useMDXComponent(post!.body.code)

  return (
    <div className='flex flex-col gap-8 mt-20 text-lg'>
      <h1 className='font-bold text-5xl mb-5'>{post?.title}</h1>
      <div className='relative flex aspect-video w-full'>
        <Image
          fill
          alt={post!.title}
          src={post!.image}
          style={{ objectFit: 'cover' }}
          sizes={`
            (min-width: 1024px) 1024px,
            100vw
          `}
        />
      </div>
      <MDXContent />
    </div>
  )
}
