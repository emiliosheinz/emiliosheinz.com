import fs from "node:fs/promises";
import NextImage, { type ImageProps } from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { memo } from "react";

const MINIMUM_IMAGE_SIZE_WITH_BLUR = 40;

const removeUndefinedKeys = (object: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));

const getImageBuffer = async (src: string) => {
  const isExternal = src.startsWith("http");

  if (isExternal) {
    const response = await fetch(src);
    return Buffer.from(await response.arrayBuffer());
  }

  return fs.readFile(`./public${src}`);
};

async function BaseImage(props: ImageProps) {
  const { width, height, style, ...otherProps } = props;

  const customImageStyle = {
    ...removeUndefinedKeys({ width, height }),
    ...style,
  };

  const getBlurProps = async (): Promise<
    Pick<ImageProps, "placeholder" | "blurDataURL">
  > => {
    if (width && Number(width) < MINIMUM_IMAGE_SIZE_WITH_BLUR) return {};

    if (height && Number(height) < MINIMUM_IMAGE_SIZE_WITH_BLUR) return {};

    if (typeof props.src !== "string") return { placeholder: "blur" };

    try {
      const buffer = await getImageBuffer(props.src);
      const { base64 } = await getPlaiceholder(buffer, { saturation: 1 });
      return { placeholder: "blur", blurDataURL: base64 };
    } catch (error) {
      console.error("Error generating blur data URL:", error);
      return {};
    }
  };

  return (
    <NextImage
      width={width}
      height={height}
      style={customImageStyle}
      {...(await getBlurProps())}
      {...otherProps}
    />
  );
}

export const Image = memo(BaseImage);
