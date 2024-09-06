import { allExperiences } from "contentlayer/generated";

export const experiences = allExperiences.sort((a, b) =>
  b.startDate.localeCompare(a.startDate),
);

export const currentExperience = experiences[0];
