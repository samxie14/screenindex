import { FrameViewport } from './FrameViewport'
import { TimelineScrubber } from './TimelineScrubber'
import { TimelineToolbar } from './TimelineToolbar'

const DateDisplay = (): React.JSX.Element => {
  const currentDate = new Date()

  return (
    <div className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
      {currentDate.toDateString()} · local index
    </div>
  )
}

export function TimelineView(): React.JSX.Element {
  return (
    <section className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <div className="border-b border-neutral-200 px-8 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-500">Timeline</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
              Visual playback of indexed activity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Move through captured frames, inspect OCR context, and narrow by app, window, or time range.
            </p>
          </div>
          <DateDisplay />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 px-8 py-8">
        <TimelineToolbar />
        <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <FrameViewport />
          <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">OCR context</p>
            <div className="mt-4 space-y-4 text-sm leading-6 text-neutral-600">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-medium text-neutral-900">Active app</p>
                <p className="mt-1">Screenindex Desktop</p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-medium text-neutral-900">Detected text</p>
                <p className="mt-1">
                  Hybrid search over indexed snapshots. Requires engine HTTP with start_time and end_time.
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-950 p-4 text-neutral-100">
                <p className="font-medium">Similarity notes</p>
                <p className="mt-1 text-neutral-300">
                  Nearby frames cluster around search UI, local API work, and renderer layout changes.
                </p>
              </div>
            </div>
          </aside>
        </div>
        <TimelineScrubber />
      </div>
    </section>
  )
}
