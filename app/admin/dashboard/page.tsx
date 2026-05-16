'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Building2,
  TrendingUp,
  MessageSquare,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalInquiries: number;
  growth?: {
    properties?: string | null;
    listings?: string | null;
    inquiries?: string | null;
  };
}

interface Property {
  id?: string;
  _id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  images: Array<{ url: string; isCover: boolean }>;
  status: string;
  location?: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  property?: string;
  status: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    totalInquiries: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use individual try-catch or Promise.allSettled to prevent one failure from breaking everything
      const results = await Promise.allSettled([
        api.getDashboardStats(),
        api.getRecentProperties(),
        api.getRecentInquiries()
      ]);

      const [statsRes, propertiesRes, inquiriesRes] = results;

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        const s = statsRes.value.stats || statsRes.value.data;
        if (s) {
          setStats({
            totalProperties: s.totalProperties ?? 0,
            activeListings: s.activeListings ?? 0,
            totalInquiries: s.totalInquiries ?? 0,
            growth: s.growth,
          });
        }
      }
      
      if (propertiesRes.status === 'fulfilled' && propertiesRes.value.success) {
        setRecentProperties(propertiesRes.value.properties || propertiesRes.value.data || []);
      }
      
      if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.success) {
        setRecentInquiries(inquiriesRes.value.inquiries || inquiriesRes.value.data || []);
      }

      // If everything failed, show one toast
      if (results.every(r => r.status === 'rejected')) {
        toast.error('Failed to load dashboard data');
      }
      
    } catch (error: unknown) {
      console.error('Unexpected dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatGrowth = (g: string | null | undefined) => {
    if (g == null) return null;
    if (g === 'new') return 'New this month';
    return g;
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      change: formatGrowth(stats.growth?.properties),
      icon: Building2,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      change: formatGrowth(stats.growth?.listings),
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      change: formatGrowth(stats.growth?.inquiries),
      icon: MessageSquare,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1 font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </h3>
                  {stat.change ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                      {stat.change !== 'New this month' && (
                        <span className="text-sm text-slate-400">vs last month</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">No prior month data</span>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary hover:text-primary/80 font-medium">
              View All
            </Link>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {recentInquiries.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent inquiries found.</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="flex items-start justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-semibold text-slate-900 truncate">{inquiry.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{inquiry.email}</p>
                    {inquiry.property && (
                      <p className="text-xs text-[#C1A06E] mt-1 truncate">{inquiry.property}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        inquiry.status === 'new'
                          ? 'bg-blue-100 text-blue-700'
                          : inquiry.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-700'
                            : inquiry.status === 'follow-up'
                              ? 'bg-purple-100 text-purple-700'
                              : inquiry.status === 'closed'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {inquiry.status === 'follow-up'
                        ? 'Follow-up'
                        : inquiry.status?.replace(/-/g, ' ') || '—'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {inquiry.createdAt &&
                      !Number.isNaN(new Date(inquiry.createdAt).getTime())
                        ? new Date(inquiry.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )
                        : '—'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-primary hover:text-primary/80 font-medium">
              View All
            </Link>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {recentProperties.length === 0 ? (
               <p className="text-slate-500 text-center py-4">No properties found.</p>
            ) : (
              recentProperties.map((property) => (
                <div
                  key={property._id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-16 h-16 shrink-0 bg-slate-200 rounded-lg overflow-hidden relative">
                    {property.images && property.images[0] ? (
                      <img 
                        src={property.images[0].url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {property.title}
                    </h3>
                    <p className="text-sm font-bold text-[#C1A06E]">
                      {property.price?.currency ?? "AED"} {(property.price?.amount ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/properties/edit/${String(property.id ?? property._id)}`}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Edit property"
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

