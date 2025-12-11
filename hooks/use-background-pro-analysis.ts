// hooks/use-background-pro-analysis.ts
// 🚀 BACKGROUND PRO ANALYSIS - Starts analysis when dashboard loads!

import { useEffect, useState } from 'react';

interface BackgroundAnalysisState {
  isLoading: boolean;
  isComplete: boolean;
  progress: number; // 0-100
  error: string | null;
}

export function useBackgroundProAnalysis(
  shouldStart: boolean = true, // Dashboard mount olduğunda true
  delayMs: number = 2000 // 2 saniye bekle (Overview tab render olsun)
) {
  const [state, setState] = useState<BackgroundAnalysisState>({
    isLoading: false,
    isComplete: false,
    progress: 0,
    error: null,
  });

  useEffect(() => {
    if (!shouldStart) return;

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    // 🎯 Background loading başlat
    const startBackgroundAnalysis = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, progress: 0 }));
        console.log('🔄 [BACKGROUND] Starting PRO analysis in background...');

        // API call
        const response = await fetch('/api/pro/analyze-all');
        
        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        if (!isCancelled) {
          const data = await response.json();
          console.log('✅ [BACKGROUND] PRO analysis complete!');
          setState({
            isLoading: false,
            isComplete: true,
            progress: 100,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('❌ [BACKGROUND] PRO analysis failed:', error);
          setState({
            isLoading: false,
            isComplete: false,
            progress: 0,
            error: error instanceof Error ? error.message : 'Analysis failed',
          });
        }
      }
    };

    // 2 saniye bekle, sonra başla (user Overview tab'ı görüyor)
    timeoutId = setTimeout(() => {
      startBackgroundAnalysis();
    }, delayMs);

    // Cleanup
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [shouldStart, delayMs]);

  return state;
}