import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  folder?: 'logos' | 'photos' | 'clients';
  itemName?: string; // Used to generate meaningful filename
}

export default function ImageUpload({ value, onChange, label = 'Image', className = '', folder, itemName }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // For local uploads, prepend the API base URL (without /api)
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      // Build URL with folder and name parameters
      const params = new URLSearchParams();
      if (folder) params.append('folder', folder);
      if (itemName) params.append('name', itemName);
      let uploadUrl = `${API_URL}/upload/image`;
      if (params.toString()) {
        uploadUrl += `?${params.toString()}`;
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlInput = (url: string) => {
    onChange(url);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>

      {value ? (
        <div className="relative">
          <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
            <img
              src={getFullUrl(value)}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999">Image Error</text></svg>';
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Icon icon="lucide:x" width={14} />
          </button>
          <div className="mt-2 text-xs text-neutral-500 truncate">{value}</div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-neutral-500 bg-neutral-50'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Icon icon="lucide:loader-2" className="animate-spin text-neutral-400 mb-2" width={32} />
              <p className="text-sm text-neutral-500">Uploading...</p>
            </div>
          ) : (
            <>
              <Icon icon="lucide:upload-cloud" className="mx-auto text-neutral-400 mb-2" width={32} />
              <p className="text-sm text-neutral-600 mb-2">
                Drag & drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-neutral-900 font-medium hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-neutral-400">PNG, JPG, GIF, WebP, SVG up to 10MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL Input as alternative */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <span>Or paste image URL:</span>
        </div>
        <input
          type="url"
          value={value?.startsWith('/uploads/') ? '' : value || ''}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <Icon icon="lucide:alert-circle" width={14} />
          {error}
        </p>
      )}
    </div>
  );
}
