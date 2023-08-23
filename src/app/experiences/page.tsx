import { ExperienceCard } from '~/components/experience-card'
import { experiences } from '~/content/experiences'

export default function ExperiencesPage() {
  return (
    <div className='flex flex-col gap-8 mt-20'>
      <h1 className='font-bold text-5xl mb-5'>Experience</h1>
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
