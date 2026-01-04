import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { CommandBarTriggerLite } from "../features/command-bar";
import { ThemeToggle } from "../features/theme";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuList } from "./ui/navigation-menu";

const HEADER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experiences" },
  { label: "Blog", href: "/posts" },
  { label: "Videos", href: "/videos" },
  { label: "Links", href: "/links" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background overflow-x-scroll">
      <NavigationMenu className="flex justify-between w-full max-w-6xl m-auto py-2 px-2 gap-2">
        <NavigationMenuList className="flex flex-1 gap-2">
          {HEADER_LINKS.map(({ href, label }) => (
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
