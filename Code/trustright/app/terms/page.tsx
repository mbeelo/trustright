'use client';
import { useRouter } from 'next/navigation';

export default function Terms() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By using TrustRight, you agree to these Terms of Service. If you do not agree to these terms,
              please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TrustRight provides transparency analysis of websites, including information about:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Company ownership and structure</li>
              <li>Political donations and lobbying activities</li>
              <li>Legal issues and regulatory violations</li>
              <li>Trust indicators and verification status</li>
              <li>Other publicly available information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Accuracy</h2>
            <p className="text-gray-700 leading-relaxed">
              TrustRight aggregates publicly available information using AI and web search. While we strive for accuracy,
              we cannot guarantee that all information is complete, current, or error-free. Users should verify
              important information independently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to circumvent usage limits</li>
              <li>Not misuse or abuse the service</li>
              <li>Respect intellectual property rights</li>
              <li>Provide accurate account information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription and Payment</h2>
            <p className="text-gray-700 leading-relaxed">
              TrustRight offers subscription plans with different usage limits. Payments are processed securely
              through Stripe. Subscriptions automatically renew unless cancelled. Refunds may be available
              according to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The TrustRight service, including its design, functionality, and analysis algorithms, is owned by us
              and protected by intellectual property laws. You may not copy, modify, or distribute our service
              without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TrustRight is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from
              your use of the service, including but not limited to decisions made based on our analysis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your access to TrustRight at any time for violation of these terms
              or other reasons. You may cancel your subscription at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service from time to time. We will notify you of material changes
              by posting the updated terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these Terms? Contact us at{' '}
              <button
                onClick={() => router.push('/contact')}
                className="text-orange-700 hover:text-orange-800 underline"
              >
                our contact page
              </button>.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Last updated: {new Date().toLocaleDateString()}
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