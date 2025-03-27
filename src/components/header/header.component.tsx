"use client";

import Link from "next/link";
import { headerLinks } from "./header.constants";
import { CommandBarTriggerLite } from "../command-bar";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { ThemeToggle } from "../theme-provider";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 z-40 backdrop-blur-md">
      <NavigationMenu className="flex justify-between w-full max-w-6xl m-auto py-2 px-2">
        <NavigationMenuList className="flex flex-1 gap-2">
          {headerLinks.map(({ href, label }) => (
            <NavigationMenuItem key={label}>
              <Button variant="ghost" asChild>
                <Link href={href}>{label}</Link>
              </Button>
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
