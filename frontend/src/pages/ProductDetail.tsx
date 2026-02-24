import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getImageUrl } from '../utils/imageUrl';
import OptimizedImage from '../components/OptimizedImage';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: product, isLoading: loading, isError: error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => publicApi.getProduct(slug!),
    enabled: !!slug,
    // Seed from cached products list for instant render
    initialData: () => {
      const products = queryClient.getQueryData<any[]>(['products', {}]);
      return products?.find((p) => p.slug === slug);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon icon="lucide:package-x" className="mx-auto text-neutral-300 mb-4" width={64} />
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Product not found</h2>
          <p className="text-neutral-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <Icon icon="lucide:arrow-left" className="mr-2" width={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const features = product.features ? product.features.split('\n').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={product.name}
        description={product.shortDescription || product.description?.slice(0, 160) || `${product.name} — premium label by Honest Label.`}
        canonical={`https://honestlabel.in/products/${slug}`}
        ogType="product"
        ogImage={product.imageUrl ? getImageUrl(product.imageUrl) : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription || product.description,
          image: product.imageUrl ? getImageUrl(product.imageUrl) : undefined,
          brand: { '@type': 'Brand', name: 'Honest Label' },
          category: product.categoryName,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-neutral-500">
            <li>
              <Link to="/" className="hover:text-neutral-900">
                Home
              </Link>
            </li>
            <li>
              <Icon icon="lucide:chevron-right" width={14} />
            </li>
            <li>
              <Link to="/products" className="hover:text-neutral-900">
                Products
              </Link>
            </li>
            <li>
              <Icon icon="lucide:chevron-right" width={14} />
            </li>
            <li className="text-neutral-900">{product.name}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-square rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200 p-4 sm:p-8 flex items-center justify-center relative">
              {product.imageUrl ? (
                <OptimizedImage
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  priority
                  fallback={
                    <div className="text-neutral-400">
                      <Icon icon="lucide:image-off" width={64} />
                    </div>
                  }
                />
              ) : (
                <div className="text-neutral-400">
                  <Icon icon="lucide:image-off" width={64} />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {product.categoryName && (
              <div className="mb-4">
                <span className="inline-flex items-center text-sm text-indigo-600">
                  {product.categoryName}
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-4">{product.name}</h1>

            {product.shortDescription && (
              <p className="text-lg text-neutral-500 mb-6">{product.shortDescription}</p>
            )}

            {product.description && (
              <div className="prose prose-neutral max-w-none mb-8">
                <p>{product.description}</p>
              </div>
            )}

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Icon
                        icon="lucide:check-circle"
                        className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        width={18}
                      />
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Request a Quote
                <Icon icon="lucide:arrow-right" className="ml-2" width={16} />
              </Link>
              <a
                href="tel:+919512370018"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Icon icon="lucide:phone" className="mr-2" width={16} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
