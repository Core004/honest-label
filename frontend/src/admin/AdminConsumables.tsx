import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import type { Consumable } from '../types';

export default function AdminConsumables() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    icon: '',
    features: '',
    isActive: true,
    displayOrder: 0,
  });

  const fetchConsumables = async () => {
    try {
      const data = await adminApi.getAllConsumables();
      setConsumables(data);
    } catch (error) {
      console.error('Failed to fetch consumables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumables();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingConsumable ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConsumable) {
        await adminApi.updateConsumable(editingConsumable.id, formData);
      } else {
        await adminApi.createConsumable(formData);
      }
      setShowModal(false);
      setEditingConsumable(null);
      resetForm();
      fetchConsumables();
    } catch (error) {
      console.error('Failed to save consumable:', error);
    }
  };

  const handleEdit = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setFormData({
      name: consumable.name,
      slug: consumable.slug,
      description: consumable.description || '',
      imageUrl: consumable.imageUrl || '',
      icon: consumable.icon || '',
      features: consumable.features || '',
      isActive: consumable.isActive,
      displayOrder: consumable.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this consumable?')) return;
    try {
      await adminApi.deleteConsumable(id);
      fetchConsumables();
    } catch (error) {
      console.error('Failed to delete consumable:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      icon: '',
      features: '',
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
          <h2 className="text-2xl font-semibold text-neutral-900">Consumables</h2>
          <p className="text-neutral-500">Manage consumable products</p>
        </div>
        <button
          onClick={() => {
            setEditingConsumable(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-neutral-900 text-white hover:bg-neutral-800"
        >
          <Icon icon="lucide:plus" className="mr-2" width={18} />
          Add Consumable
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Order</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {consumables.map((consumable) => (
              <tr key={consumable.id} className={!consumable.isActive ? 'opacity-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Icon icon={consumable.icon || 'lucide:shopping-bag'} className="text-neutral-600" width={20} />
                    </div>
                    <span className="font-medium text-neutral-900">{consumable.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">/{consumable.slug}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    consumable.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {consumable.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">{consumable.displayOrder}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(consumable)}
                    className="p-2 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100"
                  >
                    <Icon icon="lucide:pencil" width={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(consumable.id)}
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

      {consumables.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No consumables yet. Add your first one!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {editingConsumable ? 'Edit Consumable' : 'Add Consumable'}
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
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Features (comma separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={2}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <ImageUpload
                  label="Consumable Image"
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
                    placeholder="lucide:shopping-bag"
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
                    {editingConsumable ? 'Update' : 'Create'}
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
