import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';

interface Testimonial {
  id: number;
  clientName: string;
  company: string;
  content: string;
  imageUrl?: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data.filter((t: Testimonial) => t.isActive)))
      .catch(err => console.error('Failed to fetch testimonials:', err));
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 bg-white border-y border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-lg font-medium tracking-tight text-neutral-900">
            <span className="text-neutral-500">Trusted feedback.</span>{" "}
            <span className="font-semibold">What our clients say</span>
          </h2>
        </motion.div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Rating Stars */}
          <div className="flex justify-center gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="lucide:star"
                className={i < currentTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'}
                width={14}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-sm sm:text-base text-neutral-600 mb-4 leading-relaxed max-w-2xl mx-auto">
            "{currentTestimonial.content}"
          </blockquote>

          {/* Client Info */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-medium text-neutral-900">{currentTestimonial.clientName}</p>
            <span className="text-neutral-300">•</span>
            <p className="text-sm text-neutral-500">{currentTestimonial.company}</p>
          </div>
        </motion.div>

        {/* Navigation Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-neutral-900 w-4'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
