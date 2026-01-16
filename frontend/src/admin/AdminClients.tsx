import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import type { ClientLogo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

export default function AdminClients() {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientLogo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    website: '',
    isActive: true,
    displayOrder: 0,
  });

  const fetchClients = async () => {
    try {
      const data = await adminApi.getAllClientLogos();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await adminApi.updateClientLogo(editingClient.id, formData);
      } else {
        await adminApi.createClientLogo(formData);
      }
      setShowModal(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const handleEdit = (client: ClientLogo) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      imageUrl: client.imageUrl || '',
      website: client.website || '',
      isActive: client.isActive,
      displayOrder: client.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client logo?')) return;
    try {
      await adminApi.deleteClientLogo(id);
      fetchClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      imageUrl: '',
      website: '',
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
          <h2 className="text-2xl font-semibold text-neutral-900">Client Logos</h2>
          <p className="text-neutral-500">Manage client logos displayed on the website</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm bg-neutral-900 text-white hover:bg-neutral-800"
        >
          <Icon icon="lucide:plus" className="mr-2" width={18} />
          Add Client Logo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`bg-white rounded-xl border border-neutral-200 p-4 ${
              !client.isActive ? 'opacity-50' : ''
            }`}
          >
            <div className="aspect-[3/2] bg-neutral-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
              {client.imageUrl ? (
                <img
                  src={getImageUrl(client.imageUrl)}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain p-2"
                />
              ) : (
                <Icon icon="lucide:image" className="text-neutral-400" width={32} />
              )}
            </div>
            <h3 className="text-sm font-medium text-neutral-900 truncate">{client.name}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-neutral-500">Order: {client.displayOrder}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100"
                >
                  <Icon icon="lucide:pencil" width={14} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                >
                  <Icon icon="lucide:trash-2" width={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No client logos yet. Add your first one!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {editingClient ? 'Edit Client Logo' : 'Add Client Logo'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <ImageUpload
                  label="Logo Image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  folder="logos"
                  itemName={formData.name}
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
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
                    {editingClient ? 'Update' : 'Create'}
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
