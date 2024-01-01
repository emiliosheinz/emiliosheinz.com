'use client'

import { useKBar } from 'kbar'
import { useMemo } from 'react'

export function CommandBarTrigger() {
  const { query } = useKBar()

  const isMac = /(Mac)/i.test(navigator.userAgent)
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

  const label = useMemo(() => {
    if (isMobile) {
      return <span>Tap to start</span>
    }

    if (isMac) {
      return (
        <span>
          Press <kbd>⌘</kbd> <kbd>K</kbd> to start
        </span>
      )
    }

    return (
      <span>
        Press <kbd>ctrl</kbd> <kbd>K</kbd> to start
      </span>
    )
  }, [isMac, isMobile])

  return (
    <button
      className='px-4 py-2 rounded-md hover:cursor-pointer border border-white border-opacity-0 hover:border-opacity-25 bg-white bg-opacity-0 hover:bg-opacity-5 transition-all ease-in-out'
      onClick={query.toggle}
    >
      {label}
    </button>
  )
}
