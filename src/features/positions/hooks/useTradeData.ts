import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useUpdatePosition,
} from '../queries/positions';
import { Trade } from '../types/position';

interface TradeFilters {
  dateRange?: DateRange;
  sideFilter?: string;
  categoryFilter?: string;
  resultFilter?: string;
}

export const useTradeData = (filters: TradeFilters = {}) => {
  const {
    data: trades,
    refetch: reactQueryRefetch,
    isLoading,
    isFetching: reactQueryFetching,
  } = usePositions();
  const [isManualRefetching, setIsManualRefetching] = useState(false);
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const { mutateAsync: deletePosition } = useDeletePosition();

  // Combine React Query's isFetching with our manual refetching state
  const isFetching = reactQueryFetching || isManualRefetching;

  // Also trigger the loading state whenever React Query is refetching
  useEffect(() => {
    if (reactQueryFetching) {
      setIsManualRefetching(true);
    }
  }, [reactQueryFetching]);

  const filteredTrades = useMemo(() => {
    if (!trades) return [];

    return trades.filter(trade => {
      // Date range filter
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const tradeDate = new Date(trade.date);
        if (tradeDate < filters.dateRange.from || tradeDate > filters.dateRange.to) {
          return false;
        }
      }

      // Side filter
      if (filters.sideFilter && trade.side !== filters.sideFilter) {
        return false;
      }

      // Category filter
      if (filters.categoryFilter && trade.category !== filters.categoryFilter) {
        return false;
      }

      // Result filter
      if (filters.resultFilter && trade.result !== filters.resultFilter) {
        return false;
      }

      return true;
    });
  }, [trades, filters]);

  // Custom refetch function that ensures loading state is visible
  const refetch = useCallback(async () => {
    try {
      console.log('Manual refetch started');
      setIsManualRefetching(true);

      // Force a minimum loading time for better UX
      const startTime = Date.now();
      const result = await Promise.all([
        reactQueryRefetch(),
        // Add a forced delay to ensure the loading indicator is visible
        new Promise(resolve => setTimeout(resolve, 1200)),
      ]);

      return result[0];
    } finally {
      console.log('Manual refetch completed');
      // Use a delay to ensure animation is visible
      setTimeout(() => {
        setIsManualRefetching(false);
      }, 500);
    }
  }, [reactQueryRefetch]);

  const handleCreatePosition = useCallback(
    async (position: Omit<Trade, 'id' | 'pnl' | 'result' | 'riskPercent'>) => {
      const newTrade = await createPosition(position as Trade);
      await refetch();
      return newTrade;
    },
    [createPosition, refetch],
  );

  const handleEditPosition = useCallback(
    async (position: Partial<Trade>) => {
      const updatedTrade = await updatePosition(position as Trade);
      await refetch();
      return updatedTrade;
    },
    [updatePosition, refetch],
  );

  const handleDeletePosition = useCallback(
    async (id: string) => {
      await deletePosition({ id } as Trade);
      await refetch();
    },
    [deletePosition, refetch],
  );

  return {
    trades: trades || [],
    filteredTrades: filteredTrades,
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    isLoading,
    isFetching,
    refetch,
  };
};
