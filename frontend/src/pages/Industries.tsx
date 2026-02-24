import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

// Animation variants
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

export default function Industries() {
  const { data: industries = [], isLoading: loading } = useQuery({
    queryKey: ['industries'],
    queryFn: publicApi.getIndustries,
  });

  const parseFeatures = (features: string): string[] => {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(Boolean);
  };

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
    >
      <SEO
        title="Industries We Serve"
        description="Honest Label provides labelling solutions for food, pharma, logistics, retail, and more. Discover how we serve your industry."
        canonical="https://honestlabel.in/industries"
      />
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 overflow-hidden bg-gradient-to-b from-red-50/30 via-white to-neutral-50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-neutral-100 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={heroVariants}>
            <motion.div
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-8 shadow-sm border-neutral-200 bg-white text-neutral-600"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              Industries We Serve
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] text-neutral-900"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Specialized solutions
              <br />
              <span className="text-neutral-400">for your sector.</span>
            </motion.h1>

            <motion.p
              className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Each industry has unique labeling requirements. We deliver compliant, durable
              solutions tailored to your specific needs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/10"
              >
                Get Industry Quote
                <Icon icon="lucide:arrow-right" width={16} height={16} />
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 border rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              >
                <Icon icon="lucide:package" width={16} height={16} />
                View Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image - Fixed Height */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  {industry.imageUrl ? (
                    <OptimizedImage
                      src={getImageUrl(industry.imageUrl)}
                      alt={industry.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                          <Icon icon={industry.icon || 'lucide:tag'} className="text-neutral-600 group-hover:text-neutral-500 transition-colors" width={48} />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                      <Icon icon={industry.icon || 'lucide:tag'} className="text-neutral-600 group-hover:text-neutral-500 transition-colors" width={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon icon={industry.icon || 'lucide:tag'} width={20} />
                      </div>
                      <h3 className="font-semibold text-sm leading-tight">{industry.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Content - Flex grow to fill space */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Description - Fixed height with line clamp */}
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2 h-10">{industry.description}</p>

                  {/* Features - Fixed height */}
                  <div className="space-y-2 mb-4 flex-grow">
                    {parseFeatures(industry.features).slice(0, 4).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-neutral-600"
                      >
                        <Icon icon="lucide:check" className="text-red-500 flex-shrink-0" width={14} />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button - Always at bottom */}
                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 mt-auto"
                  >
                    Get Quote
                    <Icon icon="lucide:arrow-right" className="ml-2" width={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center md:hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2 border text-sm font-medium rounded-md transition-all shadow-sm border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50"
            >
              Request Custom Solution <Icon icon="lucide:arrow-right" className="ml-1" width={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section - Dark */}
      <section className="py-24 relative overflow-hidden bg-neutral-900 text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-20"></div>

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
                <Icon icon="lucide:shield-check" className="mr-2 text-red-400" width={14} />
                Why Industries Trust Us
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
                Compliance & Quality
                <br />
                You Can Rely On
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-neutral-400">
                We understand that each industry has strict regulatory requirements. Our labels
                meet FDA, GHS, OSHA, and other industry-specific standards, backed by rigorous
                quality control.
              </p>

              <div className="space-y-4">
                {[
                  { icon: 'lucide:file-check', title: 'Regulatory Compliance', desc: 'Labels that meet FDA, GHS, OSHA, and industry-specific requirements.' },
                  { icon: 'lucide:settings-2', title: 'Custom Materials', desc: 'Tailored substrates and adhesives for your specific application.' },
                  { icon: 'lucide:clock', title: 'Fast Turnaround', desc: 'In-house manufacturing means quick production and delivery.' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0">
                      <Icon icon={item.icon} className="mt-1 text-red-400" width={20} />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white">{item.title}</h4>
                      <p className="mt-1 text-sm text-neutral-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
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
                    <h3 className="font-mono text-sm text-white">COMPLIANCE_CHECK</h3>
                    <p className="text-xs text-neutral-500">Status: All Standards Met</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {['FDA Approved', 'GHS Compliant', 'OSHA Standards', 'ISO 9001 Certified'].map(
                    (item, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-700/50"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon="lucide:check-circle" className="text-green-500" width={20} />
                          <span className="text-sm text-white">{item}</span>
                        </div>
                        <span className="text-xs text-green-400">Verified</span>
                      </motion.div>
                    )
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Quality Score</span>
                    <span className="text-2xl font-bold text-white">99.8%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-neutral-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "99.8%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Don't see your industry?
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-500 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            We work with businesses across all sectors. Contact us to discuss your specific
            labeling requirements and get a customized solution.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Contact Our Team
                <Icon icon="lucide:arrow-right" width={16} />
              </Link>
            </motion.div>
            <motion.a
              href="tel:+919512370018"
              className="px-8 py-3.5 border rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:phone" width={16} />
              +91 95123 70018
            </motion.a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
