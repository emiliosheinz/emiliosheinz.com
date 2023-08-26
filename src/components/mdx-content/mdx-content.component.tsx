'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import { Pre } from './components/pre.component'
import { Image } from './components/image.component'

export function MDXContent({ code }: { code: string }) {
  const Content = useMDXComponent(code)

  return (
    <Content
      components={{
        pre: Pre,
        Image: Image,
      }}
    />
  )
}
