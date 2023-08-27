import { ResolvingMetadata } from 'next'
import { Image } from '~/components/image'
import { MDXContent } from '~/components/mdx-content'
import { getPostBySlug, posts } from '~/content/posts'

type PostPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  props: PostPageProps,
  parent: ResolvingMetadata
) {
  const post = getPostBySlug(props.params.slug)

  if (!post) return

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      images: [post.image, ...previousImages],
    },
  }
}

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)

  /** TODO: add post not found handling */
  if (!post) return null

  return (
    <>
      <h1 className='font-bold text-3xl sm:text-5xl md-5'>{post.title}</h1>
      <div className='relative flex aspect-video w-full'>
        <Image
          fill
          priority
          alt={post.title}
          src={post.image}
          style={{ objectFit: 'cover' }}
          sizes={`
            (min-width: 1024px) 1024px,
            100vw
          `}
        />
      </div>
      <MDXContent code={post.body.code} />
    </>
  )
}
