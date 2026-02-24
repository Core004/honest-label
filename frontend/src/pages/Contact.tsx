import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';

const contactInfo = [
  {
    icon: 'lucide:map-pin',
    title: 'Visit Us',
    content: '170/171, HonestIT - Corporate House, Besides Sanskruti Building, Near Old High-Court, Ashram Rd, Ahmedabad, Gujarat 380009',
    isAddress: true,
  },
  {
    icon: 'lucide:phone',
    title: 'Call Us',
    content: '+91 95123 70018',
    href: 'tel:+919512370018',
  },
  {
    icon: 'lucide:mail',
    title: 'Email Us',
    content: 'hello@honestit.in',
    href: 'mailto:hello@honestit.in',
  },
  {
    icon: 'lucide:clock',
    title: 'Working Hours',
    content: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
];

const openMaps = () => {
  window.open('https://www.google.com/maps/search/?api=1&query=23.0368755,72.5679037', '_blank');
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Simple */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-neutral-500">
              Have questions about our labeling solutions? Need a custom quote? Our team will get back to you promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {contactInfo.map((info, index) => (
              <motion.button
                key={info.title}
                className="group p-3 sm:p-4 rounded-xl border text-left transition-all bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={info.isAddress ? openMaps : info.href ? () => window.location.href = info.href! : undefined}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 bg-neutral-100">
                  <Icon
                    icon={info.icon}
                    width={18}
                    className="text-neutral-600"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1 text-neutral-900">
                  {info.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 sm:line-clamp-none">
                  {info.content}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-12">
            {/* Left Side - Quick Connect */}
            <motion.div
              className="lg:col-span-2 mb-12 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Quick Connect Card */}
              <div className="rounded-xl border p-5 sm:p-8 bg-neutral-900 border-neutral-800 text-white mb-6 sm:mb-8">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-4 sm:mb-6 border-neutral-700 bg-neutral-800 text-neutral-300">
                  <Icon icon="lucide:zap" className="mr-2 text-indigo-400" width={14} />
                  Quick Connect
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Need immediate help?</h2>
                <p className="text-neutral-400 mb-6 sm:mb-8 text-sm leading-relaxed">
                  Reach out through any of these channels and we'll respond within minutes.
                </p>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/919512370018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 rounded-lg bg-green-600 hover:bg-green-500 transition-all mb-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon="fa6-brands:whatsapp" width={22} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Chat on WhatsApp</div>
                    <div className="text-xs text-white/70">Typically replies instantly</div>
                  </div>
                  <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform" width={18} />
                </a>

                {/* Call Button */}
                <a
                  href="tel:+919512370018"
                  className="flex items-center gap-3 w-full p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon="lucide:phone" width={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">+91 95123 70018</div>
                    <div className="text-xs text-neutral-400">Mon-Sat, 10:00 AM - 7:00 PM</div>
                  </div>
                </a>
              </div>

              {/* Social Links */}
              <div className="rounded-xl border p-6 bg-white border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { icon: 'lucide:instagram', href: '#', label: 'Instagram' },
                    { icon: 'lucide:linkedin', href: '#', label: 'LinkedIn' },
                    { icon: 'lucide:facebook', href: '#', label: 'Facebook' },
                    { icon: 'fa6-brands:whatsapp', href: 'https://wa.me/919512370018', label: 'WhatsApp' },
                  ].map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                      aria-label={social.label}
                    >
                      <Icon icon={social.icon} width={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">Location</h2>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Find Us</p>
            <p className="mt-2 text-neutral-500">Visit our office for a personalized consultation</p>
          </div>
        </div>
        <div
          className="h-[280px] sm:h-[350px] md:h-[400px] w-full relative cursor-pointer group"
          onDoubleClick={openMaps}
        >
          <iframe
            src="https://maps.google.com/maps?q=23.0368755,72.5679037&z=18&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Honest Label Solutions Private Limited - Ashram Road, Ahmedabad"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
            <Icon icon="lucide:external-link" width={14} />
            Double-click to open in Google Maps
          </div>
        </div>
      </section>
    </div>
  );
}
