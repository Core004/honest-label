import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl } from '../utils/imageUrl';
import LoadingSpinner from '../components/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';

interface Consumable {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  features: string;
  isActive: boolean;
  displayOrder: number;
}

// Category definitions based on icon
const consumableCategories = [
  {
    id: 'thermal-ribbons',
    icon: 'lucide:scroll',
    name: 'Thermal Transfer Ribbons',
    description: 'High-quality ribbons for thermal transfer printing',
  },
  {
    id: 'labels',
    icon: 'lucide:tag',
    name: 'Labels & Tags',
    description: 'Direct thermal and thermal transfer labels',
  },
  {
    id: 'print-heads',
    icon: 'lucide:cpu',
    name: 'Print Heads',
    description: 'Replacement print heads for major brands',
  },
  {
    id: 'cleaning',
    icon: 'lucide:sparkles',
    name: 'Cleaning Supplies',
    description: 'Maintenance kits and cleaning accessories',
  },
];

export default function Consumables() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const productCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/consumables`)
      .then(res => res.json())
      .then(data => {
        setConsumables(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch consumables:', err);
        setLoading(false);
      });
  }, []);

  const getCategoryByIcon = (icon: string) => {
    return consumableCategories.find(c => c.icon === icon);
  };

  const parseFeatures = (features: string): string[] => {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(Boolean);
  };

  // Filter consumables
  const filteredConsumables = consumables.filter((item) => {
    const category = getCategoryByIcon(item.icon);
    const matchesCategory = !selectedCategory || category?.id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // GSAP animations
  useLayoutEffect(() => {
    if (loading || filteredConsumables.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = productCardsRef.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: { amount: 0.4, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: {
              trigger: productsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, filteredConsumables.length, selectedCategory]);

  useEffect(() => {
    productCardsRef.current = [];
  }, [filteredConsumables.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">
      {/* Hero Section - Simple */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              Consumables
            </h1>
            <p className="text-lg text-neutral-500">
              Premium thermal ribbons, labels, print heads, and cleaning supplies for your barcode printers.
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {consumableCategories.map((category, index) => {
              const count = consumables.filter(c => getCategoryByIcon(c.icon)?.id === category.id).length;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                  className={`group p-4 rounded-xl border text-left transition-all ${
                    selectedCategory === category.id
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-neutral-100'
                  }`}>
                    <Icon
                      icon={category.icon}
                      width={20}
                      className={selectedCategory === category.id ? 'text-white' : 'text-neutral-600'}
                    />
                  </div>
                  <h3 className={`font-medium text-sm mb-1 ${
                    selectedCategory === category.id ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs ${
                    selectedCategory === category.id ? 'text-neutral-300' : 'text-neutral-500'
                  }`}>
                    {count} items
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="mb-6">
                  <div className="relative">
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
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      All Items
                    </button>
                    {consumableCategories.map((category) => {
                      const count = consumables.filter(c => getCategoryByIcon(c.icon)?.id === category.id).length;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            selectedCategory === category.id
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon icon={category.icon} width={16} />
                            {category.name}
                          </span>
                          <span className="text-xs">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden mb-6">
              <div className="relative">
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
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Showing {filteredConsumables.length} item{filteredConsumables.length !== 1 && 's'}
                </span>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Icon icon="lucide:x" width={14} />
                    Clear filter
                  </button>
                )}
              </div>

              {filteredConsumables.length === 0 ? (
                <div className="text-center py-20">
                  <Icon icon="lucide:package-x" className="mx-auto text-neutral-300 mb-4" width={48} />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No items found</h3>
                  <p className="text-neutral-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div
                  ref={productsGridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredConsumables.map((item, index) => {
                    const category = getCategoryByIcon(item.icon);
                    const features = parseFeatures(item.features);
                    return (
                      <div
                        key={item.id}
                        ref={(el) => {
                          if (el) productCardsRef.current[index] = el;
                        }}
                        className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all"
                      >
                        {/* Product Image */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                          <img
                            src={getImageUrl(item.imageUrl)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="text-xs text-indigo-600 font-medium mb-1">
                            {category?.name || 'Consumable'}
                          </div>
                          <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{item.description}</p>

                          {/* Features */}
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

                          {/* CTA */}
                          <Link
                            to="/contact"
                            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                          >
                            Get Quote
                            <Icon icon="lucide:arrow-right" className="ml-2" width={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
}
