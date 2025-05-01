import { usePositions } from '@/features/positions/queries/positions';
import {
  Trade as PositionTrade,
  TRADE_RESULTS,
  TRADE_SIDES,
} from '@/features/positions/types/position';
import { format } from 'date-fns';

interface Trade {
  id: string;
  date: string;
  pnl: number;
  category: string;
  side: TRADE_SIDES;
  result: TRADE_RESULTS;
  symbol: string;
}

interface TradingStats {
  pnlData: Array<{ date: string; pnl: number }>;
  categoriesData: Array<{ category: string; trades: number }>;
  winLossData: Array<{ type: string; percentage: number }>;
  shortLongData: Array<{ type: string; percentage: number }>;
  currencyData: Array<{ pair: string; percentage: number }>;
}

function mapPositionToTrade(position: PositionTrade): Trade {
  return {
    id: position.id,
    date: position.date.toISOString(),
    pnl: position.pnl,
    category: position.category,
    side: position.side,
    result: position.result,
    symbol: position.symbol,
  };
}

function calculateStats(positions: PositionTrade[]): TradingStats {
  const trades = positions.map(mapPositionToTrade);

  if (trades.length === 0) {
    return {
      pnlData: [],
      categoriesData: [],
      winLossData: [],
      shortLongData: [],
      currencyData: [],
    };
  }

  // Calculate PnL data
  const pnlData = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, trade) => {
        const lastPnl = acc.length > 0 ? (acc[acc.length - 1]?.pnl ?? 0) : 0;
        acc.push({
          date: format(new Date(trade.date), 'yyyy-MM-dd'),
          pnl: lastPnl + trade.pnl,
        });
        return acc;
      },
      [] as Array<{ date: string; pnl: number }>,
    );

  // Calculate categories data
  const categoriesMap = trades.reduce((acc, trade) => {
    acc.set(trade.category, (acc.get(trade.category) || 0) + 1);
    return acc;
  }, new Map<string, number>());
  const categoriesData = Array.from(categoriesMap.entries()).map(([category, trades]) => ({
    category,
    trades,
  }));

  // Calculate win/loss data
  const totalTrades = trades.length;
  const winningTrades = trades.filter(trade => trade.result === TRADE_RESULTS.WIN).length;
  const losingTrades = trades.filter(trade => trade.result === TRADE_RESULTS.LOSS).length;

  const winLossData = [
    { type: 'Winning', percentage: Math.round((winningTrades / totalTrades) * 100) },
    { type: 'Losing', percentage: Math.round((losingTrades / totalTrades) * 100) },
  ];

  // Calculate short/long data
  const longTrades = trades.filter(trade => trade.side === TRADE_SIDES.LONG).length;
  const shortTrades = trades.filter(trade => trade.side === TRADE_SIDES.SHORT).length;
  const shortLongData = [
    { type: 'Long', percentage: Math.round((longTrades / totalTrades) * 100) },
    { type: 'Short', percentage: Math.round((shortTrades / totalTrades) * 100) },
  ];

  // Calculate currency distribution
  const currencyMap = trades.reduce((acc, trade) => {
    acc.set(trade.symbol, (acc.get(trade.symbol) || 0) + 1);
    return acc;
  }, new Map<string, number>());
  const currencyData = Array.from(currencyMap.entries())
    .map(([pair, count]) => ({
      pair,
      percentage: Math.round((count / totalTrades) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return {
    pnlData,
    categoriesData,
    winLossData,
    shortLongData,
    currencyData,
  };
}

export function useTradingStats() {
  const { data: positions, isLoading, error } = usePositions();

  const stats = positions ? calculateStats(positions) : null;

  return {
    stats,
    isLoading,
    error,
  };
}
