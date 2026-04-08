import { useState } from 'react'
import { CaptureControl } from './CaptureControl'
import { ChatComposer } from './ChatComposer'
import { HomeChatView } from './HomeChatView'
import { HomeHeader } from './HomeHeader'
import { SummaryCards } from './SummaryCards'

export function HomeView(): React.JSX.Element {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [isCaptureRunning, setIsCaptureRunning] = useState(true)
  const [captureStatusLabel, setCaptureStatusLabel] = useState('Just now')

  const openChat = (): void => {
    setIsChatOpen(true)
  }

  const toggleCapture = (): void => {
    setIsCaptureRunning((current) => !current)
    setCaptureStatusLabel('Just now')
  }

  if (isChatOpen) {
    return (
      <HomeChatView
        draft={draft}
        onDraftChange={setDraft}
        onBack={() => setIsChatOpen(false)}
      />
    )
  }

  return (
    <section className="flex min-h-screen flex-col bg-[#fafafa]">
      <div className="border-b border-neutral-200 px-8 py-6">
        <HomeHeader onNewChat={openChat} />
      </div>
      <div className="flex flex-1 flex-col gap-8 px-8 py-8">
        <SummaryCards />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Ask Screenindex
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                  Search your screen history like a conversation
                </h2>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Engine local
              </span>
            </div>
            <div className="space-y-4 text-sm leading-6 text-neutral-600">
              <p>
                Ask about meetings, code, tabs, or workflows and narrow results with time bounds when
                precision matters.
              </p>
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Suggested prompt
                </p>
                <p className="mt-2 text-base text-neutral-900">
                  Show me the Chrome tab where I was debugging the search route this afternoon.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <ChatComposer value={draft} onChange={setDraft} onSend={openChat} />
            </div>
          </div>
          <div className="space-y-6">
            <CaptureControl
              isRunning={isCaptureRunning}
              lastUpdatedLabel={captureStatusLabel}
              onToggle={toggleCapture}
            />
            <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-neutral-100 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                Retrieval modes
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Keyword</p>
                  <p className="mt-2 text-sm text-neutral-200">OCR text matches for exact recall.</p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Semantic</p>
                  <p className="mt-2 text-sm text-neutral-200">Embedding-based lookup for visual memory.</p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Hybrid</p>
                  <p className="mt-2 text-sm text-neutral-200">Blend both signals for ranking and context.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
