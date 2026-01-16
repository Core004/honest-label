import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Dashboard, InquiryStatus } from '../types';

const statusColors: Record<InquiryStatus, string> = {
  0: 'bg-blue-100 text-blue-700',
  1: 'bg-yellow-100 text-yellow-700',
  2: 'bg-green-100 text-green-700',
  3: 'bg-neutral-100 text-neutral-700',
};

const statusLabels: Record<InquiryStatus, string> = {
  0: 'New',
  1: 'In Progress',
  2: 'Completed',
  3: 'Closed',
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminApi.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboard) {
    return <div>Failed to load dashboard</div>;
  }

  const stats = [
    { label: 'Products', value: dashboard.totalProducts, icon: 'lucide:package', href: '/admin/products' },
    { label: 'Categories', value: dashboard.totalCategories, icon: 'lucide:folder', href: '/admin/categories' },
    { label: 'Blog Posts', value: dashboard.totalBlogPosts, icon: 'lucide:file-text', href: '/admin/blog' },
    { label: 'Inquiries', value: dashboard.totalInquiries, icon: 'lucide:mail', href: '/admin/inquiries', badge: dashboard.newInquiries },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900">Welcome back!</h2>
        <p className="text-neutral-500">Here's what's happening with your website today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Icon icon={stat.icon} className="text-neutral-600" width={24} />
              </div>
              {stat.badge !== undefined && stat.badge > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {stat.badge} new
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
            <div className="text-sm text-neutral-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Recent Inquiries</h3>
          <Link to="/admin/inquiries" className="text-sm text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {dashboard.recentInquiries.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500">
              No inquiries yet
            </div>
          ) : (
            dashboard.recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">{inquiry.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                      {statusLabels[inquiry.status]}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-500">{inquiry.email}</div>
                </div>
                <div className="text-sm text-neutral-400">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
