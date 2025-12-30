import { useEffect, useState } from "react";

export function useIsSpacePressed() {
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed) {
        setIsSpacePressed(true);
      }
    };

    const handleKyeUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isSpacePressed) {
        setIsSpacePressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKyeUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKyeUp);
    };
  }, [isSpacePressed]);

  return isSpacePressed;
}
