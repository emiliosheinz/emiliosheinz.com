import { ExperienceCard } from '~/components/experience-card'
import { experiences } from '~/content/experiences'
import { ONE_HOUR_IN_SECONDS } from '~/utils/revalidate.utils'

export const revalidate = ONE_HOUR_IN_SECONDS

export default function ExperiencesPage() {
  return (
    <div className='flex flex-col gap-8'>
      <h1 className='font-bold text-4xl sm:text-5xl mb-2 sm:mb-5'>
        Experience
      </h1>
      {experiences.map(experience => (
        <ExperienceCard
          key={experience.title}
          {...experience}
          description={experience.body}
        />
      ))}
    </div>
  )
}
