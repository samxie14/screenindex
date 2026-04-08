type HomeHeaderProps = {
  onNewChat?: () => void
}

export function HomeHeader({ onNewChat }: HomeHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-500">Assistant</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">An AI for your desktop</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Ask what happened on screen, jump across apps and time, and move between search and timeline
          views without leaving the desktop shell.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          History
        </button>
        <button
          type="button"
          className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          onClick={onNewChat}
        >
          New chat
        </button>
      </div>
    </div>
  )
}
