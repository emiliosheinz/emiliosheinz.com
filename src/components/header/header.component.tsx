"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { usePreviousRoute } from "~/hooks/usePreviousRoute";
import { headerLinks } from "./header.constants";
import { CommandBarTriggerLite } from "../command-bar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { cn } from "~/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const previousRoute = usePreviousRoute();

  const isHome = pathname === "/";

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    const approximateHeaderHeight = 150;
    const targetElementTop = targetElement.getBoundingClientRect().top;

    window.scrollTo({
      top: targetElementTop + window.scrollY - approximateHeaderHeight,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 z-40 backdrop-blur-md">
      <NavigationMenu className="flex items-center w-full max-w-6xl m-auto py-2 px-2">
        <NavigationMenuList className="flex flex-1">
          {headerLinks.map(({ href, label }) => (
            <NavigationMenuItem key={label}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-6 py-6",
                    "no-underline bg-transparent",
                  )}
                  onClick={handleScroll}
                >
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
