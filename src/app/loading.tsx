export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-paper px-5">
      <div className="flex flex-col items-center gap-4" aria-busy="true" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-2 border-line border-t-copper" aria-hidden />
        <p className="font-mono text-[12px] text-ink-faint">loading datalens…</p>
      </div>
    </div>
  );
}
