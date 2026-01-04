"use client"

import { useKBar } from "kbar";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../../components/ui/button";

type CommandBarTriggerFullProps = {
  className?: string;
};

export function CommandBarTriggerFull({ className }: CommandBarTriggerFullProps) {
  const { query } = useKBar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderLabel = () => {
    const isMac = /(Mac)/i.test(navigator.userAgent);
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

    if (isMobile) {
      return <span>Tap to start</span>;
    }

    if (isMac) {
      return (
        <span>
          Press <kbd>⌘</kbd> <kbd>K</kbd> to start
        </span>
      );
    }

    return (
      <span>
        Press <kbd>ctrl</kbd> <kbd>K</kbd> to start
      </span>
    );
  };

  if (!isMounted) {
    return <div className="h-10 w-64 bg-accent animate-pulse rounded-md" />;
  }

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={query.toggle}
      className={cn(
        "cursor-pointer group text-base has-[>svg]:px-4",
        className,
      )}
    >
      {renderLabel()}
      <ArrowRight
        data-testid="arrow-right-icon"
        className="inline transition-[margin,scale] ease-in-out group-hover:ml-2 group-hover:scale-110"
      />
    </Button>
  );
}
