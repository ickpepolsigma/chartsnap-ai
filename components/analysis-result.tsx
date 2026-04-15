'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalysisResponse } from '@/types';
import { GlassCard } from './glass-card';
import { LoadingState } from './loading-state';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  decision: AnalysisResponse['decision'];
  reason: string;
  isLoading: boolean;
}

const decisionConfig = {
  Buy: {
    icon: TrendingUp,
    className: 'decision-buy',
    label: 'BUY',
  },
  Sell: {
    icon: TrendingDown,
    className: 'decision-sell',
    label: 'SELL',
  },
  Nothing: {
    icon: Minus,
    className: 'decision-nothing',
    label: 'HOLD / NOTHING',
  },
};

export function AnalysisResult({ decision, reason, isLoading }: AnalysisResultProps) {
  const config = decisionConfig[decision];
  const Icon = config.icon;

  return (
    <GlassCard gradientBorder className="p-6 md:p-8">
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="skeleton-glass h-12 w-32" />
          </div>
          <LoadingState lines={5} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={cn('flex items-center gap-2', config.className)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-lg tracking-wider">{config.label}</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">
              Analysis
            </h3>
            <p className="text-white/90 leading-relaxed text-lg">
              {reason}
            </p>
          </motion.div>
        </motion.div>
      )}
    </GlassCard>
  );
}
