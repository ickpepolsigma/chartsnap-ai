'use client';

import { motion } from 'framer-motion';

interface LoadingStateProps {
  lines?: number;
}

export function LoadingState({ lines = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="skeleton-glass h-4 w-full"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="skeleton-glass h-8 w-32" />
      <LoadingState lines={4} />
    </div>
  );
}
