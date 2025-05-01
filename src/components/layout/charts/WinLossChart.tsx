'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { PieChartComponent } from './PieChartComponent';

const COLORS = {
  WINNING: 'hsl(var(--chart-1))',
  LOSING: 'hsl(var(--chart-2))',
};

export function WinLossChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.winLossData.map(entry => ({
      name: entry.type,
      percentage: entry.percentage,
    })) || [];

  return (
    <PieChartComponent
      title="Win/Loss Ratio"
      description="Distribution of winning and losing trades"
      data={data}
      colors={[COLORS.WINNING, COLORS.LOSING]}
      isLoading={isLoading}
    />
  );
}
