import { Trade } from '@/app/(protected)/journal/types';
import { formatCurrency } from '@/app/(protected)/journal/utils/formatters';

interface PositionStatsProps {
  trades: Trade[];
}

export function PositionStats({ trades }: PositionStatsProps) {
  const stats = {
    totalTrades: trades.length,
    winTrades: trades.filter(t => t.result === 'win').length,
    lossTrades: trades.filter(t => t.result === 'loss').length,
    totalPnl: trades.reduce((sum, t) => sum + t.pnl, 0),
    winRate:
      trades.length > 0
        ? ((trades.filter(t => t.result === 'win').length / trades.length) * 100).toFixed(2)
        : '0.00',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
        <p className="text-2xl font-bold">{stats.totalTrades}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Win Trades</p>
        <p className="text-2xl font-bold text-green-600">{stats.winTrades}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Loss Trades</p>
        <p className="text-2xl font-bold text-red-600">{stats.lossTrades}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
        <p className="text-2xl font-bold">{stats.winRate}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Total P/L</p>
        <p
          className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {formatCurrency(stats.totalPnl)}
        </p>
      </div>
    </div>
  );
}
