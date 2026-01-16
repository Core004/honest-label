import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { publicApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { LogoCloudSlider } from '@/components/logo-cloud';
import { FaqsSection } from '@/components/FaqsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { LabelAnimation } from '@/components/LabelAnimation';
import { Sparkles } from '@/components/ui/sparkles';
import type { ProductList, Consumable } from '../types';

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductList[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, consumablesData] = await Promise.all([
          publicApi.getProducts({ featured: true }),
          publicApi.getConsumables()
        ]);
        setFeaturedProducts(products.slice(0, 6));
        setConsumables(consumablesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pattern-grid -z-10 h-full w-full"></div>
        
        {/* Sparkles Background */}
        <div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
          <Sparkles
            density={1200}
            className="absolute inset-0 h-full w-full"
            color="#000000"
            opacity={0.3}
            size={2}
            speed={0.5}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-8 shadow-sm border-neutral-200 bg-white text-neutral-600"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            In-House Manufacturing Unit
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] text-neutral-900"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Precision labeling solutions,
            <br />
            <span className="text-neutral-400">direct from the factory.</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We manufacture premium barcodes, thermal rolls, and custom packaging labels using
            advanced in-house machinery. Cut out the middleman for better pricing and faster
            delivery.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/10"
            >
              Browse Catalog
              <Icon icon="lucide:arrow-right" width={16} height={16} />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 border rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            >
              <Icon icon="lucide:phone" width={16} height={16} />
              Talk to Sales
            </Link>
          </motion.div>

          {/* Product Showcase */}
          <motion.div
            className="relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="rounded-xl p-2 shadow-2xl ring-1 lg:rounded-2xl lg:p-3 bg-neutral-100 shadow-neutral-200/50 ring-neutral-900/5">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] sm:aspect-[21/9] border flex items-center justify-center bg-white border-neutral-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full h-full p-2 sm:p-4 opacity-90">
                  <img
                    src="https://honestlabel.in/wp-content/uploads/2024/03/Barcode-Labels-for-Lab-Vials-3.png"
                    alt="Lab Vial Labels"
                    className="object-contain w-full h-full"
                  />
                  <img
                    src="https://honestlabel.in/wp-content/uploads/2024/03/Retail-Garment-Tags-1.png"
                    alt="Garment Tags"
                    className="object-contain w-full h-full"
                  />
                  <img
                    src="https://honestlabel.in/wp-content/uploads/2025/02/Active-RFID-Labels-for-Tracking-3.png"
                    alt="RFID Labels"
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t to-transparent pointer-events-none from-neutral-900/5"></div>

                {/* Floating Badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 backdrop-blur border rounded-lg px-2 py-1.5 sm:px-4 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3 bg-white/90 border-neutral-200">
                  <div className="p-1.5 sm:p-2 rounded-md bg-indigo-50">
                    <Icon icon="lucide:printer" className="text-indigo-600" width={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">
                      Daily Output
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-neutral-900">500,000+ Labels</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-12 -right-12 -z-10 h-[300px] w-[300px] bg-gradient-to-tr blur-3xl rounded-full from-indigo-100/50 to-cyan-50/50"></div>
            <div className="absolute -bottom-12 -left-12 -z-10 h-[300px] w-[300px] bg-gradient-to-tr blur-3xl rounded-full from-rose-100/50 to-indigo-50/50"></div>
          </motion.div>
        </div>
      </div>

      {/* Clients Logo Cloud */}
      <motion.section
        className="py-12 bg-white border-y border-neutral-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-lg md:text-xl font-medium tracking-tight text-neutral-900">
              <span className="text-neutral-500">Trusted by experts.</span>{" "}
              <span className="font-semibold">Used by the leaders.</span>
            </h2>
            <Link
              to="/clients"
              className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View all clients
              <Icon icon="lucide:arrow-right" className="ml-1" width={16} />
            </Link>
          </motion.div>
          <LogoCloudSlider />
        </div>
      </motion.section>

      {/* Label Animation Section */}
      <LabelAnimation />

      {/* Featured Products */}
      <motion.section
        className="py-24 bg-neutral-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl">
              <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">
                Our Products
              </h2>
              <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-900">
                Diverse labeling solutions
              </p>
              <p className="mt-4 text-lg text-neutral-500">
                Explore our range of custom manufactured labels, from heavy-duty industrial
                stickers to delicate cosmetic packaging.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center text-sm font-medium hover:text-indigo-500 text-indigo-600"
            >
              View Full Catalog <Icon icon="lucide:arrow-right" className="ml-1" width={16} />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  custom={index}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="mt-12 text-center md:hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2 border text-sm font-medium rounded-md transition-all shadow-sm border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50"
            >
              View Full Catalog <Icon icon="lucide:arrow-right" className="ml-1" width={16} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        className="py-24 relative overflow-hidden bg-neutral-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              className="mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-6 border-neutral-700 bg-neutral-800 text-neutral-300">
                <Icon icon="lucide:cpu" className="mr-2 text-indigo-400" width={14} />
                Advanced Technology
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
                Powered by In-House
                <br />
                Manufacturing
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-neutral-400">
                Unlike brokers, we own the machines. This gives us complete control over quality,
                timing, and customization. Our facility is equipped with state-of-the-art rotary
                die-cutters and 8-color printing presses.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon icon="lucide:zap" className="mt-1 text-indigo-400" width={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-white">Rapid Production</h4>
                    <p className="mt-1 text-sm text-neutral-400">
                      High-speed output for bulk orders with same-day dispatch options.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon icon="lucide:search" className="mt-1 text-indigo-400" width={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-white">Precision Quality Control</h4>
                    <p className="mt-1 text-sm text-neutral-400">
                      Automated optical inspection systems ensure zero defects.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div className="rounded-2xl border p-8 shadow-2xl bg-neutral-800 border-neutral-700">
                <div className="flex items-center justify-between mb-8 border-b pb-4 border-neutral-700">
                  <div>
                    <h3 className="font-mono text-sm text-white">PRINTER_UNIT_01</h3>
                    <p className="text-xs text-neutral-500">Status: Running</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-neutral-600"></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-4 rounded-full w-full overflow-hidden relative bg-neutral-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 animate-shimmer"></div>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 animate-spin border-neutral-600"></div>
                    <div className="flex-1 h-2 rounded relative overflow-hidden bg-neutral-700">
                      <div className="absolute inset-0 bg-indigo-500 w-full origin-left animate-grow"></div>
                    </div>
                    <div className="h-16 w-16 rounded-full border-4 border-b-indigo-500 animate-spin border-neutral-600"></div>
                  </div>
                  <div className="h-4 rounded-full w-3/4 overflow-hidden relative bg-neutral-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 animate-shimmer"></div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="p-3 rounded border text-center bg-neutral-900/50 border-neutral-700/50">
                    <div className="text-xs uppercase tracking-widest text-neutral-400">Speed</div>
                    <div className="text-lg font-mono text-white">150m/m</div>
                  </div>
                  <div className="p-3 rounded border text-center bg-neutral-900/50 border-neutral-700/50">
                    <div className="text-xs uppercase tracking-widest text-neutral-400">Width</div>
                    <div className="text-lg font-mono text-white">320mm</div>
                  </div>
                  <div className="p-3 rounded border text-center bg-neutral-900/50 border-neutral-700/50">
                    <div className="text-xs uppercase tracking-widest text-neutral-400">Colors</div>
                    <div className="text-lg font-mono text-white">8 Max</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Modern Label Production Animation */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-xl font-semibold text-white mb-2">Live Production Line</h3>
              <p className="text-sm text-neutral-500">Real-time label manufacturing visualization</p>
            </div>

            {/* Modern Glass Container */}
            <div className="relative rounded-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 p-8 overflow-hidden">
              {/* Animated Background Glow */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Production Steps */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
                {/* Step 1: Input */}
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-4 group hover:scale-105 transition-transform">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon icon="lucide:file-input" className="text-red-400" width={32} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs font-medium text-neutral-300">Design Input</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Artwork Ready</p>
                </div>

                {/* Animated Connection Line - Hidden on mobile */}
                <div className="hidden md:block absolute left-[20%] top-1/2 -translate-y-1/2 w-[15%] h-0.5 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-red-500 to-transparent animate-flow"></div>
                </div>

                {/* Step 2: Printing */}
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-4 group hover:scale-105 transition-transform">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon icon="lucide:printer" className="text-indigo-400 animate-pulse" width={32} />
                    <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 animate-ping opacity-50"></div>
                  </div>
                  <p className="text-xs font-medium text-neutral-300">Printing</p>
                  <p className="text-[10px] text-neutral-500 mt-1">8-Color Press</p>
                </div>

                {/* Animated Connection Line - Hidden on mobile */}
                <div className="hidden md:block absolute left-[45%] top-1/2 -translate-y-1/2 w-[15%] h-0.5 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-transparent animate-flow delay-500"></div>
                </div>

                {/* Step 3: Quality Check */}
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-4 group hover:scale-105 transition-transform">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon icon="lucide:scan-line" className="text-cyan-400" width={32} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-0.5 bg-cyan-400/50 animate-scan"></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-neutral-300">Quality Scan</p>
                  <p className="text-[10px] text-neutral-500 mt-1">AI Inspection</p>
                </div>

                {/* Animated Connection Line - Hidden on mobile */}
                <div className="hidden md:block absolute left-[70%] top-1/2 -translate-y-1/2 w-[15%] h-0.5 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-transparent animate-flow delay-1000"></div>
                </div>

                {/* Step 4: Output */}
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-4 group hover:scale-105 transition-transform">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon icon="lucide:package-check" className="text-green-400" width={32} />
                  </div>
                  <p className="text-xs font-medium text-neutral-300">Ready</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Dispatched</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="text-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                  <div className="text-2xl font-bold text-white font-mono counter" data-target="523">523</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Labels/min</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                  <div className="text-2xl font-bold text-green-400 font-mono">99.8%</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Quality Rate</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                  <div className="text-2xl font-bold text-indigo-400 font-mono">8</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Color Stations</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-400">LIVE</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">System Status</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Label Machine Image */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/label-machine.webp"
                alt="Label Manufacturing Machine"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-xl font-semibold text-white">Our Manufacturing Facility</h4>
                <p className="text-sm text-neutral-300 mt-1">State-of-the-art label printing technology</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQs Section */}
      <FaqsSection />

      {/* CTA Section */}
      <motion.section
        className="py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-500 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Contact us today for a free sample and custom quote. We typically respond within 24
            hours.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Request a Quote
              <Icon icon="lucide:arrow-right" width={16} />
            </Link>
            <a
              href="tel:+919512370018"
              className="px-8 py-3.5 border rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            >
              <Icon icon="lucide:phone" width={16} />
              +91 95123 70018
            </a>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
