import { useEffect, useMemo, useState } from 'react'
import { portfolioApi } from '../api/portfolioApi'

const LEVEL_COLORS = [
  'rgba(255, 255, 255, 0.055)',
  'rgba(122, 51, 255, 0.30)',
  'rgba(122, 51, 255, 0.50)',
  'rgba(122, 51, 255, 0.72)',
  '#9b6dff',
]

const WEEKDAY_LABELS = [
  { day: 1, label: 'Mon' },
  { day: 3, label: 'Wed' },
  { day: 5, label: 'Fri' },
]

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function errorMessage(error) {
  if (error?.status === 429) return 'GitHub activity is temporarily rate limited. Please try again later.'
  if (error?.status === 404) return 'The GitHub profile could not be found.'
  if (error?.status === 503) return 'GitHub activity is temporarily unavailable.'
  return 'Unable to load GitHub activity.'
}

export default function GitHubContributions() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    portfolioApi.githubContributions()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((requestError) => {
        if (active) setError(requestError)
      })

    return () => { active = false }
  }, [])

  const monthLabels = useMemo(() => {
    if (!data) return []
    const displayedMonths = new Set()

    return data.weeks.flatMap((week, weekIndex) => {
      const monthStart = week.days.find((day) => {
        const date = new Date(`${day.date}T00:00:00Z`)
        return date.getUTCDate() <= 7 && !displayedMonths.has(date.getUTCMonth())
      })
      if (!monthStart) return []

      const date = new Date(`${monthStart.date}T00:00:00Z`)
      displayedMonths.add(date.getUTCMonth())
      return [{ index: weekIndex, label: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) }]
    })
  }, [data])

  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <div>
          <p className="section-eyebrow mb-1">GitHub</p>
          <h3 className="text-white font-bold text-lg">GitHub Contributions</h3>
        </div>
        <a
          className="text-xs font-mono transition-colors hover:text-white"
          style={{ color: '#9b6dff' }}
          href="https://github.com/DrakeDev23"
          target="_blank"
          rel="noreferrer"
        >
          @DrakeDev23
        </a>
      </div>

      {!data && !error && <p className="text-sm text-gray-400">Loading contribution activity...</p>}
      {error && <p className="text-sm text-gray-400" role="status">{errorMessage(error)}</p>}

      {data && (
        <>
          {data.total === 0 ? (
            <p className="text-sm text-gray-400">No public contribution activity was recorded in the last year.</p>
          ) : (
            <div className="overflow-x-auto pb-2 -mx-1 px-1" aria-label="GitHub contribution calendar">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[28px_1fr] gap-x-2">
                  <div />
                  <div className="grid h-5 gap-[3px]" style={{ gridTemplateColumns: `repeat(${data.weeks.length}, minmax(10px, 1fr))` }}>
                    {monthLabels.map(({ index, label }) => (
                      <span key={`${label}-${index}`} className="text-[10px] text-gray-500 font-mono" style={{ gridColumnStart: index + 1 }}>{label}</span>
                    ))}
                  </div>
                  <div className="grid grid-rows-7 gap-[3px] text-[10px] text-gray-500 font-mono leading-[11px]">
                    {Array.from({ length: 7 }, (_, day) => (
                      <span key={day}>{WEEKDAY_LABELS.find((item) => item.day === day)?.label}</span>
                    ))}
                  </div>
                  <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${data.weeks.length}, minmax(10px, 1fr))` }}>
                    {data.weeks.flatMap((week) => week.days).map((day) => (
                      <span
                        key={day.date}
                        className="aspect-square min-w-[10px] rounded-[2px] transition-transform hover:scale-125"
                        style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                        title={`${formatDate(day.date)}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                        aria-label={`${formatDate(day.date)}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
            <p className="text-sm text-gray-300">
              <span className="text-white font-semibold">{data.total.toLocaleString()}</span> contributions in the last year
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono" aria-label="Contribution intensity legend">
              <span>Less</span>
              {LEVEL_COLORS.map((color, level) => <span key={level} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: color }} />)}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
