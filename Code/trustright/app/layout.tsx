import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import "./animations.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trustright.app'),
  title: "TrustRight - Website Transparency & Corporate Analysis",
  description: "AI-powered transparency analysis of websites. Discover company ownership, political activities, legal issues, and corporate behavior. Make informed decisions that align with your values.",
  keywords: "website transparency, corporate analysis, company background check, political donations, lobbying, corporate ownership, trust score, business intelligence",
  authors: [{ name: "TrustRight" }],
  creator: "TrustRight",
  publisher: "TrustRight",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trustright.app",
    siteName: "TrustRight",
    title: "TrustRight - Website Transparency & Corporate Analysis",
    description: "AI-powered transparency analysis of websites. Discover company ownership, political activities, legal issues, and corporate behavior.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrustRight - Know before you trust"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustRight - Website Transparency & Corporate Analysis",
    description: "AI-powered transparency analysis of websites. Discover company ownership, political activities, legal issues, and corporate behavior.",
    images: ["/og-image.png"],
    creator: "@trustright",
    site: "@trustright"
  },
  manifest: "/manifest.json"
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
