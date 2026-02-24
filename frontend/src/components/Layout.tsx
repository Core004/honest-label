import { Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { usePrefetchData } from '../hooks/usePrefetchData';

export default function Layout() {
  // Prefetch all common data on first load so pages render instantly
  usePrefetchData();
  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-slate-900 selection:text-white text-slate-600">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button - Available on all pages */}
      <motion.a
        href="https://wa.me/919512370018?text=Hi%2C%20I%20am%20interested%20in%20your%20labeling%20solutions."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="fa6-brands:whatsapp" width={24} />
        <span className="font-medium text-sm hidden sm:inline">Chat with us</span>
      </motion.a>
    </div>
  );
}
