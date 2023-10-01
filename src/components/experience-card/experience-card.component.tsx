import { format } from 'date-fns'

import { MDXContent } from '../mdx-content'
import { ExperienceCardProps } from './experience-card.types'

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
    ? format(new Date(endDate), 'MMM yyyy')
    : 'Present'
  const formattedStartDate = format(new Date(startDate), 'MMM yyyy')

  return (
    <div className='flex w-full px-4 sm:px-6 bg-codGray-300 rounded gap-10 border border-white border-opacity-10'>
      <div className='hidden sm:flex flex-col text-end items-end gap-2 py-6 justify-between border-r-[2px] border-r-white my-2 border-opacity-75'>
        <span className='whitespace-nowrap text-base bg-codGray-300 p-1 -mr-2 relative'>
          {formattedEndDate}
        </span>
        <span className='whitespace-nowrap text-base bg-codGray-300 p-1 -mr-2'>
          {formattedStartDate}
        </span>
      </div>
      <div className='flex flex-col py-4 sm:py-6'>
        <strong className='text-xl'>{title}</strong>
        <span className='text-base'>{`${company}, ${employmentType}`}</span>
        <span className='inline sm:hidden text-base'>{`${formattedStartDate} - ${formattedEndDate}`}</span>
        <br />
        <MDXContent code={description.code} className='text-lg' />
        <br />
        <span>Skills: {skills.join(', ')}</span>
      </div>
    </div>
  )
}
