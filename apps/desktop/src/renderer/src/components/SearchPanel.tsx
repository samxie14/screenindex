import { useState } from 'react'

/** Time-bounded search shell (matches engine API intent; wire to `fetch` when the server exists). */
export function SearchPanel(): React.JSX.Element {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [query, setQuery] = useState('')

  return (
    <section className="flex flex-col gap-4" aria-label="Search">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-600">
          start_time
          <input
            className="border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="ISO or engine format"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-600">
          end_time
          <input
            className="border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="ISO or engine format"
            autoComplete="off"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-600">
        query
        <input
          className="border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keyword or hybrid query"
          autoComplete="off"
        />
      </label>
      <button
        type="button"
        className="self-start border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
      >
        Search
      </button>
    </section>
  )
}
