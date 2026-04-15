'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard } from './glass-card';
import { GradientButton } from './gradient-button';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggle: () => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function AuthForm({ mode, onToggle, onSubmit, isLoading, error }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <GlassCard gradientBorder className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-white/60">
          {mode === 'login'
            ? 'Sign in to analyze your charts'
            : 'Start analyzing charts in seconds'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="input-glass pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>
          )}
        </div>

        <GradientButton
          type="submit"
          disabled={isLoading}
          className="w-full mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : mode === 'login' ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </GradientButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={onToggle}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
