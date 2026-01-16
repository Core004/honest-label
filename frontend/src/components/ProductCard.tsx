import { Link } from 'react-router-dom';
import type { ProductList } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface ProductCardProps {
  product: ProductList;
}

const categoryColors: Record<string, { bg: string; text: string; ring: string }> = {
  'specialty-labels': { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-700/10' },
  'security-compliance': { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-700/10' },
  'retail-branding': { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-700/10' },
  'industrial-labels': { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-700/10' },
  'eco-friendly': { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-700/10' },
  'barcode-labels': { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-700/10' },
};

export default function ProductCard({ product }: ProductCardProps) {
  const colors = categoryColors[product.categorySlug || ''] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    ring: 'ring-gray-700/10',
  };

  return (
    <Link to={`/products/${product.slug}`}>
      <div className="group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-neutral-200 hover:shadow-neutral-200/50">
        <div className="aspect-[4/3] p-6 flex items-center justify-center overflow-hidden border-b bg-neutral-50 border-neutral-100">
          {product.imageUrl ? (
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
            >
              {product.categoryName}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
          <p className="mt-2 text-sm text-neutral-500">{product.shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}
