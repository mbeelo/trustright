import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - TrustRight",
  description: "Read TrustRight's Terms of Service. Learn about our service, user responsibilities, subscription terms, and policies for website transparency analysis.",
  keywords: "TrustRight terms of service, user agreement, subscription terms, website transparency",
  openGraph: {
    title: "Terms of Service - TrustRight",
    description: "Read TrustRight's Terms of Service and user agreement.",
    url: "https://trustright.app/terms",
    type: "website"
  }
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}