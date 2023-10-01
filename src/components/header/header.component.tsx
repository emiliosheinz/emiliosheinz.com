'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Image } from '../image'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { usePreviousRoute } from '~/hooks/usePreviousRoute'

const headerLinks = [
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Experience',
    href: '#experience',
  },
  {
    label: 'Blog',
    href: '#blog',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const previousRoute = usePreviousRoute()

  const isHome = pathname === '/'

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    const href = e.currentTarget.href
    const targetId = href.replace(/.*\#/, '')
    const targetElement = document.getElementById(targetId)

    if (!targetElement) return

    const approximateHeaderHeight = 150
    const targetElementTop = targetElement.getBoundingClientRect().top

    window.scrollTo({
      top: targetElementTop + window.scrollY - approximateHeaderHeight,
      behavior: 'smooth',
    })
  }

  const renderLinks = () => {
    if (!isHome) {
      return (
        <button
          className='group text-base sm:text-lg hover:cursor-pointer'
          onClick={() => {
            if (previousRoute) router.back()
            else router.replace('/')
          }}
        >
          <FaArrowLeftLong className='inline transition-all ease-in-out group-hover:-translate-x-1 group-hover:text-dodgerBlue mr-3' />
          <span className='transition-all ease-in-out group-hover:text-dodgerBlue'>
            go back
          </span>
        </button>
      )
    }

    return headerLinks.map(({ href, label }) => (
      <Link
        key={label}
        href={href}
        onClick={handleScroll}
        className='font-bold text-xl px-2 transition-colors hover:text-dodgerBlue no-underline'
      >
        {label}
      </Link>
    ))
  }

  return (
    <header className='fixed bg-codGray-500 top-0 left-0 right-0 z-40'>
      <div className='flex items-center w-full max-w-6xl m-auto py-2 sm:py-5 px-5 overflow-y-scroll'>
        <div className='flex flex-1 space-x-5 mr-10'>{renderLinks()}</div>
        <Link href='/' className='min-w-max'>
          <Image
            src='/images/profile.png'
            width={62}
            height={62}
            className='rounded-full'
            alt="Emilio Schaedler Heinzmann's picture in black and white with a blue background"
          />
        </Link>
      </div>
    </header>
  )
}
