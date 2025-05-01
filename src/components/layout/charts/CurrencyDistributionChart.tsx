'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { RadarChartComponent } from './RadarChartComponent';

const COLOR = 'hsl(var(--chart-1))';

export function CurrencyDistributionChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.currencyData.map(entry => ({
      name: entry.pair,
      value: entry.percentage,
    })) || [];

  return (
    <RadarChartComponent
      title="Currency Distribution"
      description="Distribution of trades by currency"
      data={data}
      color={COLOR}
      isLoading={isLoading}
    />
  );
}
