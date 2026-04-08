type CaptureControlProps = {
  isRunning: boolean
  onToggle: () => void
  lastUpdatedLabel?: string
}

export function CaptureControl({
  isRunning,
  onToggle,
  lastUpdatedLabel = 'Just now'
}: CaptureControlProps): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Capture</p>
          <h3 className="mt-2 text-lg font-semibold text-neutral-950">Screen recording control</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Start or pause local screen capture without leaving the assistant surface.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isRunning
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          {isRunning ? 'Capturing' : 'Paused'}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${isRunning ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]' : 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]'}`}
          />
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {isRunning ? 'Capture is actively indexing your screen' : 'Capture is currently paused'}
            </p>
            <p className="text-xs text-neutral-500">Last status update: {lastUpdatedLabel}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            isRunning
              ? 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100'
              : 'bg-neutral-950 text-white hover:bg-neutral-800'
          }`}
        >
          {isRunning ? 'Pause capture' : 'Start capture'}
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Configure sources
        </button>
      </div>
    </div>
  )
}
