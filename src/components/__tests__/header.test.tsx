import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { HEADER_LINKS, Header } from "../header";

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

jest.mock("~/features/command-bar", () => ({
  CommandBarTriggerLite: () => <div>CommandBarTriggerLite</div>,
}));

describe("Header", () => {
  it("should render a header element as the root node", () => {
    const { container } = render(<Header />);
    expect(container.innerHTML).toMatch(/^<header/);
  });

  it("should render all header links when on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);
    HEADER_LINKS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeVisible();
      expect(screen.getByText(label).tagName).toBe("A");
    });
  });

  it("should should always render the header links", () => {
    mockUsePathname.mockReturnValue("/not-home");
    render(<Header />);
    HEADER_LINKS.forEach(({ label }) => {
      expect(screen.queryByText(label)).toBeVisible();
    });
  });

  it("should render the lite command bar trigger", () => {
    render(<Header />);
    expect(screen.getByText("CommandBarTriggerLite")).toBeVisible();
  });
});
