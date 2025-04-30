import { useCallback, useMemo } from 'react';
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
  const { data: trades, refetch, isLoading } = usePositions();
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const { mutateAsync: deletePosition } = useDeletePosition();

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
    refetch,
  };
};
