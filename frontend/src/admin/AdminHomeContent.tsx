import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import type { HomeContent } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: 'lucide:layout' },
  { id: 'stats', label: 'Statistics', icon: 'lucide:bar-chart-2' },
  { id: 'cta', label: 'Call to Action', icon: 'lucide:megaphone' },
  { id: 'technology', label: 'Technology', icon: 'lucide:cpu' },
  { id: 'about', label: 'About Section', icon: 'lucide:info' },
];

export default function AdminHomeContent() {
  const [content, setContent] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<HomeContent | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({
    section: 'hero',
    key: '',
    value: '',
    imageUrl: '',
  });

  const fetchContent = async () => {
    try {
      const data = await adminApi.getAllHomeContent();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch home content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await adminApi.updateHomeContent(editingContent.id, formData);
      } else {
        await adminApi.createHomeContent(formData);
      }
      setShowModal(false);
      setEditingContent(null);
      resetForm();
      fetchContent();
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleEdit = (item: HomeContent) => {
    setEditingContent(item);
    setFormData({
      section: item.section,
      key: item.key,
      value: item.value || '',
      imageUrl: item.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await adminApi.deleteHomeContent(id);
      fetchContent();
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      section: activeSection,
      key: '',
      value: '',
      imageUrl: '',
    });
  };

  const filteredContent = content.filter((item) => item.section === activeSection);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Home Content</h2>
          <p className="text-neutral-500">Manage dynamic content on the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingContent(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-neutral-900 text-white hover:bg-neutral-800"
        >
          <Icon icon="lucide:plus" className="mr-2" width={18} />
          Add Content
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Icon icon={section.icon} className="mr-2" width={16} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Image</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredContent.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{item.key}</span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 max-w-md truncate">
                  {item.value || '-'}
                </td>
                <td className="px-6 py-4">
                  {item.imageUrl ? (
                    <img src={getImageUrl(item.imageUrl)} alt="" className="w-16 h-10 object-cover rounded" />
                  ) : (
                    <span className="text-neutral-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100"
                  >
                    <Icon icon="lucide:pencil" width={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                  >
                    <Icon icon="lucide:trash-2" width={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No content for this section yet. Add some!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {editingContent ? 'Edit Content' : 'Add Content'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  >
                    {SECTIONS.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Key</label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    required
                    placeholder="e.g., title, subtitle, description"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Value</label>
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <ImageUpload
                  label="Image (optional)"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  folder="photos"
                  itemName={formData.key}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    {editingContent ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
