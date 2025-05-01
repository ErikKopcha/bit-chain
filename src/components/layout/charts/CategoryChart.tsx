'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import * as React from 'react';
import { RadarChartComponent } from './RadarChartComponent';

const COLOR = 'hsl(var(--chart-1))';

export function CategoryChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.categoriesData.map(entry => ({
      name: entry.category,
      value: entry.trades,
    })) || [];

  const mostTradedCategory = React.useMemo(() => {
    if (!stats?.categoriesData.length) return null;
    return stats.categoriesData.reduce((prev, current) =>
      prev.trades > current.trades ? prev : current,
    );
  }, [stats?.categoriesData]);

  return (
    <RadarChartComponent
      title="Trade Categories"
      description="Distribution of trades by category"
      data={data}
      color={COLOR}
      isLoading={isLoading}
      footer={
        <div className="text-sm text-muted-foreground">
          Most traded category: <span className="font-medium">{mostTradedCategory?.category}</span>
        </div>
      }
    />
  );
}
