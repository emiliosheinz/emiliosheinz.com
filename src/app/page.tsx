import { Link } from '~/components/link'
import { PostCard } from '~/components/post-card'
import { blogPosts, socialMedias } from '~/utils/data.utils'

export default function Home() {
  return (
    <main className='flex flex-col space-y-24 py-24'>
      <div className='flex flex-col space-y-8' id='about'>
        <h1 className='font-bold text-5xl'>{`Hello 👋, I'm Emilio.`}</h1>
        <p className='text-2xl max-w-3xl'>
          As an experienced Software Engineer graduated with a B.Sc. degree in
          Computer Science, I have been working on the development of
          applications that are daily accessed by thousands of users since 2019.
        </p>
        <Link label='read more about me' href='/todo' />
      </div>

      <div className='flex flex-col space-y-8' id='blog'>
        <h1 className='font-bold text-3xl'>Blog posts</h1>
        <div className='flex space-x-8'>
          {blogPosts.map(({ title, description, url, image }) => (
            <PostCard
              url={url}
              key={title}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </div>
        <Link label='see all posts' href='/todo' />
      </div>

      <div className='flex flex-col space-y-8' id='contact'>
        <h1 className='font-bold text-3xl'>Contact me</h1>
        <p className='text-2xl max-w-3xl'>
          {`I'm always open for a chat!`}
          <br />
          <br />
          Send me an email at{' '}
          <a
            className='underline underline-offset-4'
            href='mailto:emiliosheinz@gmail.com'
          >
            emiliosheinz@gmail.com
          </a>{' '}
          or reach me ou on social media.
        </p>
        <div className='flex space-x-8'>
          {socialMedias.map(({ Icon, url, name }) => (
            <a target='_blank' key={name} href={url}>
              <Icon className='w-8 h-8 hover:text-dodgerBlue hover:cursor-pointer transition-all duration-300 hover:-translate-y-1' />
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
