import { render, screen } from "@testing-library/react";
import React from "react";

async function renderSliderRoot() {
  const { Root } = await import("../root.component");

  return render(
    <Root>
      <div>TEST</div>
    </Root>,
  );
}

describe("Slider.Root", () => {
  it("should render children", async () => {
    await renderSliderRoot();
    expect(screen.getByText("TEST")).toBeVisible();
  });

  it("should set left drag constraint according to scroll and offset widths", async () => {
    const scrollWidth = 100;
    const offsetWidth = 50;
    const mockSetState = jest.fn();

    jest
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockReturnValueOnce(scrollWidth);
    jest
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValueOnce(offsetWidth);
    jest.spyOn(React, "useState").mockReturnValueOnce([0, mockSetState]);

    await renderSliderRoot();

    expect(mockSetState).toHaveBeenCalledWith(scrollWidth - offsetWidth);
  });

  it("should set left drag constraint with default values", async () => {
    const mockSetState = jest.fn();

    jest
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockReturnValueOnce(undefined as unknown as number);
    jest
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValueOnce(undefined as unknown as number);
    jest.spyOn(React, "useState").mockReturnValueOnce([0, mockSetState]);

    await renderSliderRoot();

    expect(mockSetState).toHaveBeenCalledWith(0);
  });
});
