import { Action } from 'kbar'
import { useRouter } from 'next/navigation'
import {
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineLink,
} from 'react-icons/hi2'
import { notify } from '~/utils/toast.utils'

export function useActions(): Action[] {
  const router = useRouter()

  return [
    {
      id: 'copy-url',
      name: 'Copy URL',
      keywords: 'copy url',
      perform: () => {
        navigator.clipboard.writeText(window.location.href)
        notify.success('Current URL copied to clipboard')
      },
      icon: <HiOutlineLink className='w-5 h-5 text-white' />,
      shortcut: ['u'],
      section: 'Utils',
    },
    {
      id: 'source-code',
      name: 'Source code',
      keywords: 'source code',
      perform: () => {
        window.open(
          'https://github.com/emiliosheinz/emiliosheinz.com',
          '_blank'
        )
      },
      icon: <HiOutlineCodeBracket className='w-5 h-5 text-white' />,
      shortcut: ['c'],
      section: 'Utils',
    },
    {
      id: 'home',
      name: 'Home',
      keywords: 'home page start initial',
      perform: () => router.push('/'),
      icon: <HiOutlineHome className='w-5 h-5 text-white' />,
      shortcut: ['g', 'h'],
      section: 'Go to',
    },
    {
      id: 'experience',
      name: 'Experience',
      keywords: 'experience work jobs',
      perform: () => router.push('/experiences'),
      icon: <HiOutlineLightBulb className='w-5 h-5 text-white' />,
      shortcut: ['g', 'e'],
      section: 'Go to',
    },
    {
      id: 'blog-posts',
      name: 'Blog Posts',
      keywords: 'blog posts articles',
      perform: () => router.push('/posts'),
      icon: <HiOutlineBookOpen className='w-5 h-5 text-white' />,
      shortcut: ['g', 'p'],
      section: 'Go to',
    },
  ]
}
