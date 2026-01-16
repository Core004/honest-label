import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { publicApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { ProductList, Category } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const productCardsRef = useRef<HTMLDivElement[]>([]);

  const selectedCategory = searchParams.get('category') || '';

  // Define filteredProducts early so it can be used in useLayoutEffect
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Header animations on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - split text effect
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 60,
            rotateX: -45,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
          }
        );
      }

      // Description fade in
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out',
          }
        );
      }

      // Sidebar slide in
      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Product cards animation
  useLayoutEffect(() => {
    if (loading || filteredProducts.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate product cards with stagger
      const cards = productCardsRef.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
            rotateY: -15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: {
              amount: 0.6,
              from: 'start',
            },
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
  }, [loading, filteredProducts.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          publicApi.getProducts({ category: selectedCategory || undefined }),
          publicApi.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (categorySlug: string) => {
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  // Reset card refs when products change
  useEffect(() => {
    productCardsRef.current = [];
  }, [filteredProducts.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section ref={headerRef} className="pt-16 pb-12 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl" style={{ perspective: '1000px' }}>
            <h1
              ref={titleRef}
              className="text-4xl font-semibold tracking-tight text-neutral-900 mb-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              Our Products
            </h1>
            <p ref={descRef} className="text-lg text-neutral-500">
              Explore our comprehensive range of labeling solutions. From barcodes to security
              seals, we have everything you need.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div ref={sidebarRef} className="hidden lg:block">
            <div className="sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="sr-only">
                  Search products
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    width={18}
                  />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-neutral-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <h3 className="font-semibold text-neutral-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === category.slug
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`text-xs ${
                          selectedCategory === category.slug ? 'text-neutral-400' : 'text-neutral-400'
                        }`}
                      >
                        {category.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6 space-y-4">
            <div className="relative">
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                width={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-neutral-400 focus:outline-none text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Icon
                  icon="lucide:package-x"
                  className="mx-auto text-neutral-300 mb-4"
                  width={48}
                />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-neutral-500">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
                </div>
                <div
                  ref={productsGridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  style={{ perspective: '1000px' }}
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      ref={(el) => {
                        if (el) productCardsRef.current[index] = el;
                      }}
                      className="product-card"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
