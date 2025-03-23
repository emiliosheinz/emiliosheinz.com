import { ReactElement, cloneElement, useRef, type JSX } from "react";
import { FaCopy } from "react-icons/fa6";
import { notify } from "~/utils/toast.utils";

type PreProps = JSX.IntrinsicElements["pre"];

export function Pre({ children, ...props }: PreProps) {
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
        <button
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
          className="absolute top-0 right-0 p-3 opacity-50 hover:opacity-100 transition-opacity"
        >
          <FaCopy />
        </button>
      </pre>
    </div>
  );
}
