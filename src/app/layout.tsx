import type { Metadata, Viewport } from "next";
import { Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fintra.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fintra — Finance AI Workspace",
    template: "%s | Fintra",
  },
  description:
    "Fintra brings leading AI models, financial analysis, research, reporting, and recurring finance workflows into one professional workspace.",
  openGraph: {
    type: "website",
    siteName: "Fintra",
    title: "Fintra — Finance AI Workspace",
    description:
      "Leading AI models, financial analysis, reporting, and finance agents — in one professional workspace.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintra — Finance AI Workspace",
    description:
      "Leading AI models, financial analysis, reporting, and finance agents — in one professional workspace.",
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#17150f"/><path d="M10 22V10h12v3.2h-8.4v2.6h7.2V19h-7.2v3z" fill="#faf9f7"/></svg>`
          ),
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
