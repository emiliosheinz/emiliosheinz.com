import { render, screen } from "@testing-library/react";
import { Card } from "../card.component";
// TODO - emiliosheinz: DRY these components
import { CardProps } from "../card.types";
import { faker } from "@faker-js/faker";

const makeCardProps = (): CardProps => ({
  title: faker.lorem.words(3),
  description: faker.lorem.words(15),
  url: faker.internet.url(),
  image: faker.image.url(),
  className: faker.lorem.word(),
});

describe("Card", () => {
  it("should render the correct title", () => {
    const props = makeCardProps();
    render(<Card {...props} />);
    const titleEl = screen.getByText(props.title);
    expect(titleEl).toBeVisible();
  });

  it("should render the correct description", () => {
    const props = makeCardProps();
    render(<Card {...props} />);
    const descriptionEl = screen.getByText(props.description);
    expect(descriptionEl).toBeVisible();
  });

  it("should render link with the correct url", () => {
    const props = makeCardProps();
    render(<Card {...props} />);
    const linkEl = screen.getByText("read more").closest("a");
    expect(linkEl).toHaveAttribute("href", props.url);
  });

  it("should render image with the correct src and alt", () => {
    const props = makeCardProps();
    render(<Card {...props} />);
    const image = screen.getByAltText(props.title);
    const encodedImageSrc = encodeURIComponent(props.image as string);
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining(encodedImageSrc),
    );
    expect(image).toHaveAttribute("alt", props.title);
  });
});
