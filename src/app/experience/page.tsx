import { ExperienceCard } from '~/components/experience-card'
import { experiences } from '~/data/experiences'

export default function Experience() {
  return (
    <div className='flex flex-col gap-8 mt-20'>
      {experiences.map(experience => (
        <ExperienceCard key={experience.title} {...experience} />
      ))}
    </div>
  )
}
