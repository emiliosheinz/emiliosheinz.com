"use client";

import { motion } from "framer-motion";
import { ItemProps } from "./slider.types";

export function Item({ children }: ItemProps) {
  return <motion.div className="flex">{children}</motion.div>;
}
