'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { GradientButton } from '@/components/gradient-button';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast.success('Admin login successful');
        router.push('/admin');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
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
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-white/60 text-sm">Enter your admin credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-glass w-full"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass w-full"
                placeholder="Enter password"
                required
              />
            </div>

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Login to Admin
                </span>
              )}
            </GradientButton>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
