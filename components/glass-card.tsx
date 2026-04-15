'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradientBorder?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, gradientBorder = false, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass',
        gradientBorder && 'glass-gradient-border',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
