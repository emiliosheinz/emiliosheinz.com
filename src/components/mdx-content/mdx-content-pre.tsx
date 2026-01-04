"use client"

import { CopyIcon } from "lucide-react";
import { cloneElement, type JSX, type ReactElement, useRef } from "react";
import { notify } from "~/utils/toast";
import { Button } from "../ui/button";

type MDXContentPreProps = JSX.IntrinsicElements["pre"];

export function MDXContentPre({ children, ...props }: MDXContentPreProps) {
  const codeRef = useRef<HTMLElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(codeRef.current?.textContent));
      notify.success("Copied to clipboard");
    } catch {
      notify.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="relative">
      <pre {...props}>
        {cloneElement(children as ReactElement<{ ref: unknown }>, {
          ref: codeRef,
        })}
        <Button
          variant="ghost"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
          className="absolute top-2 right-2 transition-colors text-foreground/65"
        >
          <CopyIcon />
        </Button>
      </pre>
    </div>
  );
}
