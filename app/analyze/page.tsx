'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAnalysis } from '@/hooks/use-analysis';
import { ImageUpload } from '@/components/image-upload';
import { AnalysisResult } from '@/components/analysis-result';
import { GradientButton } from '@/components/gradient-button';
import { GlassCard } from '@/components/glass-card';

export default function AnalyzePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { analyze, result, isAnalyzing, reset } = useAnalysis();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    // Refresh user state when page loads to check verification status
    if (user && !user.emailVerified) {
      setIsCheckingVerification(true);
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.user && data.user.emailVerified) {
            // User is now verified, page will re-render
          }
        })
        .finally(() => {
          setIsCheckingVerification(false);
        });
    }
  }, [user]);

  const handleUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreview(objectUrl);
    reset();
  }, [reset]);

  const handleClear = useCallback(() => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    reset();
  }, [preview, reset]);

  const handleAnalyze = async () => {
    if (!file) return;
    await analyze(file);
  };

  if (isAuthLoading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-white/20 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  if (!user.emailVerified) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-white/60 mb-6">
            Please verify your email address to start analyzing charts
          </p>
          <GradientButton onClick={() => router.push('/verify')} className="w-full">
            Go to Verification
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Analyze Your Chart
          </h1>
          <p className="text-white/60 text-lg">
            Upload a candlestick chart screenshot and get AI-powered insights
          </p>
        </motion.div>

        <div className="space-y-6">
          <GlassCard className="p-6 md:p-8">
            <ImageUpload onUpload={handleUpload} preview={preview} onClear={handleClear} />
          </GlassCard>

          <AnimatePresence>
            {file && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <GradientButton
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Analyze This Chart
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </GradientButton>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(isAnalyzing || result) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <AnalysisResult
                  decision={result?.decision || 'Buy'}
                  reason={result?.reason || ''}
                  isLoading={isAnalyzing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center gap-4"
              >
                <button
                  onClick={handleClear}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                >
                  Analyze Another Chart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
