'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GradientButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className,
  size = 'md',
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={cn(
        'btn-gradient',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </motion.button>
  );
}
