import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { ExperienceCard } from "../experience-card.component";
import type { ExperienceCardProps } from "../experience-card.types";

jest.mock("~/components/mdx-content", () => ({
  MDXContent: ({ code }: { code: string }) => <div>MDXContent: {code}</div>,
}));

const makeExperienceCardProps = (): ExperienceCardProps => ({
  title: faker.person.jobTitle(),
  company: faker.company.name(),
  employmentType: faker.person.jobType(),
  description: {
    raw: faker.person.jobDescriptor(),
    code: faker.person.jobDescriptor(),
  },
  skills: [faker.lorem.word(), faker.lorem.word()],
  startDate: faker.date.past().toISOString(),
  endDate: faker.date.past().toISOString(),
});

describe("ExperienceCard", () => {
  it("should render formatted start date", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    const formattedStartDateEl = screen.getByTestId("formatted-start-date");

    expect(formattedStartDateEl).toBeVisible();
  });

  it("should render formatted end date", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    const formattedEndDateEl = screen.getByTestId("formatted-end-date");

    expect(formattedEndDateEl).toBeVisible();
  });

  it("should render formatted end date as Present if no end date is provided", () => {
    const props = makeExperienceCardProps();
    delete props.endDate;
    render(<ExperienceCard {...props} />);

    const formattedEndDateEl = screen.getByTestId("formatted-end-date");

    expect(formattedEndDateEl).toHaveTextContent("Present");
  });

  it("should render title", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    const titleEl = screen.getByText(props.title);

    expect(titleEl).toBeVisible();
  });

  it("should render company and employment type", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    const companyAndEmploymentTypeEl = screen.getByText(
      `${props.company}, ${props.employmentType}`,
    );

    expect(companyAndEmploymentTypeEl).toBeVisible();
  });

  it("should render description", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    const descriptionEl = screen.getByText(
      `MDXContent: ${props.description.code}`,
    );

    expect(descriptionEl).toBeVisible();
  });

  it("should render skills", () => {
    const props = makeExperienceCardProps();
    render(<ExperienceCard {...props} />);

    props.skills.forEach((skill) => {
      const skillEl = screen.getByText(skill);
      expect(skillEl).toBeVisible();
    });
  });
});
