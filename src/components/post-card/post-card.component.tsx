import { FaArrowRightLong } from 'react-icons/fa6'
import { PostCardProps } from './post-card.types'
import { Image } from '../image'

export function PostCard({ title, description, url, image }: PostCardProps) {
  return (
    <a
      href={url}
      className='bg-codGray-400 rounded-lg mb-5 hover:-translate-y-2 transition duration-500 cursor-pointer w-full max-w-xs overflow-hidden'
    >
      <Image
        src={image}
        width={320}
        height={180}
        alt={title}
        style={{ objectFit: 'cover' }}
      />
      <div className='p-5'>
        <h5 className='font-bold text-xl mb-2 line-clamp-3'>{title}</h5>
        <p className='font-normal text-xs mb-3 line-clamp-5'>{description}</p>
        <div className='flex justify-end'>
          <span className='self-end hover:cursor-pointer'>
            read more&nbsp;
            <FaArrowRightLong className='inline' />
          </span>
        </div>
      </div>
    </a>
  )
}
