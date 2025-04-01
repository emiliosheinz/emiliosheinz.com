"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { Pre } from "./components/pre.component";
import { Image } from "./components/image.component";
import { MDXContentProps } from "./mdx-content.types";
import { cn } from "~/lib/utils";

export function MDXContent({ code, className = "" }: MDXContentProps) {
  const Content = useMDXComponent(code);

  return (
    <article
      className={cn(
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
