import { render, screen } from '@testing-library/react'
import { Header } from '../header.component'
import { headerLinks } from '../header.constants'
import { usePathname, useRouter } from 'next/navigation'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

let mockPreviousRoute: string | undefined
jest.mock('~/hooks/usePreviousRoute', () => ({
  usePreviousRoute: jest.fn(() => mockPreviousRoute),
}))
jest.mock('~/components/command-bar', () => ({
  CommandBarTriggerLite: () => <div>CommandBarTriggerLite</div>,
}))

describe('Header', () => {
  it('should render a header element as the root node', () => {
    const { container } = render(<Header />)
    expect(container.innerHTML).toMatch(/^<header/)
  })

  it('should render all header links when on home page', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    headerLinks.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeVisible()
      expect(screen.getByText(label).tagName).toBe('A')
    })
  })

  it('should not render the header links when not on the home page', () => {
    mockUsePathname.mockReturnValue('/not-home')
    render(<Header />)
    headerLinks.forEach(({ label }) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    })
  })

  it('should render a back button when not on the home page', () => {
    mockUsePathname.mockReturnValue('/not-home')
    render(<Header />)
    expect(screen.getByText('go back')).toBeVisible()
  })

  it('should not render a back button when on the home page', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    expect(screen.queryByText('go back')).not.toBeInTheDocument()
  })

  it('should call router back when the back button is clicked and there is previous route', () => {
    mockUsePathname.mockReturnValue('/not-home')
    const mockBack = jest.fn()
    mockUseRouter.mockReturnValue({ back: mockBack } as any)
    mockPreviousRoute = '/previous-route'

    render(<Header />)
    screen.getByText('go back').click()

    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('should call replace when the back button is clicked and there is no previous route', () => {
    mockUsePathname.mockReturnValue('/not-home')
    const mockReplace = jest.fn()
    mockUseRouter.mockReturnValue({ replace: mockReplace } as any)
    mockPreviousRoute = undefined

    render(<Header />)
    screen.getByText('go back').click()

    expect(mockReplace).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith('/')
  })

  it('should render the lite command bar trigger', () => {
    render(<Header />)
    expect(screen.getByText('CommandBarTriggerLite')).toBeVisible()
  })
})
