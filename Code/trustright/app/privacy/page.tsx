'use client';
import { useRouter } from 'next/navigation';

export default function Privacy() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use TrustRight, we collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Email address for account creation and authentication</li>
              <li>Website URLs you analyze (not stored permanently)</li>
              <li>Usage data to improve our service</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide website transparency analysis</li>
              <li>Manage your account and subscription</li>
              <li>Send important service updates</li>
              <li>Improve our analysis algorithms</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest.
              We use secure third-party services for authentication and payment processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or share your personal information with third parties, except as required by law
              or to provide our service (such as payment processing through Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <button
                onClick={() => router.push('/contact')}
                className="text-orange-700 hover:text-orange-800 underline"
              >
                our contact page
              </button>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy may be updated from time to time. We will notify you of any material changes
              by posting the new Privacy Policy on this page.
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