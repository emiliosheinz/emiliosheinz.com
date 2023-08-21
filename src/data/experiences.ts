import { Skill } from './skills'

export type Experience = {
  title: string
  company: string
  employmentType: string
  description: string
  startDate: string
  endDate: string
  skills: Skill[]
}

export const experiences: Array<Experience> = [
  {
    title: 'Senior Frontend Software Engineer',
    company: 'Cloudbeds',
    employmentType: 'Full-time',
    description: `As a Senior Frontend Engineer at Cloudbeds, I'm responsible for the creation of new Frontend integrations with several lodging business channels such as Tripadvisor, Hopper and HRS. I also enhance existing connections with platforms like Vrbo and Airbnb. Additionally, I play an important role within the Company's Frontend Brain Trust Group, driving the implementation of cutting-edge technologies and industry best practices throughout our Frontend teams.`,
    startDate: 'Jan 2023',
    endDate: 'Present',
    skills: [
      Skill.ReactJS,
      Skill.VueJS,
      Skill.TanStackQuery,
      Skill.ChakraUI,
      Skill.MicrofrontendsArchitecture,
    ],
  },
  {
    title: 'Software Engineer Lead',
    company: 'CWI Software',
    employmentType: 'Full-time',
    description: `As a Software Engineering Leader, in addition to actively working in software development, I am a technical reference, leading and supporting software development teams in delivering high-impact products to the customer, focusing mainly on the application's Frontend layer. Thus, spreading the company's culture, creating a collaborative environment, conducive to learning and the emergence of new technical references.`,
    startDate: 'Sep 2022',
    endDate: 'Dec 2022',
    skills: [
      Skill.TeamLeadership,
      Skill.TechnicalLeadership,
      Skill.NextJS,
      Skill.ReactJS,
      Skill.TypeScript,
    ],
  },
  {
    title: 'Software Developer',
    company: 'CWI Software',
    employmentType: 'Full-time',
    description: `In addition to developing new features and fixing bugs in already established Front-end applications, I took part in the entire process of conception, development, and delivery of many applications, developed with ReactJS and ReactNative, that are daily accessed by thousands of users. Furthermore, I participated in the evolution and improvement of important processes for the development of the projects: Implementation of CI/CD, implementation of unit tests, and the rewrite of front-ends with more recent technologies.

    Other experiences during this period:
    
    - Crescer Assistant Instructor
    Going back to the program that was responsible for starting my journey as a software developer was extremely gratifying. During this period I was responsible for helping the students, correcting their project's code, and giving them feedback about their evolution.
    
    - React Native Bootcamp Instructor
    I had the opportunity to work as an instructor for the Bootcamp given to dozens of employees within the company. I was able to help them reach a better understanding of the React Native and mobile app development ecosystem. In addition, I was responsible, along with my teammates, for organizing and delivering all the training material.`,
    startDate: 'Sep 2019',
    endDate: 'Sep 2022',
    skills: [Skill.ReactJS, Skill.JavaScript],
  },
]
