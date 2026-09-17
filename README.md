# FINTRA — Finance AI Workspace (Website)

The complete public website for FINTRA: multi-page marketing site, pricing,
authentication, checkout, and integration with the existing FINTRA workspace
product (`[https://final-product-one.vercel.app](https://fintra-project-hpx4.vercel.app/)`).

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion**.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Type checking: `npm run typecheck`

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need.
Everything works locally with **zero** configuration.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | production | Canonical/OG/sitemap base URL |
| `NEXT_PUBLIC_WORKSPACE_URL` | no | Existing FINTRA product URL (defaults to `https://final-product-one.vercel.app`) |
| `DATABASE_URL` | no | MongoDB Atlas connection string for durable storage |
| `STRIPE_SECRET_KEY` | no | Enables live payment mode (see Payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | no | Stripe publishable key |

## Storage adapters

Accounts, sessions, billing records, and contact submissions persist through
one contract (`src/lib/storage.ts`) with three interchangeable adapters:

1. **File** (default) — JSON file in `.data/`; survives restarts, works on
   any Node host with no services.
2. **MongoDB** — active when `DATABASE_URL` is set (Atlas/serverless-ready).
3. **Memory** — `FINTRA_STORAGE=memory`; dev/tests only.

Swap adapters without touching calling code.

## Authentication

Email + password auth with scrypt password hashing and httpOnly
SameSite=Lax session cookies (30-day TTL, server-side validation on every
protected route).

- `POST /api/auth/signup` — create account + session
- `POST /api/auth/login` — verify credentials + session
- `POST /api/auth/logout`, `POST /api/workspace-logout` — end session
- `src/middleware.ts` — guards `/workspace`, `/settings`, `/billing`,
  `/checkout` and redirects anonymous visitors to
  `/login?redirect=<original-path>`

Marketing CTAs ("Start free", "Start using Fintra") always route through
authentication before the workspace. Signed-in users hitting `/login` are
redirected to the workspace.

## Workspace integration (preserved product)

The existing FINTRA workspace is **not** rebuilt or replaced.
`/workspace` is a server component that:

1. Redirects to `/login` when unauthenticated,
2. Shows the signed-in user's plan/account and hands off to the existing
   product at `NEXT_PUBLIC_WORKSPACE_URL`.

A "with account context" link passes `email` and `plan` as query parameters;
when the workspace grows its own session exchange, replace that handoff with
a token exchange — no marketing-site changes needed.

## Payments (integration boundary)

Checkout runs in **clearly-labeled demo mode** until a payment provider is
configured. No card data is collected; no fake charge is ever presented as
real. The checkout UI, order summary, billing interval, success/cancel
states, and billing history are all production-quality and provider-agnostic.

To go live with Stripe:

1. `npm i stripe` and set `STRIPE_SECRET_KEY` +
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Implement `src/lib/payments/stripe.ts` (create a Checkout Session from
   the plan config in `src/lib/plans.ts`)
3. Route `src/app/api/billing/checkout/route.ts` to the Stripe session and
   grant the plan in the webhook handler after `checkout.session.completed`

Plan prices are configuration values in `src/lib/plans.ts` — edit there,
nowhere else.

## Routes

```
Marketing    /  /product (+7 capability pages)  /solutions (+6)
             /developers (+3)  /resources (+4)  /pricing  /enterprise
             /contact  /terms  /privacy  /404
Conversion   /checkout?plan=  /payment/success  /payment/cancel  /billing
Auth         /login  /signup
Product      /workspace (guarded handoff)  /settings (guarded)
API          /api/auth/*  /api/billing/*  /api/contact  /api/workspace-logout
```

## Design system

Tokens live in `src/app/globals.css` (`@theme`): warm paper background,
charcoal ink, muted copper accent, sage support, radii, shadows, motion.
Shared primitives: `Button`, `Brand` (logo/eyebrow/headings/disclosure),
`Reveal` (scroll animation with reduced-motion support), `Window`,
SVG chart primitives (`charts.tsx`), `PageHero`/`FeatureRow`/`CtaBand`
(`src/lib/marketing.tsx`).

## Deployment (Vercel)

```bash
npm i -g vercel
vercel login
vercel            # preview
vercel --prod     # production
```

Set environment variables in the Vercel dashboard (Project → Settings →
Environment Variables):

- `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
- `DATABASE_URL=<mongo-uri>` (recommended in production)
- `NEXT_PUBLIC_WORKSPACE_URL=https://final-product-one.vercel.app`

`vercel.json` pins the framework preset and extends the function timeout for
the auth/billing APIs.

## QA checklist (verified)

- All 33 public routes return 200; 404 page is branded
- Signup → workspace, login → workspace, logout flows
- `/workspace`, `/settings`, `/billing`, `/checkout` redirect when signed out
- Checkout journey with demo-mode disclosure; Enterprise checkout blocked
  with contact-sales path; downgrade works
- Contact form validates, submits, and confirms
- Mobile drawer navigation (open/expand/navigate/close)
- Desktop mega menus, pricing interval toggle, feature table search
- Keyboard focus states, skip link, ARIA labels, reduced-motion support
- `tsc --noEmit` and `next build` clean; no console errors on pages
