'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, Users, ArrowLeft, Calendar, Key, Search, AlertTriangle, Crown, Star } from 'lucide-react';

interface DashboardStats {
  totalAnalyses: number;
  totalUsers: number;
  averageTrustScore: number;
  flaggedWebsites: number;
  freeUsers: number;
  proUsers: number;
  eliteUsers: number;
  freeToProConversion: number;
  proToEliteConversion: number;
  freeToEliteConversion: number;
  dailyStats: Array<{
    date: string;
    analyses: number;
    users: number;
  }>;
  trustScoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  topDomains: Array<{
    domain: string;
    analyses: number;
    avgTrustScore: number;
  }>;
  flagsByCategory: Array<{
    category: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [accessKey, setAccessKey] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const isAuthorized = accessKey !== '';

  const fetchStats = useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      setLoading(true);

      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${accessKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.warn('API call failed, using mock data:', response.status, response.statusText);
      }
    } catch {
      console.warn('API call failed, using mock data');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [timeRange, accessKey, isFetching]);

  useEffect(() => {
    // Check if key is stored in sessionStorage
    const storedKey = sessionStorage?.getItem('admin-key');
    if (storedKey) {
      setAccessKey(storedKey);
      setShowKeyPrompt(false);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    if (!showKeyPrompt && isAuthorized) {
      fetchStats();
    }
  }, [timeRange, showKeyPrompt, isAuthorized, fetchStats]);

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the admin key by making a test API call
    try {
      const response = await fetch('/api/admin/analytics?timeRange=7d', {
        headers: {
          'Authorization': `Bearer ${accessKey}`
        }
      });

      if (response.ok) {
        sessionStorage?.setItem('admin-key', accessKey);
        setShowKeyPrompt(false);
        fetchStats();
      } else {
        alert('Invalid admin key');
      }
    } catch {
      alert('Error validating admin key');
    }
  };

  if (showKeyPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter the admin key to continue</p>
          </div>

          <form onSubmit={handleKeySubmit}>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter admin key..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-orange-700 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-orange-700 hover:bg-orange-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-orange-700 transition-colors text-sm flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to TrustRight
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#ea580c', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to TrustRight
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">TrustRight Analytics</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-orange-700"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {stats && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Analyses</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Avg Trust Score</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageTrustScore}</p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Flagged Sites</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.flaggedWebsites.toLocaleString()}</p>
                    <p className="text-xs text-red-600">{((stats.flaggedWebsites / stats.totalAnalyses) * 100).toFixed(1)}% of total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Tier Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Free Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.freeUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)}% of total</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pro Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.proUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{((stats.proUsers / stats.totalUsers) * 100).toFixed(1)}% of total</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Elite Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.eliteUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{((stats.eliteUsers / stats.totalUsers) * 100).toFixed(1)}% of total</p>
              </div>
            </div>

            {/* Conversion Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Free → Pro</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.freeToProConversion.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Conversion rate</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pro → Elite</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.proToEliteConversion.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Conversion rate</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Free → Elite</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.freeToEliteConversion.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Direct conversion</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="analyses" stroke="#ea580c" strokeWidth={2} name="Analyses" />
                    <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Tier Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Tier Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Free', value: stats.freeUsers, color: '#6b7280' },
                        { name: 'Pro', value: stats.proUsers, color: '#2563eb' },
                        { name: 'Elite', value: stats.eliteUsers, color: '#7c3aed' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: Record<string, unknown>) => `${entry.name as string}: ${entry.value as number} (${((entry.percent as number) * 100).toFixed(1)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Free', value: stats.freeUsers, color: '#6b7280' },
                        { name: 'Pro', value: stats.proUsers, color: '#2563eb' },
                        { name: 'Elite', value: stats.eliteUsers, color: '#7c3aed' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Analyzed Domains */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Analyzed Domains</h3>
                <div className="space-y-4">
                  {stats.topDomains.map((domain, index) => (
                    <div key={domain.domain} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{domain.domain}</p>
                          <p className="text-sm text-gray-500">{domain.analyses} analyses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{domain.avgTrustScore}</p>
                        <p className="text-sm text-gray-500">avg score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags by Category */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.flagsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.flagsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}