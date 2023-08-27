'use client'

import Link from 'next/link'
import { Image } from '../image'

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

  return (
    <header className='fixed from-codGray-500 from-10% bg-gradient-to-b top-0 left-0 right-0 z-40'>
      <div className='flex items-center w-full max-w-6xl m-auto py-10 px-5'>
        <Link href='/'>
          <Image
            src='/images/profile.png'
            width={62}
            height={62}
            alt="Black and white picture of the website's owner on a sky blue background"
            className='rounded-full'
          />
        </Link>
        <div className='hidden sm:flex flex-1 justify-end space-x-5'>
          {headerLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={handleScroll}
              className='font-bold text-xl px-2 transition-colors hover:text-dodgerBlue'
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
