"use client"

import { useKBar } from "kbar";
import { Command } from "lucide-react";
import { Button } from "../../components/ui/button";

export function CommandBarTriggerLite() {
  const { query } = useKBar();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={query.toggle}
      title="Open command bar"
      className="cursor-pointer"
    >
      <Command />
    </Button>
  );
}
