import Link from "next/link";
import { cn } from "~/lib/utils";
import { Image } from "../image";
import type { CardProps } from "./card.types";

export function Card({
  title,
  description,
  url,
  image,
  className,
  priority,
  target,
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-background rounded-lg w-72 sm:w-96 overflow-hidden border border-ring/35",
        className,
      )}
    >
      <div className="relative flex aspect-video w-full">
        <Image
          fill
          alt={title}
          src={image}
          priority={priority}
          style={{ objectFit: "cover" }}
          sizes={`
            (min-width: 1024px) 1024px,
            100vw
          `}
          className="pointer-events-none"
        />
      </div>
      <Link
        href={url}
        target={target}
        className="group relative flex flex-1 flex-col justify-between p-3 sm:p-5 gap-5 transition-colors bg-background hover:bg-accent/60"
      >
        <h5 className="font-bold text-xl line-clamp-3">{title}</h5>
        <p className="font-normal text-sm line-clamp-5 text-foreground/75">
          {description}
        </p>
      </Link>
    </div>
  );
}
