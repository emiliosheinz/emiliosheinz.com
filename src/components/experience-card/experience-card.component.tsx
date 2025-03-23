import { format } from "date-fns";

import { MDXContent } from "../mdx-content";
import { ExperienceCardProps } from "./experience-card.types";

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
    <div className="flex w-full px-4 sm:px-6 bg-cod-gray-300 rounded-sm gap-10 border border-white/10">
      <div className="hidden sm:flex flex-col text-end items-end gap-2 py-6 justify-between border-r-[2px] my-2 border-r-white/75">
        <span
          data-testid="formatted-end-date"
          className="whitespace-nowrap text-base bg-cod-gray-300 p-1 -mr-2 relative"
        >
          {formattedEndDate}
        </span>
        <span
          data-testid="formatted-start-date"
          className="whitespace-nowrap text-base bg-cod-gray-300 p-1 -mr-2"
        >
          {formattedStartDate}
        </span>
      </div>
      <div className="flex flex-col py-4 sm:py-6">
        <strong className="text-xl">{title}</strong>
        <span className="text-base">{`${company}, ${employmentType}`}</span>
        <span className="inline sm:hidden text-base">{`${formattedStartDate} - ${formattedEndDate}`}</span>
        <br />
        <MDXContent code={description.code} className="text-lg" />
        <br />
        <span>Skills: {skills.join(", ")}</span>
      </div>
    </div>
  );
}
