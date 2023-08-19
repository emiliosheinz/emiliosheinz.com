import {
  FaArrowRightLong,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa6'
import { PostCard } from '~/components/post-card'

const socialMedias = [
  {
    name: 'GitHub',
    Icon: FaGithub,
    url: 'https://github.com/emiliosheinz',
  },
  {
    name: 'LinkedIn',
    Icon: FaLinkedin,
    url: 'https://www.linkedin.com/in/emiliosheinz/',
  },
  {
    name: 'Twitter',
    Icon: FaTwitter,
    url: 'https://twitter.com/emiliosheinz',
  },
]

const blogPosts = [
  {
    title:
      'Increase React render performance by avoiding unnecessary useEffects',
    description:
      'A common mistake I see people making while creating their React component is creating extra states and effects. That may cause unexpected bugs and extra renders.',
    url: 'https://emiliosheinz.medium.com/increase-react-render-performance-by-avoiding-unnecessary-useeffects-5feea728271b',
    image:
      '/images/blog-posts/increase-react-render-performance-by-avoiding-unnecessary-useeffects.webp',
  },
  {
    title: 'How to create a new GitHub Release through Azure Pipelines',
    description:
      'Creating a new GitHub release is a common task that a lot of developers are supposed to do during their careers. But on the other hand, it is not as well documented as it could. There are a lot of little tricky things that you will discover only during the process.',
    url: 'https://medium.com/geekculture/how-to-create-a-new-github-release-through-azure-pipelines-6ee4e61cd7d',
    image:
      '/images/blog-posts/how-to-create-a-new-github-release-through-azure-pipelines.webp',
  },
  {
    title: 'How to setup multiple environments in React Native',
    description:
      'In this article I’ll explain a bit more about how to setup different environments in React Native and how to properly manage them across Javascript and native code.',
    url: 'https://medium.com/cwi-software/how-to-setup-multiple-environments-for-react-native-786005a360fc',
    image:
      '/images/blog-posts/how-to-setup-multiple-environments-in-react-native.webp',
  },
]

export default function Home() {
  return (
    <main className='flex flex-col space-y-24 py-24'>
      <div className='flex flex-col space-y-8'>
        <h1 className='font-bold text-5xl'>{`Hello 👋, I'm Emilio.`}</h1>
        <p className='text-2xl max-w-3xl'>
          As an experienced Software Engineer graduated with a B.Sc. degree in
          Computer Science, I have been working on the development of
          applications that are daily accessed by thousands of users since 2019.
        </p>
        <a className='group text-lg hover:cursor-pointer'>
          read more about me{' '}
          <FaArrowRightLong className='inline group-hover:transition-all group-hover:translate-x-1 duration-300 ease-in-out' />
        </a>
      </div>

      <div className='flex flex-col space-y-8'>
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
        <a className='text-lg hover:cursor-pointer'>
          see all posts <FaArrowRightLong className='inline' />
        </a>
      </div>

      <div className='flex flex-col space-y-8'>
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
