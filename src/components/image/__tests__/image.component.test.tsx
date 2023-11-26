import { render, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { Image } from '../image.component'
import { ImageProps } from 'next/image'

const makeImageProps = (): ImageProps => ({
  width: faker.number.int(),
  height: faker.number.int(),
  src: faker.image.url(),
  alt: faker.lorem.sentence(),
})

describe('Image', () => {
  it('should render the image with the provided width and height', () => {
    const { alt, ...props } = makeImageProps()
    render(<Image {...props} alt={alt} />)

    const image = screen.getByRole('img')

    expect(image).toHaveAttribute('width', props.width!.toString())
    expect(image).toHaveAttribute('height', props.height!.toString())
  })

  it('should render the image with the provided alt', () => {
    const { alt, ...props } = makeImageProps()
    render(<Image {...props} alt={alt} />)

    const image = screen.getByRole('img')

    expect(image).toHaveAttribute('alt', alt)
  })

  it('should render the image with the provided src', () => {
    const { alt, ...props } = makeImageProps()
    render(<Image {...props} alt={alt} />)

    const image = screen.getByRole('img')

    const expectedResult = encodeURIComponent(props.src as string)

    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(expectedResult)
    )
  })

  it('should render the image with the provided style', () => {
    const { alt, ...props } = makeImageProps()
    const style = { color: 'red' }
    render(<Image {...props} alt={alt} style={style} />)

    const image = screen.getByRole('img')

    expect(image).toHaveStyle(style)
  })
})
