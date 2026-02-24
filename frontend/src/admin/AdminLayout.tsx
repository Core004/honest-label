import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

import LoadingSpinner from '../components/LoadingSpinner';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { href: '/admin/products', label: 'Products', icon: 'lucide:package' },
  { href: '/admin/categories', label: 'Categories', icon: 'lucide:folder' },
  { href: '/admin/industries', label: 'Industries', icon: 'lucide:factory' },
  { href: '/admin/consumables', label: 'Consumables', icon: 'lucide:shopping-bag' },
  { href: '/admin/blog', label: 'Blog', icon: 'lucide:file-text' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'lucide:help-circle' },
  { href: '/admin/clients', label: 'Client Logos', icon: 'lucide:image' },
  { href: '/admin/team', label: 'Team', icon: 'lucide:users' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'lucide:message-square' },
  { href: '/admin/home-content', label: 'Home Content', icon: 'lucide:home' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: 'lucide:mail' },
  { href: '/admin/quote-requests', label: 'Quote Requests', icon: 'lucide:file-text' },
  { href: '/admin/pages', label: 'Page Settings', icon: 'lucide:file-cog' },
  { href: '/admin/settings', label: 'Settings', icon: 'lucide:settings' },
];

export default function AdminLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-900 text-white">
        <div className="flex items-center h-16 px-6 border-b border-neutral-800">
          <img src="/logo.svg" alt="Honest Label" className="h-8 w-auto brightness-0 invert" />
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon icon={item.icon} className="mr-3" width={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                <Icon icon="lucide:user" width={16} />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-neutral-500">{user?.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Logout"
            >
              <Icon icon="lucide:log-out" width={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-6">
          <h1 className="text-lg font-semibold text-neutral-900">
            {navItems.find(
              (item) =>
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href)
            )?.label || 'Admin'}
          </h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
