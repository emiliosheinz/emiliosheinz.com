import { KBarResults, useMatches } from 'kbar'
import { classNames } from '~/utils/css.utils'

export function Results() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        const itemClassNames = classNames(
          'px-5 py-3 flex gap-5 items-center',
          active ? 'bg-codGray-300 bg-opacity-50' : 'bg-transparent'
        )

        if (typeof item === 'string') {
          return <div className={itemClassNames}>{item}</div>
        }

        return (
          <div className={itemClassNames}>
            {item.icon}
            <span
              className={classNames(
                'text-white',
                active ? 'opacity-100' : 'opacity-50'
              )}
            >
              {item.name}
            </span>
          </div>
        )
      }}
    />
  )
}
