import './globals.css'

import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import { Header } from '~/components/header'
import { classNames } from '~/utils/css.utils'
import { Toaster } from 'react-hot-toast'

const font = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'emiliosheinz',
  description: 'TODO',
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
