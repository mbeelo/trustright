import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - TrustRight",
  description: "Read TrustRight's Privacy Policy. Learn how we collect, use, and protect your personal information while providing website transparency analysis.",
  keywords: "TrustRight privacy policy, data protection, personal information, user privacy",
  openGraph: {
    title: "Privacy Policy - TrustRight",
    description: "Read TrustRight's Privacy Policy and learn about our data protection practices.",
    url: "https://trustright.app/privacy",
    type: "website"
  }
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}