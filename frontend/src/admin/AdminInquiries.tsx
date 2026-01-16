import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Inquiry, InquiryStatus } from '../types';

const statusOptions: { value: InquiryStatus; label: string; color: string }[] = [
  { value: 0, label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 1, label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 3, label: 'Closed', color: 'bg-neutral-100 text-neutral-700' },
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | ''>('');

  const fetchInquiries = async () => {
    try {
      const data = await adminApi.getInquiries({
        status: filter !== '' ? filter : undefined,
      });
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleStatusChange = async (id: number, status: InquiryStatus) => {
    try {
      await adminApi.updateInquiry(id, { status });
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await adminApi.deleteInquiry(id);
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  };

  const getStatusOption = (status: InquiryStatus) => {
    return statusOptions.find((opt) => opt.value === status) || statusOptions[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          <h2 className="text-2xl font-semibold text-neutral-900">Inquiries</h2>
          <p className="text-neutral-500">Manage quote requests and customer inquiries</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value === '' ? '' : parseInt(e.target.value) as InquiryStatus)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="">All Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {inquiries.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-500">
              No inquiries found
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {inquiries.map((inquiry) => {
                const statusOpt = getStatusOption(inquiry.status);
                return (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`px-6 py-4 cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-indigo-50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-neutral-900">{inquiry.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusOpt.color}`}>
                        {statusOpt.label}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500">{inquiry.email}</div>
                    <div className="text-sm text-neutral-400 mt-1">
                      {inquiry.labelType && <span className="mr-2">{inquiry.labelType}</span>}
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inquiry Detail */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Inquiry Details</h3>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Icon icon="lucide:trash-2" width={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Name</label>
                  <p className="text-neutral-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Email</label>
                  <p className="text-neutral-900">
                    <a href={`mailto:${selectedInquiry.email}`} className="text-indigo-600 hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Phone</label>
                    <p className="text-neutral-900">
                      <a href={`tel:${selectedInquiry.phone}`} className="text-indigo-600 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </p>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Company</label>
                    <p className="text-neutral-900">{selectedInquiry.company}</p>
                  </div>
                )}
                {selectedInquiry.labelType && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Label Type</label>
                    <p className="text-neutral-900">{selectedInquiry.labelType}</p>
                  </div>
                )}
                {selectedInquiry.message && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Message</label>
                    <p className="text-neutral-900">{selectedInquiry.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Received</label>
                  <p className="text-neutral-900">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Status</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, parseInt(e.target.value) as InquiryStatus)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Icon icon="lucide:mail" className="mx-auto mb-4" width={32} />
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
