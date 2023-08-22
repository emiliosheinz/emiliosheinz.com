import { useMDXComponent } from 'next-contentlayer/hooks'
import { ExperienceCardProps } from './experience-card.types'
import { format } from 'date-fns'

export function ExperienceCard({
  title,
  company,
  employmentType,
  description,
  skills,
  startDate,
  endDate,
}: ExperienceCardProps) {
  const MDXContent = useMDXComponent(description.code)

  return (
    <div className='flex w-full px-6 bg-codGray-400 rounded gap-10'>
      <div className='flex flex-col text-end items-end gap-2 py-6 justify-between border-r-[2px] border-r-white my-2 border-opacity-75'>
        <span className='whitespace-nowrap text-base bg-codGray-400 p-1 -mr-2 relative'>
          {endDate ? format(new Date(endDate), 'MMM yyyy') : 'Present'}
        </span>
        <span className='whitespace-nowrap text-base bg-codGray-400 p-1 -mr-2'>
          {format(new Date(startDate), 'MMM yyyy')}
        </span>
      </div>
      <div className='flex flex-col py-6'>
        <strong className='text-xl'>{title}</strong>
        <span className='text-base'>{`${company}, ${employmentType}`}</span>
        <br />
        <MDXContent className='text-lg' />
        <br />
        <span>Skills: {skills.join(', ')}</span>
      </div>
    </div>
  )
}
