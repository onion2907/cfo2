import { useState, useEffect, useCallback, useRef } from 'react';
import { getGoldInrPerGram, getSilverInrPerGram, getUsdInrRate } from '../services/metalPriceApi';

interface BackgroundPrices {
  goldInrPerGram: number | null;
  silverInrPerGram: number | null;
  usdInrRate: number | null;
  lastUpdated: Date | null;
  isRefreshing: boolean;
}

const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export const useBackgroundRefresh = () => {
  const [prices, setPrices] = useState<BackgroundPrices>({
    goldInrPerGram: null,
    silverInrPerGram: null,
    usdInrRate: null,
    lastUpdated: null,
    isRefreshing: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Function to refresh prices
  const refreshPrices = useCallback(async () => {
    // Prevent multiple simultaneous refreshes
    setPrices(prev => {
      if (prev.isRefreshing) {
        return prev;
      }
      return { ...prev, isRefreshing: true };
    });

    try {
      console.log('[Background Refresh] Fetching gold/silver prices and USD-INR rate...');
      
      const [goldInrPerGram, silverInrPerGram, usdInrRate] = await Promise.all([
        getGoldInrPerGram().catch(err => {
          console.warn('[Background Refresh] Failed to fetch gold price:', err);
          return null;
        }),
        getSilverInrPerGram().catch(err => {
          console.warn('[Background Refresh] Failed to fetch silver price:', err);
          return null;
        }),
        getUsdInrRate().catch(err => {
          console.warn('[Background Refresh] Failed to fetch USD-INR rate:', err);
          return null;
        })
      ]);

      const now = new Date();
      setPrices({
        goldInrPerGram,
        silverInrPerGram,
        usdInrRate,
        lastUpdated: now,
        isRefreshing: false
      });

      // Store in localStorage for persistence across page reloads
      localStorage.setItem('backgroundPrices', JSON.stringify({
        goldInrPerGram,
        silverInrPerGram,
        usdInrRate,
        lastUpdated: now.toISOString()
      }));

      console.log('[Background Refresh] Prices updated:', {
        gold: goldInrPerGram,
        silver: silverInrPerGram,
        usdInr: usdInrRate,
        timestamp: now.toISOString()
      });
    } catch (error) {
      console.error('[Background Refresh] Error refreshing prices:', error);
      setPrices(prev => ({ ...prev, isRefreshing: false }));
    }
  }, []);

  // Load cached prices from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) {
      return;
    }
    isInitialMount.current = false;

    const loadCachedPrices = async () => {
      try {
        const cached = localStorage.getItem('backgroundPrices');
        if (cached) {
          const parsed = JSON.parse(cached);
          const lastUpdated = new Date(parsed.lastUpdated);
          const now = new Date();
          const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

          setPrices({
            goldInrPerGram: parsed.goldInrPerGram,
            silverInrPerGram: parsed.silverInrPerGram,
            usdInrRate: parsed.usdInrRate,
            lastUpdated,
            isRefreshing: false
          });

          // If cached data is older than 12 hours, refresh immediately
          if (hoursSinceUpdate >= 12) {
            console.log('[Background Refresh] Cached data is stale, refreshing...');
            await refreshPrices();
          } else {
            // Schedule refresh for when 12 hours have passed
            const msUntilRefresh = REFRESH_INTERVAL_MS - (now.getTime() - lastUpdated.getTime());
            console.log(`[Background Refresh] Scheduled refresh in ${Math.round(msUntilRefresh / 1000 / 60)} minutes`);
            setTimeout(() => {
              refreshPrices();
            }, Math.max(0, msUntilRefresh));
          }
        } else {
          // No cached data, fetch immediately
          console.log('[Background Refresh] No cached data, fetching prices...');
          await refreshPrices();
        }
      } catch (error) {
        console.error('[Background Refresh] Error loading cached prices:', error);
        // If cache is corrupted, fetch fresh data
        await refreshPrices();
      }
    };

    loadCachedPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Set up interval for periodic refresh (every 12 hours)
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      console.log('[Background Refresh] Scheduled refresh triggered');
      refreshPrices();
    }, REFRESH_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshPrices]);

  // Also refresh when tab becomes visible (if data is stale)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && prices.lastUpdated) {
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - prices.lastUpdated.getTime()) / (1000 * 60 * 60);
        
        // If data is older than 12 hours, refresh when tab becomes visible
        if (hoursSinceUpdate >= 12) {
          console.log('[Background Refresh] Tab visible and data is stale, refreshing...');
          refreshPrices();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prices.lastUpdated, refreshPrices]);

  return {
    goldInrPerGram: prices.goldInrPerGram,
    silverInrPerGram: prices.silverInrPerGram,
    usdInrRate: prices.usdInrRate,
    lastUpdated: prices.lastUpdated,
    isRefreshing: prices.isRefreshing,
    refreshPrices // Expose for manual refresh if needed
  };
};

