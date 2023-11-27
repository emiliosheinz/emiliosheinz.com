import { render, screen } from '@testing-library/react'
import { Link } from '../link.component'
import { faker } from '@faker-js/faker'

describe('Link', () => {
  it('should render link with correct label and href', () => {
    const href = faker.internet.url()
    const label = faker.lorem.words(3)

    render(<Link href={href} label={label} />)

    const labelEl = screen.getByText(label)
    const linkEl = screen.getByRole('link')

    expect(labelEl).toBeVisible()
    expect(linkEl).toHaveAttribute('href', href)
  })

  it('should render an arrow right icon', () => {
    const href = faker.internet.url()
    const label = faker.lorem.words(3)

    render(<Link href={href} label={label} />)

    const iconEl = screen.getByTestId('arrow-right-icon')

    expect(iconEl).toBeVisible()
  })
})
