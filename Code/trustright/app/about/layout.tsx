import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TrustRight - Our Methodology & Data Sources",
  description: "Learn about TrustRight's AI-powered methodology for corporate transparency analysis. Discover our data sources, analysis process, and mission to make corporate information accessible.",
  keywords: "TrustRight methodology, corporate transparency, data sources, AI analysis, FEC records, SEC filings, political donations, lobbying data",
  openGraph: {
    title: "About TrustRight - Our Methodology & Data Sources",
    description: "Learn about TrustRight's AI-powered methodology for corporate transparency analysis. Discover our data sources, analysis process, and mission.",
    url: "https://trustright.app/about",
    type: "website"
  },
  twitter: {
    title: "About TrustRight - Our Methodology & Data Sources",
    description: "Learn about TrustRight's AI-powered methodology for corporate transparency analysis. Discover our data sources, analysis process, and mission."
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}