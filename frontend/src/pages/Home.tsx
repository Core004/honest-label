import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import OptimizedImage from '../components/OptimizedImage';
import { LogoCloudSlider } from '@/components/logo-cloud';
import { FaqsSection } from '@/components/FaqsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { LabelAnimation } from '@/components/LabelAnimation';
import { Sparkles } from '@/components/ui/sparkles';
import SEO from '../components/SEO';

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
  const { data: allProducts = [], isLoading: loading } = useQuery({
    queryKey: ['products', { featured: true }],
    queryFn: () => publicApi.getProducts({ featured: true }),
  });
  const featuredProducts = allProducts.slice(0, 6);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <SEO
        title="Premium In-House Label Manufacturing"
        description="Honest Label manufactures premium barcodes, thermal rolls, and custom packaging labels in Ahmedabad. In-house machinery means better pricing and faster delivery."
        canonical="https://honestlabel.in/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Honest Label',
            url: 'https://honestlabel.in',
            logo: 'https://honestlabel.in/favicon.png',
            description: 'Premium in-house label manufacturing company based in Ahmedabad, Gujarat.',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-9512370018',
              contactType: 'sales',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Honest Label',
            url: 'https://honestlabel.in',
            image: 'https://honestlabel.in/favicon.png',
            telephone: '+91-9512370018',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ahmedabad',
              addressRegion: 'Gujarat',
              addressCountry: 'IN',
            },
            priceRange: '$$',
          },
        ]}
      />
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pattern-grid -z-10 h-full w-full"></div>
        
        {/* Sparkles Background */}
        <div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
          <Sparkles
            density={400}
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
                  {(() => {
                    // Show: Active RFID, Lab Vial Barcodes (center), Bath & Beauty
                    const heroOrder = [5, 1, 6]; // product IDs
                    const heroes = heroOrder
                      .map(id => featuredProducts.find(p => p.id === id))
                      .filter(Boolean);
                    return heroes.length === 3 ? heroes : featuredProducts.slice(0, 3);
                  })().map((product) => (
                    <OptimizedImage
                      key={product.id}
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="object-contain w-full h-full"
                      priority
                    />
                  ))}
                  {featuredProducts.length === 0 && (
                    <>
                      <div className="bg-neutral-100 rounded animate-pulse w-full h-full" />
                      <div className="bg-neutral-100 rounded animate-pulse w-full h-full" />
                      <div className="bg-neutral-100 rounded animate-pulse w-full h-full" />
                    </>
                  )}
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
            <h2 className="text-base sm:text-lg md:text-xl font-medium tracking-tight text-neutral-900">
              <span className="text-neutral-500">Trusted by experts.</span>{" "}
              <span className="font-semibold">Used by the leaders.</span>
            </h2>
            <Link
              to="/clients"
              className="hidden sm:inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
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
        className="py-12 sm:py-24 bg-neutral-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12"
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
        className="py-12 sm:py-24 relative overflow-hidden bg-neutral-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-6 border-neutral-700 bg-neutral-800 text-neutral-300">
              <Icon icon="lucide:cpu" className="mr-2 text-indigo-400" width={14} />
              Advanced Technology
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
              Powered by In-House Manufacturing
            </h2>
            <p className="text-lg leading-relaxed text-neutral-400">
              Unlike brokers, we own the machines. This gives us complete control over quality,
              timing, and customization. Our facility is equipped with state-of-the-art rotary
              die-cutters and 8-color printing presses.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="rounded-xl border p-4 sm:p-6 text-center bg-neutral-800/50 border-neutral-700/50">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Icon icon="lucide:zap" className="text-indigo-400" width={22} />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">Rapid Production</h4>
              <p className="text-xs sm:text-sm text-neutral-400">High-speed output for bulk orders with same-day dispatch options.</p>
            </div>
            <div className="rounded-xl border p-4 sm:p-6 text-center bg-neutral-800/50 border-neutral-700/50">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Icon icon="lucide:search" className="text-cyan-400" width={22} />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">Quality Control</h4>
              <p className="text-xs sm:text-sm text-neutral-400">Automated optical inspection systems ensure zero defects.</p>
            </div>
            <div className="rounded-xl border p-4 sm:p-6 text-center bg-neutral-800/50 border-neutral-700/50">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Icon icon="lucide:palette" className="text-rose-400" width={22} />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">8-Color Printing</h4>
              <p className="text-xs sm:text-sm text-neutral-400">Vibrant, precise color reproduction for premium label finishes.</p>
            </div>
            <div className="rounded-xl border p-4 sm:p-6 text-center bg-neutral-800/50 border-neutral-700/50">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Icon icon="lucide:truck" className="text-green-400" width={22} />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">Direct from Factory</h4>
              <p className="text-xs sm:text-sm text-neutral-400">No middlemen — better pricing and faster delivery guaranteed.</p>
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
        className="py-12 sm:py-24 bg-white"
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
