import { render, screen } from "@testing-library/react";
import { Item } from "../item.component";

describe("Slider.Item", () => {
  it("should render children within a div element", () => {
    render(
      <Item>
        <div>TEST</div>
      </Item>,
    );

    expect(screen.getByText("TEST")).toBeVisible();
    expect(screen.getByText("TEST").parentElement?.tagName).toBe("DIV");
  });
});
