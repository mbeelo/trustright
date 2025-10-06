'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Globe, AlertTriangle, Users, TrendingUp, Share2, LogOut, User, LogIn } from 'lucide-react';

interface PoliticalDonation {
  year?: string;
  amount?: string;
  type?: string;
  beneficiary?: string;
}

interface Lawsuit {
  issue?: string;
  year?: string;
  status?: string;
}

interface RegulatoryViolation {
  issue?: string;
  year?: string;
  status?: string;
}

interface AnalysisResult {
  company_name?: string;
  name?: string;
  domain?: string;
  company_type?: string;
  parent_company?: string;
  ownership_structure?: string;
  trustScore?: number;
  years_in_operation?: number;
  physical_location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  political_donations?: PoliticalDonation[];
  pac_contributions?: PoliticalDonation[];
  lawsuits?: Lawsuit[];
  regulatory_violations?: RegulatoryViolation[];
  companyName?: string;
  ownership?: { ultimate_parent?: string };
  verification?: { contact_verification?: { status?: string } };
  financials?: { revenue_estimate?: string };
  political?: { activities?: PoliticalDonation[] };
  legal?: { issues?: Lawsuit[] };
  transparency?: { reporting_score?: number };
  stakeholders?: { key_people?: Array<{ name?: string; role?: string }> };
  summary?: string;
}

interface Subscription {
  plan: string;
  searchesUsed: number;
  searchesLimit: number;
}

export default function TrustRight() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string>('');

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch {
      console.error('Failed to fetch subscription');
    }
  }, []);

  useEffect(() => {
    if (session && !subscription) {
      fetchSubscription();
    }
  }, [session, subscription, fetchSubscription]);

  useEffect(() => {
    // Check if URL has a pre-loaded search
    const urlParams = new URLSearchParams(window.location.search);
    const preloadedUrl = urlParams.get('url');
    if (preloadedUrl) {
      setUrl(preloadedUrl);
    }
  }, []);

  const generateFullReport = async (analysisData: AnalysisResult & Record<string, unknown>) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions for a full report (8.5x11 aspect ratio, high res)
    canvas.width = 1275; // 8.5 * 150 DPI
    canvas.height = 1650; // 11 * 150 DPI

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yPos = 80;
    const leftMargin = 60;
    const contentWidth = canvas.width - (leftMargin * 2);

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Header
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Trust', leftMargin, yPos);

    const trustWidth = ctx.measureText('Trust').width;
    ctx.fillStyle = '#c2410c';
    ctx.fillText('Right', leftMargin + trustWidth, yPos);

    yPos += 30;
    ctx.fillStyle = '#666666';
    ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Transparency Report', leftMargin, yPos);

    yPos += 60;

    // Company Header
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    const companyName = analysisData.company_name || analysisData.domain || 'Unknown Company';
    ctx.fillText(companyName, leftMargin, yPos);

    yPos += 35;
    ctx.fillStyle = '#666666';
    ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(analysisData.domain || 'unknown-domain.com', leftMargin, yPos);

    // Location if available
    if (analysisData.physical_location && (analysisData.physical_location.city || analysisData.physical_location.country)) {
      yPos += 10;
      ctx.fillStyle = '#666666';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
      const location = [analysisData.physical_location.city, analysisData.physical_location.state, analysisData.physical_location.country].filter(Boolean).join(', ');
      ctx.fillText(location, leftMargin, yPos);
      yPos += 30;
    }

    yPos += 20;

    // Trust Score Box
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(leftMargin, yPos - 20, 200, 80);
    ctx.strokeStyle = '#e5e7eb';
    ctx.strokeRect(leftMargin, yPos - 20, 200, 80);

    const trustScore = analysisData.trustScore || 0;
    ctx.fillStyle = trustScore >= 80 ? '#059669' :
                   trustScore >= 60 ? '#d97706' : '#dc2626';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(trustScore + '/100', leftMargin + 20, yPos + 20);
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Trust Score', leftMargin + 20, yPos + 40);

    // Basic company info next to trust score
    const rightColX = leftMargin + 250;
    let rightY = yPos - 10;

    if (analysisData.company_type) {
      ctx.fillStyle = '#333333';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Company Type: ' + analysisData.company_type, rightColX, rightY);
      rightY += 20;
    }

    if (analysisData.years_in_operation) {
      ctx.fillStyle = '#333333';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Years Operating: ' + analysisData.years_in_operation, rightColX, rightY);
      rightY += 20;
    }

    if (analysisData.domain_age_years) {
      ctx.fillStyle = '#333333';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Domain Age: ' + analysisData.domain_age_years + ' years', rightColX, rightY);
      rightY += 20;
    }

    if (typeof analysisData.ssl_certificate === 'boolean') {
      ctx.fillStyle = analysisData.ssl_certificate ? '#059669' : '#dc2626';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('SSL Secure: ' + (analysisData.ssl_certificate ? '✓ Yes' : '✗ No'), rightColX, rightY);
      rightY += 20;
    }

    yPos += 120;

    // Red Flags section
    const hasRedFlags = analysisData.domain_age_under_6_months ||
                       (Array.isArray(analysisData.scam_database_matches) && analysisData.scam_database_matches.length > 0) ||
                       analysisData.missing_contact_info ||
                       (Array.isArray(analysisData.recent_negative_press) && analysisData.recent_negative_press.length > 0);

    if (hasRedFlags) {
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(leftMargin, yPos - 15, contentWidth, 60);
      ctx.strokeStyle = '#fecaca';
      ctx.strokeRect(leftMargin, yPos - 15, contentWidth, 60);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('🚨 Red Flags Detected', leftMargin + 20, yPos + 10);

      let flagText = '';
      if (analysisData.domain_age_under_6_months) flagText += 'Domain under 6 months old • ';
      if (analysisData.missing_contact_info) flagText += 'Missing contact info • ';
      if (Array.isArray(analysisData.recent_negative_press) && analysisData.recent_negative_press.length > 0) flagText += `${analysisData.recent_negative_press.length} recent negative news item(s)`;

      if (flagText) {
        ctx.fillStyle = '#991b1b';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(flagText.replace(/ • $/, ''), leftMargin + 20, yPos + 30);
      }
      yPos += 80;
    }

    // Contact Verification section
    if (analysisData.phone_number || analysisData.email_address || analysisData.physical_address) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Contact Verification', leftMargin, yPos);
      yPos += 35;

      if (analysisData.phone_number && typeof analysisData.phone_number === 'object' && 'status' in analysisData.phone_number) {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Phone Number: ', leftMargin, yPos);

        ctx.fillStyle = analysisData.phone_number.status === 'verified' ? '#059669' : '#d97706';
        const phoneWidth = ctx.measureText('Phone Number: ').width;
        ctx.fillText(analysisData.phone_number.status, leftMargin + phoneWidth, yPos);
        yPos += 25;
      }

      if (analysisData.email_address?.status) {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Email Address: ', leftMargin, yPos);

        ctx.fillStyle = analysisData.email_address.status === 'verified' ? '#059669' : '#d97706';
        const emailWidth = ctx.measureText('Email Address: ').width;
        ctx.fillText(analysisData.email_address.status, leftMargin + emailWidth, yPos);
        yPos += 25;
      }

      if (analysisData.physical_address?.status) {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Physical Address: ', leftMargin, yPos);

        const status = analysisData.physical_address.status;
        ctx.fillStyle = status === 'verified' ? '#059669' :
                       status === 'PO Box' ? '#d97706' : '#d97706';
        const addressWidth = ctx.measureText('Physical Address: ').width;
        ctx.fillText(status, leftMargin + addressWidth, yPos);
        yPos += 25;
      }
      yPos += 20;
    }

    // Trust Indicators section
    if (analysisData.bbb_accreditation_status || analysisData.social_media_presence_verified !== undefined || analysisData.business_registration_verified !== undefined) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Trust Indicators', leftMargin, yPos);
      yPos += 35;

      if (analysisData.bbb_accreditation_status) {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('BBB Accreditation: ', leftMargin, yPos);

        ctx.fillStyle = analysisData.bbb_accreditation_status === 'accredited' ? '#059669' : '#d97706';
        const bbbWidth = ctx.measureText('BBB Accreditation: ').width;
        ctx.fillText(analysisData.bbb_accreditation_status, leftMargin + bbbWidth, yPos);

        if (analysisData.bbb_rating) {
          ctx.fillStyle = '#666666';
          ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
          const statusWidth = ctx.measureText(analysisData.bbb_accreditation_status).width;
          ctx.fillText(` (${analysisData.bbb_rating})`, leftMargin + bbbWidth + statusWidth, yPos);
        }
        yPos += 25;
      }

      if (typeof analysisData.social_media_presence_verified === 'boolean') {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Social Media Verified: ', leftMargin, yPos);

        ctx.fillStyle = analysisData.social_media_presence_verified ? '#059669' : '#d97706';
        const socialWidth = ctx.measureText('Social Media Verified: ').width;
        ctx.fillText(analysisData.social_media_presence_verified ? 'Verified' : 'Unverified', leftMargin + socialWidth, yPos);
        yPos += 25;
      }

      if (typeof analysisData.business_registration_verified === 'boolean') {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Business Registration: ', leftMargin, yPos);

        ctx.fillStyle = analysisData.business_registration_verified ? '#059669' : '#d97706';
        const regWidth = ctx.measureText('Business Registration: ').width;
        ctx.fillText(analysisData.business_registration_verified ? 'Verified' : 'Unverified', leftMargin + regWidth, yPos);
        yPos += 25;
      }

      if (analysisData.industry_certifications?.length > 0) {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Certifications: ', leftMargin, yPos);

        ctx.fillStyle = '#c2410c';
        const certWidth = ctx.measureText('Certifications: ').width;
        ctx.fillText(analysisData.industry_certifications.slice(0, 3).join(', '), leftMargin + certWidth, yPos);
        yPos += 25;
      }
      yPos += 20;
    }

    yPos += 100;

    // Business Identity Section
    if (analysisData.parent_company || analysisData.ownership_structure) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Business Identity', leftMargin, yPos);
      yPos += 35;

      if (analysisData.parent_company && analysisData.parent_company !== 'None / Independent') {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Parent Company: ' + analysisData.parent_company, leftMargin, yPos);
        yPos += 25;
      }

      if (analysisData.ownership_structure && analysisData.ownership_structure !== 'Unknown') {
        ctx.fillStyle = '#333333';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Ownership: ' + analysisData.ownership_structure, leftMargin, yPos);
        yPos += 25;
      }
      yPos += 20;
    }

    // Political Donations
    if (analysisData.political_donations?.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Political Donations', leftMargin, yPos);
      yPos += 35;

      analysisData.political_donations.slice(0, 5).forEach((donation: PoliticalDonation) => {
        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(donation.recipient, leftMargin, yPos);

        ctx.fillStyle = '#333333';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        const amount = ` - $${donation.amount?.toLocaleString()} (${donation.year})`;
        const recipientWidth = ctx.measureText(donation.recipient).width;
        ctx.fillText(amount, leftMargin + recipientWidth, yPos);
        yPos += 25;
      });
      yPos += 20;
    }

    // Lobbying
    if (analysisData.lobbying_activity?.status || analysisData.lobbying_activity?.expenditures) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Lobbying Activity', leftMargin, yPos);
      yPos += 35;

      ctx.fillStyle = '#333333';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
      const lobbyingText = analysisData.lobbying_activity.expenditures ?
        `$${analysisData.lobbying_activity.expenditures.toLocaleString()}` :
        'Active';
      ctx.fillText(lobbyingText, leftMargin, yPos);

      if (analysisData.lobbying_activity.details) {
        yPos += 25;
        const detailLines = wrapText(analysisData.lobbying_activity.details, contentWidth - 40, 16);
        detailLines.forEach(line => {
          ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.fillText(line, leftMargin, yPos);
          yPos += 20;
        });
      }
      yPos += 30;
    }

    // Lawsuits
    if (analysisData.lawsuits?.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Legal Issues', leftMargin, yPos);
      yPos += 35;

      analysisData.lawsuits.slice(0, 3).forEach((lawsuit: Lawsuit) => {
        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(lawsuit.case_name, leftMargin, yPos);
        yPos += 22;

        ctx.fillStyle = '#666666';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`${lawsuit.court} - ${lawsuit.date}`, leftMargin, yPos);
        yPos += 20;

        ctx.fillStyle = '#333333';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        const summaryLines = wrapText(lawsuit.summary, contentWidth - 40, 16);
        summaryLines.forEach(line => {
          ctx.fillText(line, leftMargin, yPos);
          yPos += 20;
        });
        yPos += 15;
      });
      yPos += 20;
    }

    // Regulatory Violations
    if (analysisData.regulatory_violations?.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Regulatory Violations', leftMargin, yPos);
      yPos += 35;

      analysisData.regulatory_violations.slice(0, 3).forEach((violation: RegulatoryViolation) => {
        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(violation.violation, leftMargin, yPos);
        yPos += 22;

        ctx.fillStyle = '#666666';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`${violation.agency} - ${violation.date}`, leftMargin, yPos);
        yPos += 25;
      });
    }

    // Footer
    yPos = canvas.height - 60;
    ctx.fillStyle = '#999999';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Generated by TrustRight.app on ${new Date().toLocaleDateString()}`, leftMargin, yPos);

    // Download the report
    const link = document.createElement('a');
    link.download = `${analysisData.domain}-full-report.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const analyzeSite = async () => {
    if (!url || loading) return;

    if (!session) {
      setError('Please sign in to analyze websites');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(`Search limit reached. You've used ${data.used}/${data.limit} searches.`);
        } else {
          setError(data.error || 'Failed to analyze website');
        }
        return;
      }

      setResult(data);
      setSubscription(prev => prev ? { ...prev, searchesRemaining: data.searchesRemaining } : null);

    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold"><span className="text-black">Trust</span><span className="text-orange-700">Right</span></h1>
          <div className="flex items-center gap-4">
            {subscription && (
              <div className="text-sm text-gray-600">
                {subscription.searchesRemaining || 0} searches left
              </div>
            )}
            {session ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <User size={16} />
                  {session.user?.email}
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.location.href = '/auth/signin'}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = '/auth/register'}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800"
                >
                  <User size={16} />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-48 pb-32 text-center">
        <h2 className="text-6xl font-extrabold mb-2 text-gray-900" style={{letterSpacing: '-0.02em'}}>Trust the <span className="text-orange-700 relative">web<span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-700 transform scale-x-0 animate-[slideIn_1s_ease-out_0.5s_forwards]"></span></span>, again.</h2>
        <p className="text-xl mb-8" style={{color: '#666'}}>
          Find out who owns the sites you visit and where their money goes.
        </p>

        <div className="w-full">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeSite()}
                placeholder="Enter any website URL..."
                className="w-full pl-16 pr-6 py-6 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-700 text-gray-900 text-lg shadow-sm"
              />
            </div>
            <button
              onClick={analyzeSite}
              disabled={loading}
              className="px-8 py-6 bg-orange-700 text-white rounded-xl hover:bg-orange-800 disabled:bg-gray-400 font-medium transition-colors shadow-sm border border-orange-700 text-lg"
            >
              {loading ? 'Analyzing...' : 'Analyze Website'}
            </button>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <p className="text-sm text-gray-400">
            {session
              ? "Enter any website URL to get ownership analysis"
              : "Sign in to analyze websites"}
          </p>
        </div>
      </div>

      {result && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Header Section */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{result.company_name || result.name}</h3>
                <p className="text-gray-500">{result.domain}</p>
                {result.physical_location && (result.physical_location.city || result.physical_location.country) && (
                  <p className="text-sm text-gray-400 mt-1">
                    {[result.physical_location.city, result.physical_location.state, result.physical_location.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Trust Score</div>
                <div className={`text-4xl font-bold ${
                  result.trustScore >= 80 ? 'text-green-600' :
                  result.trustScore >= 60 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {result.trustScore}/100
                </div>
                {result.bbb_rating && (
                  <div className="text-xs text-gray-500 mt-1">BBB: {result.bbb_rating}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Company Type</div>
                <div className="font-semibold text-gray-900">{result.company_type || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Years Operating</div>
                <div className="font-semibold text-gray-900">{result.years_in_operation || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Domain Age</div>
                <div className="font-semibold text-gray-900">{result.domain_age_years ? `${result.domain_age_years} years` : 'Unknown'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">SSL Secure</div>
                <div className={`font-semibold ${result.ssl_certificate ? 'text-green-600' : 'text-red-600'}`}>
                  {result.ssl_certificate ? '✓ Yes' : '✗ No'}
                </div>
              </div>
            </div>
          </div>

          {/* Red Flags Alert */}
          {(result.domain_age_under_6_months || result.scam_database_matches?.length > 0 || result.missing_contact_info || result.recent_negative_press?.length > 0) && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                🚨 Red Flags Detected
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {result.domain_age_under_6_months && (
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Domain registered recently (under 6 months)
                  </div>
                )}
                {result.scam_database_matches?.length > 0 && (
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Found in {result.scam_database_matches.length} scam database(s)
                  </div>
                )}
                {result.missing_contact_info && (
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Missing or incomplete contact information
                  </div>
                )}
                {result.recent_negative_press?.length > 0 && (
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {result.recent_negative_press.length} recent negative news item(s)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">

            {/* Business Identity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-orange-700" />
                Business Identity
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-base text-black">Parent Company</div>
                  <div className="font-medium text-orange-700 text-base">{result.parent_company || 'None / Independent'}</div>
                </div>
                <div>
                  <div className="text-base text-black">Ownership Structure</div>
                  <div className="font-medium text-orange-700 text-base">{result.ownership_structure || 'Unknown'}</div>
                </div>
                {result.exec_vs_worker_pay_ratio && (
                  <div>
                    <div className="text-base text-black">CEO to Worker Pay Ratio</div>
                    <div className="font-medium text-orange-700 text-base">{result.exec_vs_worker_pay_ratio}:1</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Verification */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe size={20} className="text-orange-700" />
                Contact Verification
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">Phone Number</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.phone_number?.status === 'verified' ? 'bg-green-100 text-green-700' :
                    result.phone_number?.status === 'unverified' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {result.phone_number?.status || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">Email Address</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.email_address?.status === 'verified' ? 'bg-green-100 text-green-700' :
                    result.email_address?.status === 'unverified' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {result.email_address?.status || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">Physical Address</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.physical_address?.status === 'verified' ? 'bg-green-100 text-green-700' :
                    result.physical_address?.status === 'unverified' ? 'bg-yellow-100 text-yellow-700' :
                    result.physical_address?.status === 'PO Box' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {result.physical_address?.status || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-700" />
                Trust Indicators
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">BBB Accreditation</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.bbb_accreditation_status === 'accredited' ? 'bg-green-100 text-green-700' :
                    result.bbb_accreditation_status === 'not accredited' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {result.bbb_accreditation_status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">Social Media Verified</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.social_media_presence_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {result.social_media_presence_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-black">Business Registration</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.business_registration_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {result.business_registration_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                {result.industry_certifications?.length > 0 && (
                  <div>
                    <div className="text-base text-black mb-1">Certifications</div>
                    <div className="text-sm text-orange-700">{result.industry_certifications.join(', ')}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial & Political Influence */}
          {(result.lobbying_activity?.status || result.political_donations?.length > 0 || result.pac_contributions?.length > 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                💰 Political & Financial Influence
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {result.lobbying_activity?.status && (
                  <div>
                    <div className="text-base text-black mb-2 font-medium">Lobbying Activity</div>
                    <div className="font-medium text-orange-700">
                      {result.lobbying_activity.expenditures ?
                        `$${result.lobbying_activity.expenditures.toLocaleString()}` :
                        'Active'
                      }
                    </div>
                    {result.lobbying_activity.details && (
                      <div className="text-sm text-black mt-1">{result.lobbying_activity.details}</div>
                    )}
                  </div>
                )}
                {result.political_donations?.length > 0 && (
                  <div>
                    <div className="text-base text-black mb-2 font-medium">Political Donations</div>
                    <div className="space-y-1">
                      {result.political_donations.slice(0, 3).map((donation: PoliticalDonation, i: number) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-orange-700">{donation.recipient}</span>
                          <span className="text-black"> - ${donation.amount?.toLocaleString()} ({donation.year})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.pac_contributions?.length > 0 && (
                  <div>
                    <div className="text-base text-black mb-2 font-medium">PAC Contributions</div>
                    <div className="space-y-1">
                      {result.pac_contributions.slice(0, 3).map((pac: PoliticalDonation, i: number) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-orange-700">{pac.pac_name}</span>
                          <span className="text-black"> - ${pac.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Limited Information Notice */}
          {(!result.political_donations?.length &&
            !result.lobbying_activity?.status &&
            !result.lawsuits?.length &&
            !result.regulatory_violations?.length &&
            !result.recent_news_mentions?.length) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-blue-800 mb-3">
                ✓ Clean Record Found
              </h4>
              <p className="text-blue-700 text-base">
                Our analysis found minimal controversial information for {result.company_name || result.domain}.
                This typically indicates either a well-managed company with limited political involvement,
                or a smaller business with less public reporting. This is generally a positive sign for transparency.
              </p>
            </div>
          )}

          {/* Recent News & Controversies */}
          {(result.recent_news_mentions?.length > 0 || result.lawsuits?.length > 0 || result.regulatory_violations?.length > 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📰 Recent News & Legal Issues
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {result.lawsuits?.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Active Lawsuits ({result.lawsuits.length})</div>
                    <div className="space-y-2">
                      {result.lawsuits.slice(0, 3).map((lawsuit: Lawsuit, i: number) => (
                        <div key={i} className="text-base border-l-2 border-red-200 pl-3">
                          <div className="font-medium text-orange-700">{lawsuit.case_name}</div>
                          <div className="text-black text-sm">{lawsuit.court} - {lawsuit.date}</div>
                          <div className="text-black text-sm mt-1">{lawsuit.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.regulatory_violations?.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-orange-600 mb-2">Regulatory Violations ({result.regulatory_violations.length})</div>
                    <div className="space-y-2">
                      {result.regulatory_violations.slice(0, 3).map((violation: RegulatoryViolation, i: number) => (
                        <div key={i} className="text-base border-l-2 border-orange-200 pl-3">
                          <div className="font-medium text-orange-700">{violation.violation}</div>
                          <div className="text-black text-sm">{violation.agency} - {violation.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => generateFullReport(result)}
              className="py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-700 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Report
            </button>
            <button
              onClick={async () => {
                const shareUrl = `${window.location.origin}/?url=${encodeURIComponent(result.domain)}`;
                const shareText = `Found some surprising info about ${result.company_name || result.domain} on TrustRight`;

                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'TrustRight Analysis',
                      text: shareText,
                      url: shareUrl,
                    });
                  } catch {
                    // User cancelled or error occurred
                    console.log('Share cancelled');
                  }
                } else {
                  // Fallback to clipboard
                  navigator.clipboard.writeText(`${shareText}: ${shareUrl}`);
                  alert('Share link copied to clipboard!');
                }
              }}
              className="py-4 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Share2 size={18} />
              Share Link
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm mb-2" style={{color: '#999', opacity: 0.7}}>Know before you trust.</p>
          <div className="flex justify-center gap-4 text-sm">
            <button
              onClick={() => window.location.href = '/contact'}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => window.location.href = '/terms'}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => window.location.href = '/privacy'}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="text-gray-400 hover:text-orange-700 transition-colors text-xs"
              title="Admin Dashboard"
            >
              •
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}