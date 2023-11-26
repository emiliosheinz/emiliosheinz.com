import { render, screen } from '@testing-library/react'
import { Header } from '../header.component'
import { headerLinks } from '../header.constants'
import { usePathname } from 'next/navigation'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Header', () => {
  it('should render a header element as the root node', () => {
    const { container } = render(<Header />)
    expect(container.innerHTML).toMatch(/^<header/)
  })

  it('should render all header links', () => {
    render(<Header />)
    headerLinks.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeVisible()
      expect(screen.getByText(label).tagName).toBe('A')
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
})
