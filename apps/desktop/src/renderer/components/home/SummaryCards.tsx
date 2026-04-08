const cards = [
  {
    title: 'Find a moment',
    description: 'Locate the doc, tab, or terminal session you were looking at earlier.',
    prompt: 'What was I reading about CEF packaging yesterday afternoon?'
  },
  {
    title: 'Summarize work',
    description: 'Roll up OCR and visual context from a bounded time window.',
    prompt: 'Summarize what I worked on between 1pm and 3pm.'
  },
  {
    title: 'Reconnect context',
    description: 'Return to a task by app name, UI shape, or partial wording.',
    prompt: 'Show me the window where I edited the search API route.'
  }
]

export function SummaryCards(): React.JSX.Element {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <button
          key={card.title}
          type="button"
          className="rounded-3xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{card.title}</p>
          <p className="mt-3 text-base font-semibold text-neutral-950">{card.description}</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">{card.prompt}</p>
        </button>
      ))}
    </div>
  )
}
