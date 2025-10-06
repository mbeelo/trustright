'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Bug, Lightbulb, MessageSquare } from 'lucide-react';

export default function Contact() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('support');

  useEffect(() => {
    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['support', 'bug', 'feature'].includes(tab)) {
      setActiveTab(tab);
      setFormData(prev => ({ ...prev, type: tab }));
    }
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    type: 'support'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ email: '', subject: '', message: '', type: activeTab });
    }, 3000);
  };

  const tabs = [
    { id: 'support', label: 'Contact Support', icon: MessageSquare, placeholder: 'Describe your issue or question...' },
    { id: 'bug', label: 'Report a Bug', icon: Bug, placeholder: 'Describe the bug you encountered...' },
    { id: 'feature', label: 'Suggest a Feature', icon: Lightbulb, placeholder: 'Tell us about your feature idea...' }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  if (submitted) {
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

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank you!</h2>
              <p className="text-lg text-gray-600">
                We&apos;ve received your message and will get back to you soon.
              </p>
            </div>
          </div>
        </div>

        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm" style={{color: '#999', opacity: 0.7}}>Know before you trust.</p>
          </div>
        </footer>
      </div>
    );
  }

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

      <div className="flex-1 max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            We&apos;re here to help improve your TrustRight experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row mb-8 bg-white rounded-lg border border-gray-200 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFormData({ ...formData, type: tab.id });
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-700 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            {activeTabData && <activeTabData.icon className="text-orange-700" size={24} />}
            <h2 className="text-2xl font-bold text-gray-900">{activeTabData?.label}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-700"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-700"
                placeholder={
                  activeTab === 'support' ? 'How can we help?' :
                  activeTab === 'bug' ? 'Brief description of the bug' :
                  'Feature idea summary'
                }
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-700 resize-none"
                placeholder={activeTabData?.placeholder}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-orange-700 text-white rounded-lg hover:bg-orange-800 disabled:bg-gray-400 font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm" style={{color: '#999', opacity: 0.7}}>Know before you trust.</p>
        </div>
      </footer>
    </div>
  );
}