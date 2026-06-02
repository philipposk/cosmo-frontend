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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${newsreader.variable} cosmo min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
