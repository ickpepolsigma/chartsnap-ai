'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, ChevronDown, Mail, MessageSquare, Clock } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { GradientButton } from '@/components/gradient-button';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const faqs = [
  {
    question: 'How accurate is the AI analysis?',
    answer: 'ChartSnap AI uses open source AI via Hugging Face to analyze chart patterns. While it provides insights based on visible technical patterns, it should be used as one tool among many in your trading research. Always do your own due diligence before making trading decisions.',
  },
  {
    question: 'What chart formats are supported?',
    answer: 'We support PNG and JPEG image formats up to 5MB in size. The AI works best with clear candlestick charts that show price action, volume, and key technical indicators.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Your uploaded images are stored temporarily for analysis and are not shared with third parties. We use industry-standard security practices and your account information is encrypted.',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have questions or feedback? We\'d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard gradientBorder className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                Send a Message
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input-glass"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-rose-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-glass"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="input-glass resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-rose-400">{errors.message.message}</p>
                  )}
                </div>

                <GradientButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </GradientButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contact Info</h2>
                <p className="text-white/60 text-sm">We typically respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Response Time</p>
                <p className="text-white/60 text-sm">Usually within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-white/60 text-sm">support@chartsnap.ai</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <GlassCard
                    key={index}
                    className="overflow-hidden"
                    hover={false}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="px-4 pb-4 text-white/70 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
