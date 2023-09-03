import './globals.css'

import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { Roboto_Mono } from 'next/font/google'
import { Header } from '~/components/header'
import { classNames } from '~/utils/css.utils'
import { Toaster } from 'react-hot-toast'

const font = Roboto_Mono({ subsets: ['latin'] })

const ogDescription =
  'As an experienced Software Engineer graduated with a B.Sc. degree in Computer Science, I have been working on the development of applications that are daily accessed by thousands of users since 2019. I bring ideas to life through lines of code.'

export const metadata: Metadata = {
  metadataBase: new URL('https://emiliosheinz.com'),
  title: {
    default: 'emiliosheinz',
    template: '%s | emiliosheinz',
  },
  description: ogDescription,
  openGraph: {
    title: 'Emilio Schaedler Heinzmann',
    description: ogDescription,
    url: 'https://emiliosheinz.com',
    siteName: 'emiliosheinz',
    locale: 'en-US',
    type: 'website',
    images: '/images/profile.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: 'Emilio Schaedler Heinzmann',
    images: '/images/profile.png',
    card: 'summary_large_image',
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

function CustomToaster() {
  return (
    <Toaster
      position='bottom-center'
      toastOptions={{
        style: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
        },
      }}
    />
  )
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang='en'
      className={classNames(
        font.className,
        'bg-codGray-500 text-white scroll-smooth'
      )}
    >
      <body className={'pb-10 pt-32 sm:pt-48 px-5 max-w-6xl m-auto'}>
        <Header />
        {children}
        <CustomToaster />
      </body>
    </html>
  )
}
