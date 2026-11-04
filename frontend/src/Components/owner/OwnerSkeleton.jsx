const Block = ({ className = "" }) => <div className={`rounded-md bg-slate-200/80 ${className}`} />;

export function InlineSpinner() {
  return <span aria-hidden="true" className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />;
}

export default function OwnerSkeleton({ variant = "table", label = "Loading content" }) {
  return <div role="status" aria-live="polite" className="w-full">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
      {variant === "dashboard" ? <>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-5"><Block className="h-3 w-20" /><div className="mt-5 flex items-center justify-between"><Block className="h-8 w-14" /><Block className="h-10 w-10 !rounded-full" /></div></div>)}
        </div>
        <div className="max-w-lg rounded-xl border border-slate-200 p-6">
          <Block className="h-5 w-36" /><Block className="mt-3 h-3 w-48" />
          {[0, 1, 2].map((item) => <div key={item} className="mt-6 flex items-center gap-4"><Block className="h-10 w-10 shrink-0 rounded-full" /><div className="flex-1 space-y-2"><Block className="h-3 w-3/4" /><Block className="h-3 w-1/2" /></div><Block className="h-6 w-16" /></div>)}
        </div>
        <div className="max-w-lg rounded-xl border border-slate-200 p-6"><Block className="h-5 w-40" /><Block className="mt-3 h-3 w-48" /><Block className="mt-6 h-9 w-32" /></div>
      </> : variant === "form" ? <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-5"><Block className="h-28 w-44 shrink-0 rounded-xl" /><div className="flex-1 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-3 w-1/2" /></div></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{Array.from({ length: 8 }, (_, index) => <div key={index}><Block className="mb-2 h-3 w-20" /><Block className="h-11 w-full" /></div>)}</div>
        <Block className="h-28 w-full" /><Block className="h-12 w-full sm:w-52" />
      </div> : <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex justify-between gap-6 border-b border-slate-200 bg-slate-50 px-5 py-4"><Block className="h-3 w-24" /><Block className="h-3 w-16" /><Block className="h-3 w-24" /></div>
        {Array.from({ length: 5 }, (_, index) => <div key={index} className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0">
          <Block className="h-12 w-16 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><Block className="h-4 w-2/3 max-w-48" /><Block className="h-3 w-1/2 max-w-32" /></div><Block className="hidden h-6 w-20 sm:block" /><div className="flex gap-2"><Block className="h-9 w-9" /><Block className="h-9 w-9" /></div>
        </div>)}
      </div>}
    </div>
  </div>;
}
