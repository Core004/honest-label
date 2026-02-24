import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

// Animation variants - same as Products page
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const heroVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Consumables() {
  const { data: consumables = [], isLoading: loading } = useQuery({
    queryKey: ['consumables'],
    queryFn: publicApi.getConsumables,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const parseFeatures = (features: string): string[] => {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(Boolean);
  };

  const filteredConsumables = consumables.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-neutral-50"
    >
      <SEO
        title="Consumables"
        description="Shop label printing consumables — thermal ribbons, label rolls, and printing supplies. Quality materials for consistent label output."
        canonical="https://honestlabel.in/consumables"
      />
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-3xl" variants={heroVariants}>
            <motion.h1
              className="text-4xl font-semibold tracking-tight text-neutral-900 mb-4"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Consumables
            </motion.h1>
            <motion.p
              className="text-lg text-neutral-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Premium thermal ribbons, labels, print heads, and cleaning supplies for your barcode printers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Count */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-sm text-neutral-500">
              Showing {filteredConsumables.length} item{filteredConsumables.length !== 1 && 's'}
            </span>
            <div className="relative w-full sm:w-72">
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                width={18}
              />
              <input
                type="text"
                placeholder="Search consumables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-neutral-400 focus:outline-none text-sm"
              />
            </div>
          </motion.div>

          {/* Grid */}
          {filteredConsumables.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="lucide:package-x" className="mx-auto text-neutral-300 mb-4" width={48} />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No items found</h3>
              <p className="text-neutral-500">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          ) : (
            <motion.div
              key={searchQuery}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {filteredConsumables.map((item) => {
                const features = parseFeatures(item.features);
                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all"
                  >
                    {/* Product Image */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                      {item.imageUrl ? (
                        <OptimizedImage
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallback={
                            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                              <Icon icon={item.icon || 'lucide:package'} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" width={48} />
                            </div>
                          }
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                          <Icon icon={item.icon || 'lucide:package'} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" width={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{item.description}</p>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-600"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        to="/contact"
                        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                      >
                        Get Quote
                        <Icon icon="lucide:arrow-right" className="ml-2" width={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
            Need bulk pricing?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            We offer competitive rates for volume orders. Contact us for custom quotes
            and special pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-white text-neutral-900 hover:bg-neutral-100"
            >
              Request Bulk Quote
              <Icon icon="lucide:arrow-right" width={16} />
            </Link>
            <a
              href="tel:+919512370018"
              className="px-8 py-3.5 border rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 border-neutral-700 text-white hover:bg-neutral-800"
            >
              <Icon icon="lucide:phone" width={16} />
              +91 95123 70018
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
