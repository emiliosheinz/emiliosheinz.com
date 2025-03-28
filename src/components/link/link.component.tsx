import { LinkProps } from "./link.types";
import NextLink from "next/link";
import { ArrowRight } from "lucide-react";

export function Link({ href, label, target }: LinkProps) {
  return (
    <NextLink
      href={href}
      target={target}
      className="group text-sm sm:text-base hover:cursor-pointer no-underline"
    >
      <span>{`${label}`}</span>
      <ArrowRight
        data-testid="arrow-right-icon"
        className="inline transition-transform ease-in-out group-hover:translate-x-2 ml-2"
      />
    </NextLink>
  );
}
