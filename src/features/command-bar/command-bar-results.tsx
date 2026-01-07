import { KBarResults, useMatches } from "kbar";
import { cn } from "~/lib/utils";

export function CommandBarResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        const itemClassNames = cn(
          "px-5 py-3 flex gap-5 items-center rounded-sm",
          active ? "bg-accent/30" : "bg-transparent",
        );

        if (typeof item === "string") {
          return <div className={itemClassNames}>{item}</div>;
        }

        return (
          <div className={itemClassNames}>
            {item.icon}
            <span
              className={
                active ? "text-accent-foreground" : "text-accent-foreground/35"
              }
            >
              {item.name}
            </span>
          </div>
        );
      }}
    />
  );
}
