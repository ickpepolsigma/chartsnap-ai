'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { GradientButton } from '@/components/gradient-button';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsSending(true);

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('Verification code sent to your email');
      } else {
        const error = await res.json();
        setEmailError(error.error || 'Failed to send code');
        toast.error(error.error || 'Failed to send code');
      }
    } catch {
      setEmailError('Failed to send code');
      toast.error('Failed to send code');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Email verified successfully!');

        // Refresh user state
        await fetch('/api/auth/me');

        router.push('/analyze');
      } else {
        const error = await res.json();
        setCodeError(error.error || 'Invalid verification code');
        toast.error(error.error || 'Invalid verification code');
      }
    } catch {
      setCodeError('Verification failed');
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/60 text-sm">Enter your email and verification code</p>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass w-full"
                  placeholder="Enter your email"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <GradientButton
                type="submit"
                className="w-full"
                disabled={isSending || !email}
              >
                {isSending ? 'Sending...' : 'Send Verification Code'}
              </GradientButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/40">then</span>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input-glass w-full text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                {codeError && (
                  <p className="text-red-500 text-sm mt-1">{codeError}</p>
                )}
              </div>

              <GradientButton
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !code}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Verify Email
                  </span>
                )}
              </GradientButton>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4 inline mr-1 rotate-180" />
              Back to Login
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
