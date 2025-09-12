import "./globals.css";
import {Analytics} from "@vercel/analytics/react";
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Launch Ads in Minutes — Waitlist</title>
        <meta name="description" content="AI‑powered ads for small businesses. One click to set up, track, and launch Google & Meta ads — no marketing degree required." />
        <meta property="og:title" content="AI ads for small business — Waitlist" />
        <meta property="og:description" content="Connect accounts, generate creatives, one‑click publish, simple analytics. Join the beta." />
      </head>
      <body className="bg-neutral-50 text-neutral-900 antialiased min-h-screen selection:bg-black selection:text-white">
        {children}
        <Analytics />   {/* pageviews + basic engagement */}
      </body>
    </html>
  );
}
