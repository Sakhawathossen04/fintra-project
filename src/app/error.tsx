"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="max-w-md text-center">
        <p className="font-mono text-[13px] tracking-widest text-copper-strong">Error</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Something went wrong.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
          An unexpected error occurred. Try again — if it persists, we'd like to hear about it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[14.5px] font-medium text-white hover:bg-copper-strong"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[14.5px] font-medium text-ink hover:bg-paper-deep"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
