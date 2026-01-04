/**
 * Hook for tracking space key press state.
 *
 * @module hooks/useIsSpacePressed
 */

import { useEffect, useState } from "react";

/**
 * Tracks whether the space key is currently pressed.
 */
export function useIsSpacePressed(): boolean {
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isSpacePressed) {
        setIsSpacePressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed]);

  return isSpacePressed;
}
