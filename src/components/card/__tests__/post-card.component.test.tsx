import { render, screen } from "@testing-library/react";
import { PostCard } from "../card.component";
import { CardProps } from "../card.types";
import { faker } from "@faker-js/faker";

const makePostCardProps = (): CardProps => ({
  title: faker.lorem.words(3),
  description: faker.lorem.words(15),
  url: faker.internet.url(),
  image: faker.image.url(),
  className: faker.lorem.word(),
});

describe("PostCard", () => {
  it("should render the correct title", () => {
    const props = makePostCardProps();
    render(<PostCard {...props} />);
    const titleEl = screen.getByText(props.title);
    expect(titleEl).toBeVisible();
  });

  it("should render the correct description", () => {
    const props = makePostCardProps();
    render(<PostCard {...props} />);
    const descriptionEl = screen.getByText(props.description);
    expect(descriptionEl).toBeVisible();
  });

  it("should render link with the correct url", () => {
    const props = makePostCardProps();
    render(<PostCard {...props} />);
    const linkEl = screen.getByText("read more").closest("a");
    expect(linkEl).toHaveAttribute("href", props.url);
  });

  it("should render image with the correct src and alt", () => {
    const props = makePostCardProps();
    render(<PostCard {...props} />);
    const image = screen.getByAltText(props.title);
    const encodedImageSrc = encodeURIComponent(props.image as string);
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining(encodedImageSrc),
    );
    expect(image).toHaveAttribute("alt", props.title);
  });
});
