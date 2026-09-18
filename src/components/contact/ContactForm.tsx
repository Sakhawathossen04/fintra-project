"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[1]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid work email.");
    if (!company.trim()) return setError("Please enter your company.");
    if (message.trim().length < 10) return setError("Tell us a little more (at least 10 characters).");

    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, teamSize, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not submit right now. Please try again.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-sage-soft">
          <svg viewBox="0 0 24 24" className="size-7 text-sage" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink">Message received</h2>
        <p className="mx-auto mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-ink-mute">
          Thanks, {name.split(" ")[0]}. Your message reached the DataLens team — we'll reply to{" "}
          <span className="font-medium text-ink">{email}</span> shortly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="/product" className="inline-flex h-10 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink hover:bg-paper-deep">
            Explore the product
          </a>
          <a href="/pricing" className="inline-flex h-10 items-center rounded-full bg-copper px-5 text-sm font-medium text-white hover:bg-copper-strong">
            View pricing
          </a>
        </div>
      </div>
    );
  }

  const inputCls =
    "h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-[13px] font-medium text-ink-soft">Name</label>
          <input id="c-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Ada Lovelace" />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-[13px] font-medium text-ink-soft">Work email</label>
          <input id="c-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@company.com" />
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-company" className="mb-1.5 block text-[13px] font-medium text-ink-soft">Company</label>
          <input id="c-company" type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} placeholder="Company, Inc." />
        </div>
        <div>
          <label htmlFor="c-size" className="mb-1.5 block text-[13px] font-medium text-ink-soft">Team size</label>
          <select id="c-size" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={inputCls}>
            {TEAM_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="c-msg" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          How can we help? <span className="font-normal text-ink-faint">(use case, timeline, questions)</span>
        </label>
        <textarea
          id="c-msg"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
          placeholder="We're a 12-person data team looking to…"
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Sending…" : "Send message"}
        </Button>
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-faint">
        Submitting sends your message to the DataLens team. We use it only to respond — see the privacy policy.
      </p>
    </form>
  );
}
