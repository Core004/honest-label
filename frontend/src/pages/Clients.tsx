import { LogoCloud } from '@/components/logo-cloud';
import { CountUp } from '@/components/CountUp';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
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

const fadeInUpVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Clients() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 sm:pt-28 sm:pb-10 overflow-hidden bg-gradient-to-b from-red-50/30 via-white to-neutral-50">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-neutral-100 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={heroVariants}
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-6 shadow-sm border-neutral-200 bg-white text-neutral-600">
              <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              Trusted Partners
            </div>
            <motion.h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 max-w-4xl mx-auto leading-[1.1] text-neutral-900"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Our Clients <span className="text-neutral-400">& Success Stories</span>
            </motion.h1>
            <motion.p
              className="text-base text-neutral-500 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              We're proud to partner with leading companies across industries, delivering
              premium labeling solutions that meet their unique requirements.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Logo Grid Section */}
      <section className="py-10 md:py-12 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LogoCloud />

          <motion.div
            className="max-w-3xl mx-auto text-center mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">
              <span className="text-neutral-500">Trusted by experts.</span>{" "}
              <span className="text-neutral-900">Used by the leaders.</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {[
              { end: 500, suffix: "+", label: "Happy Clients" },
              { end: 10, suffix: "M+", label: "Labels Delivered" },
              { end: 15, suffix: "+", label: "Years Experience" },
              { end: 50, suffix: "+", label: "Industries Served" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 30, scale: 0.9 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 100,
                    },
                  },
                }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-1 sm:mb-2">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <motion.div
                  className="text-sm sm:text-base text-neutral-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-neutral-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Ready to join our growing list of clients?
          </motion.h2>
          <motion.p
            className="text-neutral-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            Let's discuss how we can help you with your labeling needs.
          </motion.p>
          <motion.a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-neutral-900 bg-white hover:bg-neutral-100 transition-colors"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              type: "spring",
              damping: 15,
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Get a Quote
          </motion.a>
        </div>
      </section>
    </motion.div>
  );
}
