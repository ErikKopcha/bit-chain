import { sampleTrades } from '@/app/(protected)/journal/data/sampleTrades';
import { usePagination } from '@/app/(protected)/journal/hooks/usePagination';
import {
  Trade,
  TRADE_CATEGORIES,
  TRADE_RESULTS,
  TRADE_SIDES,
} from '@/app/(protected)/journal/types';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { calculatePnl, calculateRiskPercent } from '../utils/calculations';

export const usePositions = () => {
  const searchParams = useSearchParams();
  const [trades, setTrades] = useState<Trade[]>(sampleTrades);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Trade | null>(null);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(trades, searchParams);

  // Date range filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Dropdown filters
  const [sideFilter, setSideFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [resultFilter, setResultFilter] = useState<string | undefined>(undefined);

  const handleSideFilterChange = (value: string) => {
    setSideFilter(value === 'all' ? undefined : value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === 'all' ? undefined : value);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value === 'all' ? undefined : value);
  };

  const handlePageSizeChangeString = (value: string) => {
    handlePageSizeChange(value);
  };

  const handleCreatePosition = (position: Partial<Trade>) => {
    const newPosition: Trade = {
      date: position.date ?? new Date(),
      symbol: position.symbol ?? '',
      side: position.side ?? TRADE_SIDES.LONG,
      entryPrice: position.entryPrice ?? 0,
      positionSize: position.positionSize ?? 0,
      stopLoss: position.stopLoss ?? 0,
      exitPrice: position.exitPrice ?? 0,
      commission: position.commission ?? 0,
      category: position.category ?? TRADE_CATEGORIES.SOLO,
      id: Math.random().toString(36).substr(2, 9),
      pnl: 0,
      result: TRADE_RESULTS.PENDING,
      riskPercent: 0,
      totalDeposit: position.totalDeposit ?? 500,
    };
    setTrades([...trades, newPosition]);
  };

  const handleEditPosition = (position: Partial<Trade>) => {
    const currentTrade = trades.find(t => t.id === positionToDelete?.id);
    if (!currentTrade) return;
    setTrades(
      trades.map(t =>
        t.id === currentTrade.id
          ? {
              ...currentTrade,
              ...position,
              date: position.date ?? currentTrade.date,
              symbol: position.symbol ?? currentTrade.symbol,
              side: position.side ?? currentTrade.side,
              entryPrice: position.entryPrice ?? currentTrade.entryPrice,
              positionSize: position.positionSize ?? currentTrade.positionSize,
              stopLoss: position.stopLoss ?? currentTrade.stopLoss,
              exitPrice: position.exitPrice ?? currentTrade.exitPrice,
              commission: position.commission ?? currentTrade.commission,
              category: position.category ?? currentTrade.category,
              leverage: position.leverage ?? currentTrade.leverage,
              investment: position.investment ?? currentTrade.investment,
              totalDeposit: position.totalDeposit ?? currentTrade.totalDeposit,
              pnl: calculatePnl(
                position.side ?? currentTrade.side,
                position.entryPrice ?? currentTrade.entryPrice,
                position.exitPrice ?? currentTrade.exitPrice,
                position.positionSize ?? currentTrade.positionSize,
                position.commission ?? currentTrade.commission,
              ),
              result:
                calculatePnl(
                  position.side ?? currentTrade.side,
                  position.entryPrice ?? currentTrade.entryPrice,
                  position.exitPrice ?? currentTrade.exitPrice,
                  position.positionSize ?? currentTrade.positionSize,
                  position.commission ?? currentTrade.commission,
                ) > 0
                  ? TRADE_RESULTS.WIN
                  : position.exitPrice
                    ? TRADE_RESULTS.LOSS
                    : TRADE_RESULTS.PENDING,
              riskPercent: calculateRiskPercent(
                position.side ?? currentTrade.side,
                position.entryPrice ?? currentTrade.entryPrice,
                position.stopLoss ?? currentTrade.stopLoss,
                position.positionSize ?? currentTrade.positionSize,
                position.totalDeposit ?? currentTrade.totalDeposit,
              ),
            }
          : t,
      ),
    );
  };

  const handleDeletePosition = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const onDelete = useCallback(
    (trade: Trade) => () => {
      setPositionToDelete(trade);
      setDeleteDialogOpen(true);
    },
    [],
  );

  return {
    trades,
    paginatedTrades,
    currentPage,
    totalPages,
    pageSize,
    dateRange,
    sideFilter,
    categoryFilter,
    resultFilter,
    deleteDialogOpen,
    positionToDelete,
    handlePageChange,
    handlePageSizeChangeString,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
    setDateRange,
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    onDelete,
    setDeleteDialogOpen,
    setPositionToDelete,
  };
};
