import { ImageProps } from 'next/image'
import { Image as CustomImage } from '~/components/image'

export function Image(props: ImageProps) {
  return (
    <div className='relative w-full aspect-video'>
      <CustomImage
        fill
        style={{ objectFit: 'contain' }}
        sizes={`
          (min-width: 1024px) 1024px,
          100vw
        `}
        {...props}
      />
    </div>
  )
}
