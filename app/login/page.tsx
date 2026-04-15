'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/analyze');
    }
  }, [user, router]);

  const handleToggle = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        toast.success('Welcome back!');
        router.push('/analyze');
      } else {
        await register(data.email, data.password);
        toast.success('Account created! Please check your email for verification code.');
        router.push('/verify');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
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
        <AuthForm
          mode={mode}
          onToggle={handleToggle}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </motion.div>
    </div>
  );
}
