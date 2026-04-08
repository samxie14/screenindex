type ChatComposerProps = {
  value?: string
  placeholder?: string
  submitLabel?: string
  onChange?: (value: string) => void
  onSend?: () => void
}

export function ChatComposer({
  value = '',
  placeholder = 'Ask about a moment, workflow, or app you saw on screen...',
  submitLabel = 'Send',
  onChange,
  onSend
}: ChatComposerProps): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex flex-col gap-3">
        <textarea
          className="min-h-28 w-full resize-none rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Hybrid search</span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Time-bounded</span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Local-first</span>
          </div>
          <button
            type="button"
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={onSend}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
