import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import { Header } from '~/components/header'
import { classNames } from '~/utils/css.utils'

const font = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'emiliosheinz',
  description: 'TODO',
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' className='bg-codGray-500 scroll-smooth'>
      <body
        className={classNames(
          font.className,
          'text-white py-10 px-16 max-w-6xl m-auto'
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
