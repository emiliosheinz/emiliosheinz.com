"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Image } from "../image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { usePreviousRoute } from "~/hooks/usePreviousRoute";
import { headerLinks } from "./header.constants";
import { CommandBarTriggerLite } from "../command-bar";

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

  const renderLinks = () => {
    if (!isHome) {
      return (
        <button
          className="group text-base sm:text-lg hover:cursor-pointer"
          onClick={() => {
            if (previousRoute) router.back();
            else router.replace("/");
          }}
        >
          <FaArrowLeftLong className="inline transition-all ease-in-out group-hover:-translate-x-1 group-hover:text-dodger-blue mr-3" />
          <span className="transition-all ease-in-out group-hover:text-dodger-blue">
            go back
          </span>
        </button>
      );
    }

    return headerLinks.map(({ href, label }) => (
      <Link
        key={label}
        href={href}
        onClick={handleScroll}
        className="font-bold text-xl px-2 transition-colors hover:text-dodger-blue no-underline"
      >
        {label}
      </Link>
    ));
  };

  return (
    <header className="fixed bg-cod-gray-500 top-0 left-0 right-0 z-40 bg-opacity-90 backdrop-blur-md">
      <div className="flex items-center w-full max-w-6xl m-auto py-2 sm:py-5 px-5 overflow-y-scroll">
        <div className="flex flex-1 space-x-5">{renderLinks()}</div>
        <div className="ml-5">
          <CommandBarTriggerLite />
        </div>
      </div>
    </header>
  );
}
