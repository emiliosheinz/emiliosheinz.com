import { useMDXComponent } from "next-contentlayer2/hooks";

import { cn } from "~/lib/utils";
import { MDXContentImage } from "./mdx-content-image";
import { MDXContentPre } from "./mdx-content-pre";

type MDXContentProps = {
  code: string;
  className?: string;
};

export function MDXContent({ code, className = "" }: MDXContentProps) {
  const Content = useMDXComponent(code);

  return (
    <article
      className={cn(className, "mdx-article flex flex-col gap-5 sm:gap-8")}
    >
      <Content
        components={{
          pre: MDXContentPre,
          Image: MDXContentImage,
        }}
      />
    </article>
  );
}
