'use client';

import { useState } from 'react';
import { Download, Shield, Zap, Users, CheckCircle, Chrome, ArrowRight, Star, Play, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function ExtensionPage() {
  const [activeTab, setActiveTab] = useState('features');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Instant Analysis",
      description: "Get trust scores and transparency insights the moment you visit any website - no clicking required."
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-600" />,
      title: "Security Indicators",
      description: "See SSL certificates, privacy policies, and security ratings at a glance with visual indicators."
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Corporate Intelligence",
      description: "Discover company ownership, political donations, lawsuits, and controversies automatically."
    }
  ];

  const benefits = [
    "Real-time trust scoring while browsing",
    "Automatic detection of new websites",
    "Professional floating analysis widget",
    "Seamless TrustRight account integration",
    "24-hour intelligent caching for speed",
    "Privacy-focused with minimal permissions"
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      searches: "5",
      features: [
        "5 website analyses per month",
        "Basic trust scores",
        "Chrome extension access",
        "Community support"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      searches: "100",
      features: [
        "100 website analyses per month",
        "Detailed transparency reports",
        "Priority analysis speed",
        "Email support",
        "Advanced filtering"
      ],
      buttonText: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "month",
      searches: "500",
      features: [
        "500 website analyses per month",
        "Team collaboration tools",
        "API access",
        "Custom reporting",
        "Priority support"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

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
            <Link href="/extension" className="text-orange-700 font-medium">Extension</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
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
                    className="block px-4 py-2 text-sm text-orange-700 font-medium hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Extension
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="#pricing"
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
      <section className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Chrome className="w-8 h-8 text-orange-600 mr-3" />
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Chrome Extension
                </span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Instant Website
                <span className="text-orange-700 block">Transparency</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Get automatic trust analysis on every website you visit. No more switching tabs or manual lookups -
                transparency insights appear right when you need them.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-orange-700 text-white px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors flex items-center justify-center text-lg font-medium">
                  <Download className="w-5 h-5 mr-2" />
                  Add to Chrome - Free
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-orange-700 hover:text-orange-700 transition-colors flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Works with Chrome 88+ • No account required to start</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">trustright.app</div>
                </div>

                {/* Mock Extension Widget */}
                <div className="absolute top-4 right-4 w-72 bg-white border-2 border-orange-500 rounded-xl shadow-lg p-4 z-10">
                  <div className="bg-orange-700 text-white p-3 rounded-t-lg -mx-4 -mt-4 mb-4 flex justify-between items-center">
                    <span className="font-bold text-sm">TrustRight</span>
                    <div className="flex space-x-1">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded text-xs flex items-center justify-center">−</div>
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded text-xs flex items-center justify-center">×</div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-3">example-company.com</div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">23/100</div>
                      <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                    <div className="text-2xl">❌</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="bg-yellow-50 border-l-3 border-yellow-500 p-2 text-xs">
                      ⚖️ 3 lawsuits on record
                    </div>
                    <div className="bg-red-50 border-l-3 border-red-500 p-2 text-xs">
                      🛡️ Data breach in 2023
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="text-xs border border-gray-300 rounded py-2 px-3 hover:border-orange-500">Full Report</button>
                    <button className="text-xs bg-orange-600 text-white rounded py-2 px-3">Dashboard</button>
                  </div>
                </div>

                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-2xl mb-2">🌐</div>
                    <div className="text-sm">Browse any website</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparency at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Chrome extension seamlessly integrates TrustRight&apos;s powerful analysis capabilities
              directly into your browsing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to smarter browsing
            </p>
          </div>

          {/* Step 1: Install Extension */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-700 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  1
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Install Extension</h3>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                Add TrustRight to Chrome in one click. No account required to start analyzing websites immediately.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">One-click installation from Chrome Web Store</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">No account required to start</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Minimal permissions for privacy</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                {/* Chrome Web Store mockup */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">chrome.google.com/webstore</div>
                </div>

                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-16 h-16 bg-orange-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    TR
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">TrustRight - Website Transparency</h4>
                    <p className="text-gray-600 text-sm mb-3">Instant trust analysis for any website you visit</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⭐⭐⭐⭐⭐ 4.8 (127 reviews)</span>
                      <span>10,000+ users</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-orange-700 text-white py-3 rounded-lg font-medium text-lg hover:bg-orange-800 transition-colors">
                  Add to Chrome
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  This extension can access your data on all websites
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Browse Normally */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                {/* Browser mockup with websites */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">shopnow.example.com</div>
                </div>

                {/* Mock website content */}
                <div className="space-y-4 mb-6">
                  <div className="h-8 bg-purple-500 rounded flex items-center px-4">
                    <span className="text-white font-bold">ShopNow</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Extension detecting animation */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-orange-600 font-medium text-sm">🔍 TrustRight is analyzing this website...</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-700 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  2
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Browse Normally</h3>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                Visit any website as usual. The extension automatically detects new pages and analyzes them in the background.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Automatic detection of new websites</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Works on any HTTP/HTTPS website</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">No disruption to your browsing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: See Insights */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-700 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  3
                </div>
                <h3 className="text-3xl font-bold text-gray-900">See Instant Insights</h3>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                Get trust scores, security info, and transparency data in an elegant floating widget that appears automatically.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Instant trust scores (0-100)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Company ownership & lawsuits</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Draggable, non-intrusive widget</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                {/* Browser with extension widget */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">techstartup.example.com</div>
                </div>

                {/* Website content */}
                <div className="h-32 bg-blue-50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-blue-600 text-xl font-bold mb-2">TechStartup</div>
                    <div className="text-blue-400 text-sm">Revolutionary AI Platform</div>
                  </div>
                </div>

                {/* TrustRight Widget - Enhanced */}
                <div className="absolute -top-2 -right-2 w-80 bg-white border-2 border-orange-700 rounded-xl shadow-2xl p-4 z-10">
                  <div className="bg-orange-700 text-white p-3 rounded-t-lg -mx-4 -mt-4 mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded mr-2 flex items-center justify-center text-xs font-bold">TR</div>
                      <span className="font-bold text-sm">TrustRight Analysis</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded text-xs flex items-center justify-center cursor-pointer">−</div>
                      <div className="w-5 h-5 bg-white bg-opacity-20 rounded text-xs flex items-center justify-center cursor-pointer">×</div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-3">techstartup.example.com</div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">87/100</div>
                      <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="bg-green-50 border-l-3 border-green-500 p-2 text-xs">
                      🏢 Verified business registration
                    </div>
                    <div className="bg-blue-50 border-l-3 border-blue-500 p-2 text-xs">
                      🔒 Strong SSL certificate
                    </div>
                    <div className="bg-yellow-50 border-l-3 border-yellow-500 p-2 text-xs">
                      📊 Founded 2 years ago
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="text-xs border border-gray-300 rounded py-2 px-3 hover:border-orange-700 transition-colors">Full Report</button>
                    <button className="text-xs bg-orange-700 text-white rounded py-2 px-3 hover:bg-orange-800 transition-colors">Dashboard</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start with our free tier and upgrade as you analyze more websites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white border-2 rounded-2xl p-8 ${plan.popular ? 'border-orange-700 shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-orange-700 font-medium">{plan.searches} searches per month</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-orange-700 text-white hover:bg-orange-800'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include the Chrome extension and basic website analysis features.
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Browse with Confidence?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Install the TrustRight Chrome extension and get instant transparency insights on every website you visit.
          </p>

          <div className="flex justify-center">
            <button className="bg-orange-700 text-white px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors flex items-center justify-center text-lg font-medium">
              <Download className="w-5 h-5 mr-2" />
              Add to Chrome - Free
            </button>
          </div>

          <div className="mt-6 text-gray-600 text-sm">
            ✓ Free to install ✓ Works immediately ✓ No account required to start
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