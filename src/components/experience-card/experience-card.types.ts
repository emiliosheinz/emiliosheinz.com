import { MDX } from 'contentlayer/core'

export type ExperienceCardProps = {
  title: string
  company: string
  employmentType: string
  description: MDX
  startDate: string
  endDate?: string
  skills: string[]
}
