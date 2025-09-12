import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://marketbit.app"),
  title: "Launch Google and Meta ads in minutes | Marketbit",
  description:
    "AI-powered ads for SMBs. Guided funnels, AI creatives, and one-click deployment with plain-English insights.",
  openGraph: {
    title: "Launch Google and Meta ads in minutes | Marketbit",
    description:
      "Run ads without the complexity. Guided funnels, AI creatives, and simple analytics built for SMBs.",
    url: "https://marketbit.app",
    siteName: "Marketbit",
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased min-h-screen selection:bg-black selection:text-white">
        {children}
        <Analytics /> {/* pageviews + basic engagement */}
      </body>
    </html>
  );
}
