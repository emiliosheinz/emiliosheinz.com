import type { SectionProps } from "./section.typs";

export function Section({ id, title, children }: SectionProps) {
  return (
    <div className="flex flex-col space-y-6 sm:space-y-8" id={id}>
      <h1 className="font-bold text-2xl sm:text-3xl">{title}</h1>
      {children}
    </div>
  );
}
