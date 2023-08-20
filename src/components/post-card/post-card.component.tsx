import { FaArrowRightLong } from 'react-icons/fa6'
import { PostCardProps } from './post-card.types'
import { Image } from '../image'

export function PostCard({ title, description, url, image }: PostCardProps) {
  return (
    <div className='bg-codGray-400 rounded-lg mb-5 w-72 overflow-hidden'>
      <Image
        src={image}
        width={320}
        height={180}
        alt={title}
        style={{ objectFit: 'cover' }}
        className='pointer-events-none'
      />
      <div className='p-5'>
        <h5 className='font-bold text-xl mb-2 line-clamp-3'>{title}</h5>
        <p className='font-normal text-xs mb-3 line-clamp-5'>{description}</p>
        <div className='flex justify-end'>
          <a href={url} className='self-end hover:cursor-pointer'>
            read more&nbsp;
            <FaArrowRightLong className='inline' />
          </a>
        </div>
      </div>
    </div>
  )
}
