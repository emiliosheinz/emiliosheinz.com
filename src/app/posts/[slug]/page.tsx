import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "~/components/image";
import { MDXContent } from "~/components/mdx-content";
import { Card } from "~/components/card";
import { Section } from "~/components/section";
import { Slider } from "~/components/slider";
import { getPostBySlug, getRandomPosts, posts } from "~/content/posts";
import { useRouter } from "next/router";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  props: PostPageProps,
): Promise<Metadata | undefined> {
  const post = getPostBySlug((await props.params).slug);

  if (!post) return;

  const { title, description, publishedAt } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: publishedAt,
      url: `https://emiliosheinz.com/posts/${post.slug}`,
      images: post.image,
    },
    twitter: {
      title,
      description,
      images: post.image,
      card: "summary_large_image",
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <h1 className="font-bold text-3xl sm:text-5xl md-5">{post.title}</h1>
      <div className="relative flex aspect-video w-full">
        <Image
          fill
          priority
          alt={post.title}
          src={post.image}
          style={{ objectFit: "cover" }}
          sizes={`
            (min-width: 1024px) 1024px,
            100vw
          `}
          className='rounded-lg'
        />
      </div>
      <MDXContent code={post.body.code} />
      <Section title="Other Blog Posts" id="blog">
        <Slider.Root>
          {getRandomPosts({ count: 3, excludeSlug: post.slug }).map(
            ({ title, url, image, description }) => (
              <Slider.Item key={title}>
                <Card
                  url={url}
                  image={image}
                  title={title}
                  description={description}
                />
              </Slider.Item>
            ),
          )}
        </Slider.Root>
      </Section>
    </>
  );
}
