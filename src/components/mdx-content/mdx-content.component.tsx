"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { Pre } from "./components/pre.component";
import { Image } from "./components/image.component";
import { classNames } from "~/utils/css.utils";
import { MDXContentProps } from "./mdx-content.types";

export function MDXContent({ code, className = "" }: MDXContentProps) {
  const Content = useMDXComponent(code);

  return (
    <article
      className={classNames(
        className,
        "mdx-article flex flex-col gap-5 sm:gap-8",
      )}
    >
      <Content
        components={{
          pre: Pre,
          Image: Image,
        }}
      />
    </article>
  );
}
