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
  return (
    <header className='flex flex-row items-center'>
      <Link href='/'>
        <Image
          src='/images/profile.png'
          width={62}
          height={62}
          alt="Black and white picture of the website's owner on a sky blue background"
          className='rounded-full'
        />
      </Link>
      <div className='flex flex-1 justify-end space-x-5'>
        {headerLinks.map(({ href, label }) => (
          <a
            key={label}
            href={href}
            className='font-bold focus:text-dodgerBlue text-xl px-2 focus:outline-none'
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  )
}
