import { format } from "date-fns";

import { MDXContent } from "../mdx-content";
import { Badge } from "../ui/badge";
import type { ExperienceCardProps } from "./experience-card.types";

export function ExperienceCard({
  title,
  company,
  employmentType,
  description,
  skills,
  startDate,
  endDate,
}: ExperienceCardProps) {
  const formattedEndDate = endDate
    ? format(new Date(endDate), "MMM yyyy")
    : "Present";
  const formattedStartDate = format(new Date(startDate), "MMM yyyy");

  return (
    <div className="flex w-full px-4 sm:px-6 rounded-sm gap-10 border border-ring/30 bg-background">
      <div className="hidden sm:flex flex-col text-end items-end gap-2 py-6 justify-between border-r-[2px] my-2 border-r-foreground/60">
        <span
          data-testid="formatted-end-date"
          className="whitespace-nowrap text-sm p-1 -mr-2 relative bg-background"
        >
          {formattedEndDate}
        </span>
        <span
          data-testid="formatted-start-date"
          className="whitespace-nowrap text-sm p-1 -mr-2 bg-background"
        >
          {formattedStartDate}
        </span>
      </div>
      <div className="flex flex-col py-4 sm:py-6">
        <strong className="text-lg sm:text-xl">{title}</strong>
        <span className="text-sm text-foreground/75">{`${company}, ${employmentType}`}</span>
        <span className="inline sm:hidden text-sm">{`${formattedStartDate} - ${formattedEndDate}`}</span>
        <br />
        <MDXContent
          code={description.code}
          className="text-sm sm:text-base leading-8"
        />
        <br />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
