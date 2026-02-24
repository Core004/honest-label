import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const features = [
  {
    icon: 'lucide:factory',
    title: 'In-House Manufacturing',
    description:
      'We own and operate our production facility, giving us complete control over quality and timelines.',
  },
  {
    icon: 'lucide:zap',
    title: 'Fast Turnaround',
    description:
      '24-hour dispatch for standard orders. We understand that your business cannot wait.',
  },
  {
    icon: 'lucide:shield-check',
    title: 'Quality Assured',
    description:
      '100% quality inspection on every batch. We never compromise on the quality of our products.',
  },
  {
    icon: 'lucide:sparkles',
    title: 'Cosmetic & Beauty Labels',
    description:
      'Premium waterproof and oil-resistant labels designed for cosmetic, skincare, and beauty products.',
  },
];

const team = [
  {
    name: 'Hardik',
    role: 'CEO',
    description: 'Overseeing operations and ensuring excellence in manufacturing.',
  },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section - Simple */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              About Honest Label
            </h1>
            <p className="text-lg text-neutral-500">
              Dedicated Label Manufacturing Company delivering high-quality, precision-crafted
              labeling solutions. Custom labels, bulk production, and specialized printing solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 bg-white border-y border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <motion.h2
                className="text-base font-semibold tracking-wide uppercase text-indigo-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Story
              </motion.h2>
              <motion.h3
                className="mt-2 text-xl font-semibold tracking-tight text-neutral-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Labeling Solutions That Work
              </motion.h3>
              <motion.div
                className="mt-4 space-y-3 text-sm text-neutral-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p>
                  Founded in 2022, we are a dedicated Label Manufacturing Company committed to
                  delivering high-quality, precision-crafted labeling solutions for diverse industries.
                  From product identification to branding and compliance, our labels are designed to
                  meet the highest standards of durability, accuracy, and visual appeal.
                </p>
                <p>
                  With a strong vision and strategic leadership, we have steadily grown into a
                  trusted partner for businesses seeking
                  reliability, innovation, and timely delivery. Our state-of-the-art manufacturing
                  capabilities and customer-centric approach enable us to produce labels tailored to
                  unique requirements across sectors such as retail, automotive, healthcare, logistics,
                  and manufacturing.
                </p>
                <p>
                  At the core of our operations is a commitment to quality, transparency, and continuous
                  improvement. We strive to build long-term relationships with our clients by offering
                  consistent support, competitive pricing, and technology-driven solutions.
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              className="mt-12 lg:mt-0"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
            >
              <div className="rounded-2xl overflow-hidden bg-neutral-100 p-6">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {[
                    { value: "500+", label: "Happy Clients" },
                    { value: "10M+", label: "Labels Delivered" },
                    { value: "4+", label: "Years Experience" },
                    { value: "50+", label: "Industries Served" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl p-6 text-center shadow-sm"
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{stat.value}</div>
                      <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">
              Why Choose Us
            </h2>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              The Honest Label Advantage
            </h3>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-neutral-200"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Icon icon={feature.icon} className="text-indigo-600" width={24} />
                </motion.div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-neutral-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">
              Leadership
            </h2>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Meet Our Team
            </h3>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 max-w-sm mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-neutral-50 rounded-2xl p-8 text-center border border-neutral-100"
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -15px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-neutral-200 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgb(199, 210, 254)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <Icon icon="lucide:user" className="text-neutral-400" width={40} />
                </motion.div>
                <h4 className="text-xl font-semibold text-neutral-900">{member.name}</h4>
                <p className="text-indigo-600 font-medium">{member.role}</p>
                <p className="text-sm text-neutral-500 mt-2">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-semibold tracking-tight text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Let's work together
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Contact us today to discuss your labeling requirements.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              damping: 15,
              stiffness: 100,
            }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-medium text-sm transition-all bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            >
              Get in Touch
              <Icon icon="lucide:arrow-right" className="ml-2" width={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
