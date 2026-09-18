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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datalens.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DataLens — Chat with your data. Analysis on autopilot.",
    template: "%s | DataLens",
  },
  description:
    "DataLens turns CSVs and JSON into complete analysis: automatic EDA, charts, and AI-narrated findings — no login, no notebook, no code.",
  openGraph: {
    type: "website",
    siteName: "DataLens",
    title: "DataLens — Chat with your data",
    description:
      "Upload a dataset, get a full analysis: distributions, correlations, segments, and report-ready narratives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataLens — Chat with your data",
    description:
      "Upload a dataset, get a full analysis: distributions, correlations, segments, and report-ready narratives.",
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#17150f"/><path d="M9 22v-8m0 0 5 4.5M9 14l-4.5 4M23 10v8m0 0 5-4.5M23 18l-4.5-4" stroke="#faf9f7" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>`
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
