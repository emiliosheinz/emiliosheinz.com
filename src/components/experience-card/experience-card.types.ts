import { MDX } from "contentlayer2/core";

export type ExperienceCardProps = {
  title: string;
  company: string;
  employmentType: string;
  description: MDX;
  startDate: string;
  endDate?: string;
  skills: string[];
};
