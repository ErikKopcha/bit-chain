'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DatePicker } from '@/components/ui/date-picker';
import { useIsMobile } from '@/hooks/useMobile';
import { useTradingStats } from '@/hooks/useTradingStats';
import { useTheme } from '@/providers/ThemeProvider';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ChartSkeleton } from './ChartSkeleton';

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const { stats, isLoading } = useTradingStats();
  const { theme } = useTheme();

  const chartConfig = {
    pnl: {
      label: 'PnL',
      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  React.useEffect(() => {
    if (isMobile) {
      setDateRange({
        from: subDays(new Date(), 7),
        to: new Date(),
      });
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    if (!stats?.pnlData || stats.pnlData.length === 0) return [];

    let dataToUse = [...stats.pnlData];

    // Apply date filtering if a range is selected
    if (dateRange?.from) {
      const startDate = startOfDay(dateRange.from);
      const endDate = dateRange.to ? endOfDay(dateRange.to) : new Date();

      dataToUse = dataToUse.filter(item => {
        const date = new Date(item.date);
        return date >= startDate && date <= endDate;
      });
    }

    // If we have data, ensure the first entry starts with PnL at 0
    if (dataToUse.length > 0) {
      // Sort data by date (just to be safe)
      dataToUse.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Create a new array with a zero point before the first item
      const firstDate = new Date(dataToUse[0]?.date || new Date());
      const zeroPnlDate = new Date(firstDate);
      zeroPnlDate.setDate(firstDate.getDate() - 1);

      return [
        {
          date: zeroPnlDate.toISOString(),
          pnl: 0,
        },
        ...dataToUse,
      ];
    }

    return dataToUse;
  }, [stats?.pnlData, dateRange]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="@container/card">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Cumulative PnL</CardTitle>
          <CardDescription>
            <span className="@[540px]/card:block hidden">Total profit/loss over time</span>
            <span className="@[540px]/card:hidden">PnL over time</span>
          </CardDescription>
        </div>
        <div>
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            mode="range"
            showPresets
            placeholder="All time"
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pnl)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-pnl)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              domain={[0, 'auto']}
              tickLine={false}
              axisLine={false}
              tick={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}
              tickMargin={8}
              allowDataOverflow
              hide={isMobile}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pnl"
              type="natural"
              fill="url(#fillPnl)"
              stroke="var(--color-pnl)"
              strokeWidth={theme === 'dark' ? 2.5 : 1.5}
              baseValue={0}
              connectNulls
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
