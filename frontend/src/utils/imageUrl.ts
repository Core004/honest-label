const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';

export function getImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
}
