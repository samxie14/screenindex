import { ChatComposer } from './ChatComposer'

type HomeChatViewProps = {
  draft: string
  onDraftChange: (value: string) => void
  onBack: () => void
}

const mockMessages = [
  {
    role: 'assistant',
    content:
      'I can help you search across OCR text, visual embeddings, and recent frames. Ask about a moment, app, or time range to get started.'
  },
  {
    role: 'user',
    content: 'Show me the Chrome tab where I was debugging the search route this afternoon.'
  },
  {
    role: 'assistant',
    content:
      'I would search the afternoon window, rank Chrome frames by OCR matches for "search route", then surface nearby timeline context and screenshots.'
  }
]

export function HomeChatView({
  draft,
  onDraftChange,
  onBack
}: HomeChatViewProps): React.JSX.Element {
  return (
    <section className="flex min-h-screen flex-col bg-[#fafafa]">
      <div className="border-b border-neutral-200 px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-500">Assistant chat</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Chat with your desktop history</h1>
          </div>
          <button
            type="button"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            onClick={onBack}
          >
            Back to home
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-8 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Conversation</p>
              <div className="mt-5 space-y-4">
                {mockMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === 'assistant'
                        ? 'max-w-3xl rounded-3xl rounded-tl-md bg-neutral-100 px-5 py-4 text-sm leading-6 text-neutral-700'
                        : 'ml-auto max-w-2xl rounded-3xl rounded-tr-md bg-neutral-950 px-5 py-4 text-sm leading-6 text-white'
                    }
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Context</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-neutral-600">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="font-medium text-neutral-900">Active retrieval</p>
                  <p className="mt-1">Hybrid search with OCR + visual embedding ranking.</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="font-medium text-neutral-900">Suggested bounds</p>
                  <p className="mt-1">Today, 1:00 PM to 5:00 PM</p>
                </div>
                <div className="rounded-2xl bg-neutral-950 p-4 text-neutral-100">
                  <p className="font-medium">Next step</p>
                  <p className="mt-1 text-neutral-300">Wire this composer to the local `/search` API and show citations below each response.</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            <ChatComposer value={draft} onChange={onDraftChange} onSend={() => undefined} />
          </div>
        </div>
      </div>
    </section>
  )
}
