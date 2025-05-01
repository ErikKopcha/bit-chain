'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { PieChartComponent } from './PieChartComponent';

const COLORS = {
  LONG: 'hsl(var(--chart-1))',
  SHORT: 'hsl(var(--chart-2))',
};

export function ShortLongChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.shortLongData.map(entry => ({
      name: entry.type,
      percentage: entry.percentage,
    })) || [];

  return (
    <PieChartComponent
      title="Short/Long Distribution"
      description="Distribution of short and long positions"
      data={data}
      colors={[COLORS.LONG, COLORS.SHORT]}
      isLoading={isLoading}
    />
  );
}
