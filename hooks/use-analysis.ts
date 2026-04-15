'use client';

import { useState, useCallback } from 'react';
import { AnalysisResponse } from '@/types';
import { toast } from 'sonner';

interface UseAnalysisReturn {
  analyze: (file: File) => Promise<AnalysisResponse>;
  result: AnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (file: File): Promise<AnalysisResponse> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Analysis failed. Please try again.');
      }

      const data: AnalysisResponse = await res.json();
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, result, isAnalyzing, error, reset };
}
