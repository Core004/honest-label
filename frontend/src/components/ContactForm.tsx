import { useState } from 'react';
import { Icon } from '@iconify/react';
import { publicApi } from '../services/api';
import type { CreateInquiry } from '../types';

const labelTypes = ['Barcode', 'Thermal', 'Chromo', 'Transparent', 'Custom'];

export default function ContactForm() {
  const [formData, setFormData] = useState<CreateInquiry>({
    name: '',
    email: '',
    company: '',
    phone: '',
    labelType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone - exactly 10 digits
  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  // Handle phone input - only allow numbers
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = digitsOnly.slice(0, 10);
    setFormData({ ...formData, phone: limited });

    // Clear error when user starts typing
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  // Handle email change
  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submit
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
      await publicApi.submitInquiry(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        labelType: '',
        message: '',
      });
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border p-4 sm:p-6 md:p-8 bg-white border-neutral-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Request a Quote</h2>
        <p className="text-sm text-neutral-500 mt-1">Fill out the form and we'll get back to you within 24 hours</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:check" className="text-white" width={16} />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Thank you for reaching out!</h4>
            <p className="text-sm text-green-600 mt-1">We've received your inquiry and will get back to you within 24 hours.</p>
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
            <p className="text-sm text-red-600 mt-1">Please try again or contact us directly via phone or email.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            <p className={`mt-1 text-xs ${formData.phone.length === 10 ? 'text-green-500' : formData.phone.length > 0 ? 'text-neutral-400' : 'text-neutral-400'}`}>
              {formData.phone.length}/10 digits
              {formData.phone.length === 10 && <Icon icon="lucide:check" className="inline ml-1" width={12} />}
            </p>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" width={12} />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-neutral-700">Label Type Required</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {labelTypes.map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="labelType"
                  value={type}
                  checked={formData.labelType === type}
                  onChange={(e) => setFormData({ ...formData, labelType: e.target.value })}
                  className="peer sr-only"
                />
                <div className="rounded-lg border px-3 py-2.5 text-sm font-medium peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white hover:border-neutral-300 transition-all text-center border-neutral-200 text-neutral-600">
                  {type}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-neutral-700">
            Specific Requirements (Size, Qty)
          </label>
          <textarea
            id="message"
            rows={4}
            minLength={10}
            maxLength={500}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="block w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 border-neutral-200 bg-neutral-50 focus:bg-white resize-none"
            placeholder="e.g. 4x6 inch shipping labels, 100 rolls..."
          />
          <p className="mt-2 text-xs text-neutral-400">
            Min: 10 characters | Max: 500 characters ({formData.message.length}/500)
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
              Request Quote
              <Icon icon="lucide:arrow-right" width={16} />
            </>
          )}
        </button>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-neutral-100 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Icon icon="lucide:shield-check" className="text-green-500" width={14} />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Icon icon="lucide:clock" className="text-indigo-500" width={14} />
            <span>24hr Response</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Icon icon="lucide:mail-check" className="text-neutral-500" width={14} />
            <span>No Spam</span>
          </div>
        </div>
      </form>
    </div>
  );
}
