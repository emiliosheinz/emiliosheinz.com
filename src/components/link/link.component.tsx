import { FaArrowRightLong } from "react-icons/fa6";
import { LinkProps } from "./link.types";
import NextLink from "next/link";

export function Link({ href, label }: LinkProps) {
  return (
    <NextLink
      className="group text-base sm:text-lg hover:cursor-pointer no-underline"
      href={href}
    >
      <span className="transition-all ease-in-out group-hover:text-dodgerBlue">{`${label}`}</span>
      <FaArrowRightLong
        data-testid="arrow-right-icon"
        className="inline transition-all ease-in-out group-hover:translate-x-1 group-hover:text-dodgerBlue ml-3"
      />
    </NextLink>
  );
}
