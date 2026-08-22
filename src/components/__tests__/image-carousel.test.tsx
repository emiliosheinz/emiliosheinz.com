import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageCarousel } from "../image-carousel";

const images = [
  { src: "/a.jpg", alt: "alpha", width: 800, height: 600 },
  { src: "/b.jpg", alt: "beta", width: 600, height: 800 },
  { src: "/c.jpg", alt: "gamma", width: 1600, height: 900 },
];

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

describe("ImageCarousel", () => {
  it("renders one button per image with aria labels", () => {
    render(<ImageCarousel images={images} />);

    for (let i = 0; i < images.length; i++) {
      expect(
        screen.getByRole("button", {
          name: `Open image ${i + 1}: ${images[i].alt}`,
        }),
      ).toBeInTheDocument();
    }
  });

  it("renders one indicator per image and marks the first as current", () => {
    render(<ImageCarousel images={images} />);

    const indicators = images.map((_, i) =>
      screen.getByRole("button", { name: `Go to image ${i + 1}` }),
    );

    expect(indicators[0]).toHaveAttribute("aria-current", "true");
    expect(indicators[1]).toHaveAttribute("aria-current", "false");
  });

  it("scrolls the container when an indicator is clicked", async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} />);

    await user.click(screen.getByRole("button", { name: "Go to image 3" }));

    expect(Element.prototype.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });

  it("opens the focused modal when an image is clicked", async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Open image 2: beta" }),
    );

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByAltText("beta")).toBeInTheDocument();
  });

  it("renders prev/next buttons; prev is disabled at the start", () => {
    render(<ImageCarousel images={images} />);

    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next image" })).toBeEnabled();
  });

  it("closes the modal via the close button", async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} />);

    await user.click(
      screen.getByRole("button", { name: "Open image 1: alpha" }),
    );
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Close image" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
