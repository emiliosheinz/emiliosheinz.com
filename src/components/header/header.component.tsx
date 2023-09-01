'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Image } from '../image'
import { useCallback, useEffect } from 'react'
import { Link } from '../link'

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

  const renderLinks = useCallback(() => {
    if (!isHome) {
      return <Link href='/' label='back home' direction='left' />
    }

    return headerLinks.map(({ href, label }) => (
      <NextLink
        key={label}
        href={href}
        onClick={handleScroll}
        className='font-bold text-xl px-2 transition-colors hover:text-dodgerBlue no-underline'
      >
        {label}
      </NextLink>
    ))
  }, [isHome])

  return (
    <header className='fixed bg-codGray-500 top-0 left-0 right-0 z-40'>
      <div className='flex items-center w-full max-w-6xl m-auto py-2 sm:py-5 px-5 overflow-y-scroll'>
        <div className='flex flex-1 space-x-5 mr-10'>{renderLinks()}</div>
        <NextLink href='/' className='min-w-max'>
          <Image
            src='/images/profile.png'
            width={62}
            height={62}
            alt="Black and white picture of the website's owner on a sky blue background"
            className='rounded-full'
          />
        </NextLink>
      </div>
    </header>
  )
}
