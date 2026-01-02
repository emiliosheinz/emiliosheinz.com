"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { cn } from "~/lib/utils";
import { Image } from "./components/image.component";
import { Pre } from "./components/pre.component";
import type { MDXContentProps } from "./mdx-content.types";

export function MDXContent({ code, className = "" }: MDXContentProps) {
  const Content = useMDXComponent(code);

  return (
    <article
      className={cn(className, "mdx-article flex flex-col gap-5 sm:gap-8")}
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
