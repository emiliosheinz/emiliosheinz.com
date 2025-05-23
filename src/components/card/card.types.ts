import { HTMLAttributeAnchorTarget } from "react";

export type CardProps = {
  title: string;
  description: string;
  url: string;
  image: string;
  className?: string;
  priority?: boolean;
  target?: HTMLAttributeAnchorTarget;
};
