import { useEffect, useState } from "react";

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
            {currentTime.toLocaleTimeString()} · local index
    </div>
  )
}

export function FrameViewport(): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Frame viewer</p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-950">Current snapshot</h2>
        </div>
        <TimeDisplay />
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950">
        <div className="aspect-[16/10] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(135deg,_#101010,_#27272a_45%,_#18181b)] p-6">
          <div className="flex h-full flex-col justify-between rounded-[1.4rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-400">
              <span>Screenindex desktop</span>
              <span>search route</span>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-1/3 rounded-full bg-white/20" />
              <div className="h-28 rounded-2xl bg-white/10" />
              <div className="grid gap-3 md:grid-cols-3">
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/10" />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">VS Code</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">renderer</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">search api</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
