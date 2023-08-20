'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SliderProps } from './slider.types'

export function Root({ children }: SliderProps) {
  const [leftDragConstraint, setLeftDragConstraint] = useState(0)

  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carouselWidth = carouselRef.current?.scrollWidth ?? 0
    const carouselOffsetWidth = carouselRef.current?.offsetWidth ?? 0

    setLeftDragConstraint(carouselWidth - carouselOffsetWidth)
  }, [])

  return (
    <motion.div
      ref={carouselRef}
      className='cursor-grab overflow-hidden'
      whileTap={{ cursor: 'grabbing' }}
    >
      <motion.div
        drag='x'
        className='flex gap-5'
        dragConstraints={{ right: 0, left: -leftDragConstraint }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
