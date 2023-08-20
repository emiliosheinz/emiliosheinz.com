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
  return (
    <div className='flex w-full px-6 bg-codGray-400 rounded gap-10'>
      <div className='flex flex-col text-end items-end gap-2 py-6 justify-between border-r-[2px] border-r-white my-2 border-opacity-75'>
        <span className='whitespace-nowrap text-base bg-codGray-400 p-1 -mr-2 relative'>
          {endDate}
        </span>
        <span className='whitespace-nowrap text-base bg-codGray-400 p-1 -mr-2'>
          {startDate}
        </span>
      </div>
      <div className='flex flex-col py-6'>
        <strong className='text-xl'>{title}</strong>
        <span className='text-base'>{`${company}, ${employmentType}`}</span>
        <br />
        <p className='text-lg'>{description}</p>
        <br />
        <div className='flex divide-x-2 divide-solid'>
          Skills:
          {skills.map(skill => (
            <span key={skill} className='text-base px-5'>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
