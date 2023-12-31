'use client'

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  Action,
} from 'kbar'

import { useRouter } from 'next/navigation'
import {
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
} from 'react-icons/hi2'
import { classNames } from '~/utils/css.utils'

type CommandBar = {
  children: React.ReactNode
}

function useActions(): Action[] {
  const router = useRouter()

  return [
    {
      id: 'home',
      name: 'Home',
      keywords: 'home page start initial',
      perform: () => router.push('/'),
      icon: <HiOutlineHome className='w-5 h-5 text-white' />,
      shortcut: ['g', 'h'],
    },
    {
      id: 'experience',
      name: 'Experience',
      keywords: 'experience work jobs',
      perform: () => router.push('/experiences'),
      icon: <HiOutlineLightBulb className='w-5 h-5 text-white' />,
      shortcut: ['g', 'e'],
    },
    {
      id: 'blog-posts',
      name: 'Blog Posts',
      keywords: 'blog posts articles',
      perform: () => router.push('/posts'),
      icon: <HiOutlineBookOpen className='w-5 h-5 text-white' />,
      shortcut: ['g', 'p'],
    },
  ]
}

function RenderResults() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        const itemClassNames = classNames(
          'px-5 py-3 flex gap-5 items-center',
          active ? 'bg-codGray-300' : 'bg-transparent'
        )

        if (typeof item === 'string') {
          return <div className={itemClassNames}>{item}</div>
        }

        return (
          <div className={itemClassNames}>
            {item.icon}
            <span
              className={classNames(
                'text-white',
                active ? 'opacity-100' : 'opacity-50'
              )}
            >
              {item.name}
            </span>
          </div>
        )
      }}
    />
  )
}

export function CommandBar(props: CommandBar) {
  const { children } = props

  const actions = useActions()

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className='z-40 bg-codGray-500 bg-opacity-90'>
          <KBarAnimator className='w-full max-w-xl backdrop-blur-xl bg-codGray-300 rounded-md bg-opacity-40'>
            <KBarSearch className='w-full h-12 p-5 bg-transparent rounded-md outline-none' />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  )
}
