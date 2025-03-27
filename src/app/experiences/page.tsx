import { Metadata } from "next";
import { ExperienceCard } from "~/components/experience-card";

import { experiences } from "~/content/experiences";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencesPage() {
  return (
    <main className="flex flex-col gap-8 pt-14">
      <h1 className="font-bold text-4xl sm:text-5xl mb-2 sm:mb-8">
        Experience
      </h1>
      {experiences.map((experience) => (
        <ExperienceCard
          {...experience}
          key={experience.title}
          description={experience.body}
        />
      ))}
    </main>
  );
}
