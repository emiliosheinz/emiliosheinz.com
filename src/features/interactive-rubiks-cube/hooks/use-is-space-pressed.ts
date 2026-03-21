/**
 * Hook for tracking space key press state.
 *
 * @module hooks/useIsSpacePressed
 */

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the space key is currently pressed.
 */
export function useIsSpacePressed(): boolean {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const isSpacePressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !isSpacePressedRef.current) {
        isSpacePressedRef.current = true;
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = false;
        setIsSpacePressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return isSpacePressed;
}
