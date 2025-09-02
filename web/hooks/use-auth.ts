'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

// Hook to get current user session
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };
}

// Hook for saving prediction history (placeholder for future implementation)
export function usePredictionHistory() {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const savePrediction = async (prediction: any) => {
    if (!isAuthenticated) {
      // Could show a toast: "Sign in to save your predictions"
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to save prediction
      // const response = await fetch('/api/predictions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(prediction)
      // });
      
      // For now, just add to local state
      const newPrediction = {
        ...prediction,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: (user as any)?.id,
      };
      
      setHistory(prev => [newPrediction, ...prev]);
    } catch (error) {
      console.error('Failed to save prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      // TODO: Implement API call to load history
      // const response = await fetch('/api/predictions');
      // const data = await response.json();
      // setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

  return {
    history,
    savePrediction,
    loadHistory,
    isLoading,
  };
}

// Hook for pro features (placeholder for future implementation)
export function useProFeatures() {
  const { user, isAuthenticated } = useAuth();
  
  // TODO: Check user's subscription status
  const isPro = false; // Placeholder
  
  const features = {
    saveHistory: isAuthenticated,
    exportResults: isPro,
    advancedAnalytics: isPro,
    prioritySupport: isPro,
    unlimited: isPro,
  };

  return {
    isPro,
    features,
    canAccess: (feature: keyof typeof features) => features[feature],
  };
}
