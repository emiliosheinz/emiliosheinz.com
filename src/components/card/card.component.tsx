import { CardProps } from "./card.types";
import { Image } from "../image";
import { classNames } from "~/utils/css.utils";
import Link from "next/link";

export function Card({
  title,
  description,
  url,
  image,
  className,
}: CardProps) {
  return (
    <Link
      href={url}
      className={classNames(
        "flex flex-col bg-background rounded-lg w-72 sm:w-96 overflow-hidden border border-ring/30",
        className,
      )}
    >
      <div className="relative flex aspect-video w-full">
        <Image
          fill
          alt={title}
          src={image}
          style={{ objectFit: "cover" }}
          sizes={`
            (min-width: 1024px) 1024px,
            100vw
          `}
          className="pointer-events-none"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5 gap-5">
        <h5 className="font-bold text-xl line-clamp-3">{title}</h5>
        <p className="font-normal text-sm line-clamp-5 opacity-75">
          {description}
        </p>
      </div>
    </Link>
  );
}
