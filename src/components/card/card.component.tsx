// TODO - emiliosheinz: DRY these components
import { CardProps } from "./card.types";
import { Image } from "../image";
import { Link } from "../link";
import { classNames } from "~/utils/css.utils";

export function YouTubeVideoCard({
  title,
  description,
  url,
  image,
  className,
}: CardProps) {
  return (
    <div
      className={classNames(
        "flex flex-col bg-cod-gray-300 rounded-lg w-72 sm:w-96 overflow-hidden border border-white/10",
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
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
        <div>
          <h5 className="font-bold text-xl mb-2 line-clamp-3">{title}</h5>
          <p className="font-normal text-sm mb-3 line-clamp-5 opacity-75">
            {description}
          </p>
        </div>
        <div className="flex justify-end">
          <Link label="watch it" href={url} target="_blank" />
        </div>
      </div>
    </div>
  );
}

export function PostCard({
  title,
  description,
  url,
  image,
  className,
}: CardProps) {
  return (
    <div
      className={classNames(
        "flex flex-col bg-cod-gray-300 rounded-lg w-72 sm:w-96 overflow-hidden border border-white/10",
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
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
        <div>
          <h5 className="font-bold text-xl mb-2 line-clamp-3">{title}</h5>
          <p className="font-normal text-sm mb-3 line-clamp-5 opacity-75">
            {description}
          </p>
        </div>
        <div className="flex justify-end">
          <Link label="read more" href={url} />
        </div>
      </div>
    </div>
  );
}
