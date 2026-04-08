const ticks = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00']

export function TimelineScrubber(): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Scrubber</p>
          <p className="mt-2 text-sm text-neutral-600">Jump to a moment in the day and inspect nearby frames.</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Auto-play
        </button>
      </div>
      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-neutral-200">
          <div className="absolute left-[58%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-neutral-950 shadow" />
          <div className="h-2 w-[58%] rounded-full bg-neutral-950" />
        </div>
        <div className="mt-4 grid grid-cols-7 text-xs text-neutral-500">
          {ticks.map((tick) => (
            <span key={tick} className="text-center">
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
