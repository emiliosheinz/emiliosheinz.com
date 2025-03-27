"use client";

import Link from "next/link";
import { headerLinks } from "./header.constants";
import { CommandBarTriggerLite } from "../command-bar";
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { cn } from "~/lib/utils";
import { ThemeToggle } from "../theme-provider";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 z-40 backdrop-blur-md">
      <NavigationMenu className="flex justify-between w-full max-w-6xl m-auto py-2 px-2">
        <NavigationMenuList className="flex flex-1">
          {headerLinks.map(({ href, label }) => (
            <NavigationMenuItem key={label}>
              <Link
                href={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "px-6 py-6 no-underline bg-transparent",
                )}
              >
                {label}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <div className="flex justify-center gap-2">
          <CommandBarTriggerLite />
          <ThemeToggle />
        </div>
      </NavigationMenu>
    </header>
  );
}
