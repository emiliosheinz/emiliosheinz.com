import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'

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
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  )
}
