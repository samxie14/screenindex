export function TimelineToolbar(): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
        <input
          className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-300"
          placeholder="Search OCR text, app name, or visual memory..."
        />
        <select className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none focus:border-neutral-300">
          <option>All apps</option>
          <option>Chrome</option>
          <option>Terminal</option>
          <option>VS Code</option>
        </select>
        <select className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none focus:border-neutral-300">
          <option>Today</option>
          <option>Last 6 hours</option>
          <option>Last 24 hours</option>
          <option>Custom range</option>
        </select>
        <button
          type="button"
          className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Apply filters
        </button>
      </div>
    </div>
  )
}
