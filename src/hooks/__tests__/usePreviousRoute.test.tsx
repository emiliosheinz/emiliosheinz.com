import { renderHook } from '@testing-library/react'
import { usePreviousRoute } from '../usePreviousRoute'

let mockPathName = '/mock-path-name'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => mockPathName),
}))

describe('usePreviousRoute', () => {
  it('should return null', () => {
    const { result } = renderHook(() => usePreviousRoute())
    expect(result.current).toBeNull()
  })

  it('should return previous route', () => {
    const { result, rerender } = renderHook(() => usePreviousRoute())

    rerender()
    const previousRoute = mockPathName
    mockPathName = '/new-mock-path-name'
    rerender()

    expect(result.current).toBe(previousRoute)
  })
})
