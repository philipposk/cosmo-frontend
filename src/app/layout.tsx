import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cosmo.6x7.gr"),
  title: {
    default: "Cosmo — quiet creative home",
    template: "%s · Cosmo",
  },
  description:
    "A quiet creative home for stories, art, libraries, forums, and goals — with AI baked in and privacy on by default.",
  openGraph: {
    title: "Cosmo",
    description:
      "A quiet creative home for stories, art, libraries, forums, and goals — with AI baked in and privacy on by default.",
    type: "website",
    siteName: "Cosmo",
  },
  twitter: { card: "summary_large_image" },
};

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://cosmo.6x7.gr/#website", name: "Cosmo", url: "https://cosmo.6x7.gr", publisher: { "@id": "https://6x7.gr/#organization" } },
    { "@type": "Organization", "@id": "https://6x7.gr/#organization", name: "6x7", url: "https://6x7.gr" },
    {
      "@type": "WebApplication",
      name: "Cosmo",
      url: "https://cosmo.6x7.gr",
      description:
        "A quiet creative home for stories, art, libraries, forums, and goals, with AI built in and privacy on by default.",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "Web",
      publisher: { "@id": "https://6x7.gr/#organization" },
    },
  ],
}).replace(/</g, "\\u003c");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${newsreader.variable} cosmo min-h-screen antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
