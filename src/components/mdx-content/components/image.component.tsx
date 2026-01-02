import NextImage, { type ImageProps } from "next/image";
import { type CSSProperties, memo } from "react";

const removeUndefinedKeys = (object: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));

function BaseImage(props: ImageProps) {
  const { width, height, style, ...otherProps } = props;

  const customImageStyle: CSSProperties = {
    ...removeUndefinedKeys({ width, height }),
    objectFit: "contain",
    ...style,
  };

  return (
    <div className="relative w-full aspect-video">
      <NextImage
        fill
        width={width}
        height={height}
        style={customImageStyle}
        sizes={`
          (min-width: 1024px) 1024px,
          100vw
        `}
        {...otherProps}
      />
    </div>
  );
}

export const Image = memo(BaseImage);
