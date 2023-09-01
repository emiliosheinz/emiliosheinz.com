import { FaArrowLeft, FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import { Directions, LinkProps } from './link.types'
import NextLink from 'next/link'

export function Link({ href, label, direction = 'right' }: LinkProps) {
  const renderLeftArrow = () => {
    if (direction === 'left') {
      return (
        <FaArrowLeft className='inline transition-all ease-in-out group-hover:-translate-x-1 group-hover:text-dodgerBlue mr-3' />
      )
    }

    return null
  }

  const renderRightArrow = () => {
    if (direction === 'right') {
      return (
        <FaArrowRightLong className='inline transition-all ease-in-out group-hover:translate-x-1 group-hover:text-dodgerBlue ml-3' />
      )
    }

    return null
  }

  return (
    <NextLink
      className='group text-base sm:text-lg hover:cursor-pointer no-underline'
      href={href}
    >
      {renderLeftArrow()}
      <span className='transition-all ease-in-out group-hover:text-dodgerBlue'>{`${label}`}</span>
      {renderRightArrow()}
    </NextLink>
  )
}
