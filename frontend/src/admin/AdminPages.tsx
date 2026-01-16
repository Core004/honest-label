import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { PageSetting } from '../types';

export default function AdminPages() {
  const [pages, setPages] = useState<PageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchPages = async () => {
    try {
      const data = await adminApi.getAllPageSettings();
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleToggle = async (id: number) => {
    setUpdating(id);
    try {
      await adminApi.togglePageSetting(id);
      fetchPages();
    } catch (error) {
      console.error('Failed to toggle page:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateOrder = async (id: number, displayOrder: number) => {
    try {
      const page = pages.find(p => p.id === id);
      if (page) {
        await adminApi.updatePageSetting(id, { ...page, displayOrder });
        fetchPages();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Page Settings</h2>
        <p className="text-neutral-500">Control which pages are published and visible in the navigation</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Page Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                URL Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Display Order
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                In Navbar
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {pages.map((page) => (
              <tr key={page.id} className={!page.isPublished ? 'bg-neutral-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={page.isPublished ? 'lucide:file-check' : 'lucide:file-x'}
                      className={page.isPublished ? 'text-green-500' : 'text-neutral-400'}
                      width={20}
                    />
                    <div>
                      <div className="font-medium text-neutral-900">{page.pageName}</div>
                      <div className="text-sm text-neutral-500">{page.pageTitle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                    /{page.pageSlug}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={page.displayOrder}
                    onChange={(e) => handleUpdateOrder(page.id, parseInt(e.target.value) || 0)}
                    className="w-16 rounded border border-neutral-300 px-2 py-1 text-sm text-center focus:border-neutral-500 focus:outline-none"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  {page.isPublished ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <Icon icon="lucide:check" width={12} />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                      <Icon icon="lucide:x" width={12} />
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {page.showInNavbar ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <Icon icon="lucide:eye" width={12} />
                      Visible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                      <Icon icon="lucide:eye-off" width={12} />
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggle(page.id)}
                    disabled={updating === page.id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      page.isPublished
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    } disabled:opacity-50`}
                  >
                    {updating === page.id ? (
                      <LoadingSpinner size="sm" />
                    ) : page.isPublished ? (
                      <>
                        <Icon icon="lucide:eye-off" width={14} />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Icon icon="lucide:eye" width={14} />
                        Publish
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No pages found.
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon icon="lucide:info" className="text-amber-600 mt-0.5" width={20} />
          <div className="text-sm text-amber-800">
            <p className="font-medium">How it works:</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>When a page is <strong>unpublished</strong>, it won't appear in the navigation bar</li>
              <li>Visitors cannot access unpublished pages directly</li>
              <li>The Home page cannot be unpublished</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
