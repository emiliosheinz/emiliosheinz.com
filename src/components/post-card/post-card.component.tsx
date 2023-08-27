import { FaArrowRightLong } from 'react-icons/fa6'
import { PostCardProps } from './post-card.types'
import { Image } from '../image'
import { Link } from '../link'

export function PostCard({ title, description, url, image }: PostCardProps) {
  return (
    <div className='flex flex-col bg-codGray-300 rounded-lg mb-5 w-72 sm:w-96 overflow-hidden'>
      <Image
        src={image}
        width={384}
        height={180}
        alt={title}
        style={{ objectFit: 'cover' }}
        className='pointer-events-none'
      />
      <div className='flex flex-1 flex-col justify-between p-3 sm:p-5'>
        <div>
          <h5 className='font-bold text-xl mb-2 line-clamp-3'>{title}</h5>
          <p className='font-normal text-sm mb-3 line-clamp-5'>{description}</p>
        </div>
        <div className='flex justify-end'>
          <Link label='read more' href={url} />
        </div>
      </div>
    </div>
  )
}
