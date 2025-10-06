'use client';
import { useRouter } from 'next/navigation';
import { Search, Database, Shield, CheckCircle } from 'lucide-react';

export default function About() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold"
          >
            <span className="text-black">Trust</span><span className="text-orange-700">Right</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TrustRight</h1>
          <p className="text-xl text-gray-600">
            Making corporate transparency accessible to everyone
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              TrustRight believes every consumer deserves to know who they&apos;re really supporting when they spend money online.
              We aggregate publicly available information about companies—their political activities, legal issues, ownership
              structures, and corporate behavior—so you can make informed decisions that align with your values.
            </p>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How TrustRight Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="text-orange-700" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">AI-Powered Research</h3>
                </div>
                <p className="text-gray-700">
                  Our system uses advanced AI with real-time web search capabilities to gather comprehensive
                  information from public records, news sources, regulatory filings, and legal databases.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="text-orange-700" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Comprehensive Analysis</h3>
                </div>
                <p className="text-gray-700">
                  We analyze 70+ data points including political donations, lobbying expenditures, lawsuits,
                  regulatory violations, ownership structures, and corporate controversies.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sources</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              TrustRight aggregates information exclusively from publicly available sources:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Federal Election Commission (FEC) records</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">SEC filings and corporate documents</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Court records and legal databases</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Regulatory agency violations</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">News articles and press releases</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Lobbying disclosure reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Better Business Bureau records</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Corporate websites and social media</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Methodology */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Analysis Methodology</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Transparency First</h3>
              <p className="text-blue-700">
                Our AI prioritizes finding controversial, hidden, or concerning information that users would want to know.
                We search comprehensively across 5-10 years of history to provide the complete picture.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">What We Analyze</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
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
                <h4 className="text-lg font-bold text-gray-900 mb-2">Trust Score Calculation</h4>
                <p className="text-gray-700">
                  Our Trust Score (1-100) considers multiple factors including transparency levels,
                  verification status, legal compliance, and overall corporate behavior patterns.
                </p>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Disclaimers</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Shield className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Information Accuracy</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    While we strive for accuracy, TrustRight aggregates information using AI and public sources.
                    Data may be incomplete, outdated, or contain errors. We encourage users to verify important
                    information independently and use our analysis as one factor in their decision-making.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Founder */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Built for Transparency</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              TrustRight was created by an independent developer who believes in radical transparency.
              We have no political affiliations and don&apos;t favor any particular ideology—our goal is simply
              to make corporate information accessible so consumers can make informed choices that align
              with their personal values.
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm mb-2" style={{color: '#999', opacity: 0.7}}>Know before you trust.</p>
          <div className="flex justify-center gap-4 text-sm">
            <button
              onClick={() => router.push('/contact')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => router.push('/about')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => router.push('/terms')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => router.push('/privacy')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}