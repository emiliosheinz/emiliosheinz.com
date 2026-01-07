import { render, screen } from "@testing-library/react";
import React from "react";
import { Slider } from "../slider";

describe("Slider", () => {
  describe("Slider.Item", () => {
    it("should render children within a div element", () => {
      render(
        <Slider.Item>
          <div>TEST</div>
        </Slider.Item>,
      );

      expect(screen.getByText("TEST")).toBeVisible();
      expect(screen.getByText("TEST").parentElement?.tagName).toBe("DIV");
    });
  });

  describe("Slider.Root", () => {
    async function renderSliderRoot() {
      const { Slider } = await import("../slider");

      return render(
        <Slider.Root>
          <div>TEST</div>
        </Slider.Root>,
      );
    }
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
});
