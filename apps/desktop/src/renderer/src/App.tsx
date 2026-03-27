import Versions from './components/Versions'
import { SearchPanel } from './components/SearchPanel'

function App(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-white font-mono text-black">
      <header className="flex items-center justify-between border-b border-neutral-300 px-6 py-3">
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">Screenindex</h1>
        <span className="text-xs text-neutral-500">local</span>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-6">
        <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
          Hybrid search over your indexed snapshots. Requires engine HTTP with{' '}
          <code className="rounded border border-neutral-200 bg-surface px-1 py-0.5 text-xs">
            start_time
          </code>{' '}
          and{' '}
          <code className="rounded border border-neutral-200 bg-surface px-1 py-0.5 text-xs">
            end_time
          </code>
          .
        </p>
        <SearchPanel />
      </main>
      <footer className="border-t border-neutral-200 px-6 py-3">
        <Versions />
      </footer>
    </div>
  )
}

export default App
