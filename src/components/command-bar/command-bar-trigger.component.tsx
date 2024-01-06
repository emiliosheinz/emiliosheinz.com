'use client'

import { useKBar } from 'kbar'
import { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'

export function CommandBarTriggerFull() {
  const { query } = useKBar()
  const [userAgent, setUserAgent] = useState('')

  /**
   * This useEffect is required because the navigator is only defined on the client side.
   * Therefore, we need to wait for the client to render before we can access the navigator.
   */
  useEffect(() => {
    setUserAgent(navigator.userAgent)
  }, [])

  if (!userAgent) return null

  const isMac = /(Mac)/i.test(navigator.userAgent)
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

  const renderLabel = () => {
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
  }

  return (
    <button
      className='px-4 py-2 rounded border bg-white border-white bg-opacity-0 border-opacity-0 hover:bg-opacity-5 hover:border-opacity-20 transition-all ease-in-out'
      onClick={query.toggle}
    >
      {renderLabel()}
      <FaArrowRightLong
        data-testid='arrow-right-icon'
        className='inline transition-all ease-in-out group-hover:translate-x-1 group-hover:text-dodgerBlue ml-3'
      />
    </button>
  )
}

export function CommandBarTriggerLite() {
  const { query } = useKBar()

  return (
    <button
      className='px-2.5 rounded border bg-white border-white bg-opacity-0 border-opacity-0 hover:bg-opacity-5 hover:border-opacity-20 transition-all ease-in-out'
      onClick={query.toggle}
      title='Open command bar'
    >
      <span className='text-3xl text-white'>⌘</span>
    </button>
  )
}
