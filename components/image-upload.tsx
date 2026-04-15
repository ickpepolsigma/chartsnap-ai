'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  preview: string | null;
  onClear: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg'];

export function ImageUpload({ onUpload, preview, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload PNG or JPEG only');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 5MB');
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onUpload(file);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-2xl overflow-hidden relative group"
          >
            <img
              src={preview}
              alt="Chart preview"
              className="w-full h-auto max-h-[400px] object-contain"
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={onClear}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'block w-full cursor-pointer transition-all duration-300',
                'glass rounded-2xl border-2 border-dashed p-12',
                'hover:border-emerald-500/50 hover:bg-white/5',
                isDragging && 'border-emerald-500/50 bg-emerald-500/5 scale-[1.02]'
              )}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={isDragging ? { y: [0, -5, 0] } : {}}
                  transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors',
                    isDragging
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-white/40'
                  )}
                >
                  {isDragging ? (
                    <ImageIcon className="w-8 h-8" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </motion.div>
                <p className="text-white font-medium mb-1">
                  {isDragging ? 'Drop your chart here' : 'Drag & drop your chart'}
                </p>
                <p className="text-white/40 text-sm">
                  or click to browse (PNG, JPEG, max 5MB)
                </p>
              </div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-sm text-rose-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
