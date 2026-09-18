"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Brand";

function redirectTarget(): string {
  const sp = new URLSearchParams(window.location.search);
  const r = sp.get("redirect");
  // Only allow internal redirects
  if (r && r.startsWith("/") && !r.startsWith("//")) return r;
  return "/workspace";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not sign in. Please try again.");
        setBusy(false);
        return;
      }
      router.push(redirectTarget());
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 pr-11 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-md text-ink-faint hover:text-ink"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Continue"}
      </Button>

      <p className="text-center text-[13.5px] text-ink-mute">
        New to DataLens?{" "}
        <Link href="/signup" className="font-medium text-copper-strong hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not create your account. Please try again.");
        setBusy(false);
        return;
      }
      router.push(redirectTarget());
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="su-name" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          Full name
        </label>
        <input
          id="su-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
          placeholder="Ada Lovelace"
        />
      </div>
      <div>
        <label htmlFor="su-email" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          Work email
        </label>
        <input
          id="su-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="su-password" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          Password
        </label>
        <div className="relative">
          <input
            id="su-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 pr-11 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
            placeholder="8+ characters"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-md text-ink-faint hover:text-ink"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-[13px] leading-relaxed text-ink-faint">
        By continuing, you agree to DataLens's{" "}
        <Link href="/terms" className="underline hover:text-ink-mute">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-ink-mute">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-[13.5px] text-ink-mute">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-copper-strong hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
