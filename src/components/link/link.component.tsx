import { FaArrowRightLong } from 'react-icons/fa6'
import { LinkProps } from './link.types'
import NextLink from 'next/link'

export function Link({ href, label }: LinkProps) {
  return (
    <NextLink className='group text-lg hover:cursor-pointer' href={href}>
      {`${label} `}
      <FaArrowRightLong className='inline group-hover:transition-all group-hover:translate-x-1 duration-300 ease-in-out' />
    </NextLink>
  )
}
