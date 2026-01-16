import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { publicApi } from '../services/api';
import type { CreateQuoteRequest } from '../types';

const productTypes = [
  'Barcode Labels',
  'Thermal Labels',
  'Chromo Labels',
  'Transparent Labels',
  'Security Labels',
  'Custom Labels',
];

const materials = ['Paper', 'Polyester', 'Vinyl', 'BOPP', 'Chromo', 'Other'];

const printTypes = ['Thermal Transfer', 'Direct Thermal', 'Flexo', 'Digital', 'Offset'];

export default function GetQuote() {
  const [formData, setFormData] = useState<CreateQuoteRequest>({
    name: '',
    email: '',
    company: '',
    phone: '',
    productType: '',
    size: '',
    quantity: '',
    material: '',
    printType: '',
    additionalDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const limited = digitsOnly.slice(0, 10);
    setFormData({ ...formData, phone: limited });
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; phone?: string } = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await publicApi.submitQuoteRequest(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        productType: '',
        size: '',
        quantity: '',
        material: '',
        printType: '',
        additionalDetails: '',
      });
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Simple */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              Get a Quote
            </h1>
            <p className="text-base sm:text-lg text-neutral-500">
              Tell us about your labeling requirements and receive a customized quote within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border p-4 sm:p-6 md:p-8 bg-white border-neutral-200 shadow-sm"
          >
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900">Quote Request Form</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Fill in the details below and our team will prepare a customized quote for you
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:check" className="text-white" width={16} />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Quote Request Submitted!</h4>
                  <p className="text-sm text-green-600 mt-1">
                    We've received your request and will send you a customized quote within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:x" className="text-white" width={16} />
                </div>
                <div>
                  <h4 className="font-medium text-red-800">Something went wrong</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Please try again or contact us directly via phone or email.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="border-b border-neutral-100 pb-6">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-neutral-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-neutral-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50 focus:bg-white ${errors.email ? 'border-red-500' : 'border-neutral-200'}`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <Icon icon="lucide:alert-circle" width={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-neutral-700">
                      Phone Number (10 digits)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50 focus:bg-white ${errors.phone ? 'border-red-500' : 'border-neutral-200'}`}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                    />
                    <p className={`mt-1 text-xs ${formData.phone && formData.phone.length === 10 ? 'text-green-500' : formData.phone && formData.phone.length > 0 ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      {formData.phone?.length || 0}/10 digits
                      {formData.phone && formData.phone.length === 10 && <Icon icon="lucide:check" className="inline ml-1" width={12} />}
                    </p>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <Icon icon="lucide:alert-circle" width={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="border-b border-neutral-100 pb-6">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Product Requirements</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-neutral-700">Product Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {productTypes.map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input
                          type="radio"
                          name="productType"
                          value={type}
                          checked={formData.productType === type}
                          onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                          className="peer sr-only"
                          required
                        />
                        <div className="rounded-lg border px-3 py-2.5 text-sm font-medium peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white hover:border-neutral-300 transition-all text-center border-neutral-200 text-neutral-600">
                          {type}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium mb-2 text-neutral-700">
                      Label Size (e.g., 4x6 inch)
                    </label>
                    <input
                      type="text"
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white"
                      placeholder="4x6 inch, 2x1 inch, etc."
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium mb-2 text-neutral-700">
                      Quantity Required
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white"
                      placeholder="10,000 labels, 100 rolls, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Material & Print */}
              <div className="border-b border-neutral-100 pb-6">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Material & Print Preferences</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-neutral-700">Material Type</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {materials.map((mat) => (
                      <label key={mat} className="cursor-pointer">
                        <input
                          type="radio"
                          name="material"
                          value={mat}
                          checked={formData.material === mat}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="peer sr-only"
                        />
                        <div className="rounded-lg border px-3 py-2 text-xs font-medium peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white hover:border-neutral-300 transition-all text-center border-neutral-200 text-neutral-600">
                          {mat}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-neutral-700">Print Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {printTypes.map((print) => (
                      <label key={print} className="cursor-pointer">
                        <input
                          type="radio"
                          name="printType"
                          value={print}
                          checked={formData.printType === print}
                          onChange={(e) => setFormData({ ...formData, printType: e.target.value })}
                          className="peer sr-only"
                        />
                        <div className="rounded-lg border px-3 py-2 text-xs font-medium peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white hover:border-neutral-300 transition-all text-center border-neutral-200 text-neutral-600">
                          {print}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="additionalDetails" className="block text-sm font-medium mb-2 text-neutral-700">
                  Additional Details
                </label>
                <textarea
                  id="additionalDetails"
                  rows={4}
                  maxLength={1000}
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                  className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white resize-none"
                  placeholder="Any specific requirements, artwork details, delivery timeline, etc."
                />
                <p className="mt-2 text-xs text-neutral-400">
                  Max: 1000 characters ({formData.additionalDetails?.length || 0}/1000)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg text-sm font-medium transition-all shadow-lg text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-neutral-900/10"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Quote
                    <Icon icon="lucide:arrow-right" width={16} />
                  </>
                )}
              </button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Icon icon="lucide:shield-check" className="text-green-500" width={14} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Icon icon="lucide:clock" className="text-indigo-500" width={14} />
                  <span>24hr Quote</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Icon icon="lucide:badge-check" className="text-neutral-500" width={14} />
                  <span>No Obligation</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
