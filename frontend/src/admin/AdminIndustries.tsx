import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import type { Industry } from '../types';

export default function AdminIndustries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    icon: '',
    isActive: true,
    displayOrder: 0,
  });

  const fetchIndustries = async () => {
    try {
      const data = await adminApi.getAllIndustries();
      setIndustries(data);
    } catch (error) {
      console.error('Failed to fetch industries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingIndustry ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndustry) {
        await adminApi.updateIndustry(editingIndustry.id, formData);
      } else {
        await adminApi.createIndustry(formData);
      }
      setShowModal(false);
      setEditingIndustry(null);
      resetForm();
      fetchIndustries();
    } catch (error) {
      console.error('Failed to save industry:', error);
    }
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({
      name: industry.name,
      slug: industry.slug,
      description: industry.description || '',
      imageUrl: industry.imageUrl || '',
      icon: industry.icon || '',
      isActive: industry.isActive,
      displayOrder: industry.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    try {
      await adminApi.deleteIndustry(id);
      fetchIndustries();
    } catch (error) {
      console.error('Failed to delete industry:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      icon: '',
      isActive: true,
      displayOrder: 0,
    });
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Industries</h2>
          <p className="text-neutral-500">Manage industries we serve</p>
        </div>
        <button
          onClick={() => {
            setEditingIndustry(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-neutral-900 text-white hover:bg-neutral-800"
        >
          <Icon icon="lucide:plus" className="mr-2" width={18} />
          Add Industry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <div
            key={industry.id}
            className={`bg-white rounded-xl border border-neutral-200 p-6 ${
              !industry.isActive ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Icon icon={industry.icon || 'lucide:factory'} className="text-neutral-600" width={24} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(industry)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                >
                  <Icon icon="lucide:pencil" width={16} />
                </button>
                <button
                  onClick={() => handleDelete(industry.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Icon icon="lucide:trash-2" width={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">{industry.name}</h3>
            <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{industry.description}</p>
            <div className="mt-4 text-xs text-neutral-400">
              /{industry.slug}
            </div>
          </div>
        ))}
      </div>

      {industries.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No industries yet. Add your first one!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {editingIndustry ? 'Edit Industry' : 'Add Industry'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <ImageUpload
                  label="Industry Image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  folder="photos"
                  itemName={formData.name}
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Icon (Lucide icon name)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="lucide:factory"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">Active</span>
                    </label>
                  </div>
                </div>
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
                    {editingIndustry ? 'Update' : 'Create'}
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
