'use client';
import { useState } from 'react';
import { Search, Database, Shield, CheckCircle, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-black">Trust</span><span className="text-orange-700">Right</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Web Tool</Link>
            <Link href="/extension" className="text-gray-600 hover:text-gray-900">Extension</Link>
            <Link href="/about" className="text-orange-700 font-medium">About</Link>
            <Link href="/extension#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Web Tool
                  </Link>
                  <Link
                    href="/extension"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Extension
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-orange-700 font-medium hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/extension#pricing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-orange-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Transparency
                <span className="block text-orange-700">for everyone</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We believe every consumer deserves to know who they're really supporting when they spend money online.
                TrustRight makes corporate transparency accessible through AI-powered research and comprehensive analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Database className="text-orange-700" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">70+ Data Points</div>
                    <div className="text-sm text-gray-600">Comprehensive analysis</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Search className="text-orange-700" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">AI-Powered</div>
                    <div className="text-sm text-gray-600">Real-time research</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Transparency visualization */}
              <div className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Company Analysis</h3>
                    <div className="text-sm text-orange-700 font-medium">Transparency Score: 84/100</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-gray-700">Public ownership structure</span>
                      <span className="ml-auto text-xs text-gray-500">Verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-gray-700">Financial disclosures</span>
                      <span className="ml-auto text-xs text-gray-500">Current</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-orange-600" size={20} />
                      <span className="text-gray-700">Political contributions</span>
                      <span className="ml-auto text-xs text-gray-500">$45K (2024)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-gray-700">Privacy policy compliance</span>
                      <span className="ml-auto text-xs text-gray-500">GDPR Ready</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Trust Score Breakdown</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '84%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Database className="text-orange-700" size={24} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="text-blue-600" size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              TrustRight believes every consumer deserves to know who they&apos;re really supporting when they spend money online.
              We aggregate publicly available information about companies—their political activities, legal issues, ownership
              structures, and corporate behavior—so you can make informed decisions that align with your values.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How TrustRight Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform delivers comprehensive corporate transparency analysis
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-orange-700" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Research</h3>
              <p className="text-gray-600">
                Our system uses advanced AI with real-time web search capabilities to gather comprehensive
                information from public records, news sources, regulatory filings, and legal databases.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-orange-700" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Analysis</h3>
              <p className="text-gray-600">
                We analyze 70+ data points including political donations, lobbying expenditures, lawsuits,
                regulatory violations, ownership structures, and corporate controversies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Data Sources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TrustRight aggregates information exclusively from publicly available sources
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Federal Election Commission (FEC) records</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">SEC filings and corporate documents</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Court records and legal databases</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Regulatory agency violations</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">News articles and press releases</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Lobbying disclosure reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Better Business Bureau records</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Corporate websites and social media</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Analysis Methodology</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-orange-700 mb-3">Transparency First</h3>
              <p className="text-gray-700">
                Our AI prioritizes finding controversial, hidden, or concerning information that users would want to know.
                We search comprehensively across 5-10 years of history to provide the complete picture.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">What We Analyze</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Political activities and campaign contributions</li>
                  <li>Lobbying expenditures and governmental influence</li>
                  <li>Legal issues, lawsuits, and regulatory violations</li>
                  <li>Corporate ownership and control structures</li>
                  <li>Environmental and safety records</li>
                  <li>Labor practices and worker treatment</li>
                  <li>Historical controversies and scandals</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Trust Score Calculation</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Our Trust Score (1-100) considers multiple factors including transparency levels,
                  verification status, legal compliance, and overall corporate behavior patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Important Disclaimers</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="text-orange-700" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Information Accuracy</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    While we strive for accuracy, TrustRight aggregates information using AI and public sources.
                    Data may be incomplete, outdated, or contain errors. We encourage users to verify important
                    information independently and use our analysis as one factor in their decision-making.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Built for Transparency</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              TrustRight was created by an independent developer who believes in radical transparency.
              We have no political affiliations and don&apos;t favor any particular ideology—our goal is simply
              to make corporate information accessible so consumers can make informed choices that align
              with their personal values.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Trust</span><span className="text-orange-700">Right</span>
              </div>
              <p className="text-gray-300">
                AI-powered website transparency and corporate analysis platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/extension" className="block text-gray-300 hover:text-orange-700">Chrome Extension</Link>
                <Link href="/dashboard" className="block text-gray-300 hover:text-orange-700">Dashboard</Link>
                <Link href="/pricing" className="block text-gray-300 hover:text-orange-700">Pricing</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-300 hover:text-orange-700">About</Link>
                <Link href="/contact" className="block text-gray-300 hover:text-orange-700">Contact</Link>
                <Link href="/privacy" className="block text-gray-300 hover:text-orange-700">Privacy</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-orange-700">Help Center</a>
                <a href="#" className="block text-gray-300 hover:text-orange-700">Installation Guide</a>
                <a href="#" className="block text-gray-300 hover:text-orange-700">Troubleshooting</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 TrustRight. All rights reserved. Know before you trust.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}