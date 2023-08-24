import { ReactElement, cloneElement, useRef } from 'react'
import { FaCopy } from 'react-icons/fa6'

type PreProps = JSX.IntrinsicElements['pre']

export function Pre({ children, ...props }: PreProps) {
  const codeRef = useRef<HTMLElement>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(codeRef.current?.textContent))
  }

  return (
    <pre {...props} className='relative p-6 rounded'>
      {cloneElement(children as ReactElement, { ref: codeRef })}
      <button
        onClick={copyToClipboard}
        aria-label='Copy to clipboard'
        className='absolute top-0 right-0 p-3 opacity-50 hover:opacity-100 transition-opacity'
      >
        <FaCopy />
      </button>
    </pre>
  )
}
