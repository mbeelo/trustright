'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart3, CreditCard, History, Settings, User, Mail, Calendar, Shield } from 'lucide-react';

interface Subscription {
  plan: string;
  searchesUsed: number;
  searchesLimit: number;
  currentPeriodEnd: string | null;
  createdAt?: string;
  isActive?: boolean;
}

interface SearchHistoryItem {
  id: number;
  url: string;
  createdAt: string;
  trustScore?: number;
  website: {
    companyName: string;
    trustScore: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [subResponse, historyResponse] = await Promise.all([
        fetch('/api/user/subscription'),
        fetch('/api/user/searches'),
      ]);

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData);
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setSearchHistory(historyData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (plan: string) => {
    // Stripe functionality disabled until you add your keys
    alert(`Stripe not configured yet. Would upgrade to ${plan} plan when configured.`);
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold"><span className="text-black">Trust</span><span className="text-orange-700">Right</span> Account</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800"
          >
            Back to Search
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Account Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
            <Settings className="text-orange-700" size={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">{session?.user?.name || 'Not provided'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{session?.user?.email}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-medium text-gray-900">
                    {subscription?.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Account Status</div>
                  <div className="font-medium text-green-600">
                    {subscription?.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Usage</h3>
              <BarChart3 className="text-orange-700" size={24} />
            </div>
            {subscription && (
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {subscription.searchesUsed}/{subscription.searchesLimit}
                </div>
                <p className="text-gray-600">Searches this month</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-700 h-2 rounded-full"
                    style={{
                      width: `${(subscription.searchesUsed / subscription.searchesLimit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Plan</h3>
              <CreditCard className="text-orange-700" size={24} />
            </div>
            {subscription && (
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                  {subscription.plan}
                </div>
                <p className="text-gray-600">Current subscription</p>
                {subscription.plan === 'free' && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => createCheckoutSession('PRO')}
                      className="w-full px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800 text-sm"
                    >
                      Upgrade to Pro ($9.99/mo)
                    </button>
                    <button
                      onClick={() => createCheckoutSession('ENTERPRISE')}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm"
                    >
                      Enterprise ($29.99/mo)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Searches</h3>
              <History className="text-orange-700" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {searchHistory.length}
            </div>
            <p className="text-gray-600">Total searches</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
          </div>
          <div className="p-6">
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                {searchHistory.slice(0, 10).map((search, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-medium text-gray-900">{search.url}</div>
                        {search.trustScore && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            search.trustScore >= 80 ? 'bg-green-100 text-green-800' :
                            search.trustScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {search.trustScore}/100
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/?url=${encodeURIComponent(search.url)}`)}
                      className="text-orange-700 hover:text-orange-800 text-sm font-medium ml-4"
                    >
                      Regenerate Report
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No searches yet. Start by analyzing a website!</p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800"
                >
                  Analyze Website
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}