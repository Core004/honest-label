import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { adminApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { QuoteRequest, QuoteRequestStatus } from '../types';

const statusOptions: { value: QuoteRequestStatus; label: string; color: string }[] = [
  { value: 0, label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 1, label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'Quoted', color: 'bg-purple-100 text-purple-700' },
  { value: 3, label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 4, label: 'Closed', color: 'bg-neutral-100 text-neutral-700' },
];

export default function AdminQuoteRequests() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [filter, setFilter] = useState<QuoteRequestStatus | ''>('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await adminApi.getQuoteRequests({
        status: filter !== '' ? filter : undefined,
      });
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch quote requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleStatusChange = async (id: number, status: QuoteRequestStatus) => {
    try {
      await adminApi.updateQuoteRequest(id, { status });
      fetchRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (error) {
      console.error('Failed to update quote request:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    try {
      await adminApi.updateQuoteRequest(selectedRequest.id, { adminNotes });
      fetchRequests();
      setSelectedRequest({ ...selectedRequest, adminNotes });
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;
    try {
      await adminApi.deleteQuoteRequest(id);
      fetchRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Failed to delete quote request:', error);
    }
  };

  const getStatusOption = (status: QuoteRequestStatus) => {
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

  useEffect(() => {
    if (selectedRequest) {
      setAdminNotes(selectedRequest.adminNotes || '');
    }
  }, [selectedRequest]);

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
          <h2 className="text-2xl font-semibold text-neutral-900">Quote Requests</h2>
          <p className="text-neutral-500">Manage quote requests from the Get Quote page</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value === '' ? '' : (parseInt(e.target.value) as QuoteRequestStatus))}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="">All Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {requests.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-500">No quote requests found</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {requests.map((request) => {
                const statusOpt = getStatusOption(request.status);
                return (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`px-6 py-4 cursor-pointer transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-indigo-50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-neutral-900">{request.name}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusOpt.color}`}
                      >
                        {statusOpt.label}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500">{request.email}</div>
                    <div className="text-sm text-neutral-400 mt-1">
                      <span className="mr-2">{request.productType}</span>
                      {formatDate(request.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Request Detail */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          {selectedRequest ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Quote Details</h3>
                <button
                  onClick={() => handleDelete(selectedRequest.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Icon icon="lucide:trash-2" width={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Name</label>
                  <p className="text-neutral-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Email</label>
                  <p className="text-neutral-900">
                    <a href={`mailto:${selectedRequest.email}`} className="text-indigo-600 hover:underline">
                      {selectedRequest.email}
                    </a>
                  </p>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Phone</label>
                    <p className="text-neutral-900">
                      <a href={`tel:${selectedRequest.phone}`} className="text-indigo-600 hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </p>
                  </div>
                )}
                {selectedRequest.company && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Company</label>
                    <p className="text-neutral-900">{selectedRequest.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Product Type</label>
                  <p className="text-neutral-900">{selectedRequest.productType}</p>
                </div>
                {selectedRequest.size && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Size</label>
                    <p className="text-neutral-900">{selectedRequest.size}</p>
                  </div>
                )}
                {selectedRequest.quantity && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Quantity</label>
                    <p className="text-neutral-900">{selectedRequest.quantity}</p>
                  </div>
                )}
                {selectedRequest.material && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Material</label>
                    <p className="text-neutral-900">{selectedRequest.material}</p>
                  </div>
                )}
                {selectedRequest.printType && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Print Type</label>
                    <p className="text-neutral-900">{selectedRequest.printType}</p>
                  </div>
                )}
                {selectedRequest.additionalDetails && (
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Additional Details</label>
                    <p className="text-neutral-900">{selectedRequest.additionalDetails}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Received</label>
                  <p className="text-neutral-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Status</label>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) =>
                      handleStatusChange(selectedRequest.id, parseInt(e.target.value) as QuoteRequestStatus)
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none resize-none"
                    placeholder="Add internal notes..."
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="mt-2 w-full py-2 px-3 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Icon icon="lucide:file-text" className="mx-auto mb-4" width={32} />
              <p>Select a quote request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
