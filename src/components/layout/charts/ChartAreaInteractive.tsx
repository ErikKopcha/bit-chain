'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { formatCurrency } from '@/app/(protected)/journal/utils/formatters';
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
import { THEME, useStore } from '@/store';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { ChartSkeleton } from './ChartSkeleton';

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { selectedDateRange: dateRange, setSelectedDateRange: setDateRange, theme } = useStore();
  const { stats, isLoading } = useTradingStats();

  const chartConfig = {
    pnl: {
      label: 'PnL',
      color: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (isMobile) {
      setDateRange({
        from: subDays(new Date(), 7),
        to: new Date(),
      });
    }
  }, [isMobile]);

  const filteredData = useMemo(() => {
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

  // Calculate min and max PnL values for domain calculation
  const pnlValues = useMemo(() => {
    if (!filteredData.length) return { min: 0, max: 0 };
    const values = filteredData.map(item => item.pnl);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [filteredData]);

  // Calculate appropriate tick values with even intervals
  const yAxisTicks = useMemo(() => {
    const min = pnlValues.min < 0 ? Math.floor(pnlValues.min) : 0;
    const max = pnlValues.max > 0 ? Math.ceil(pnlValues.max) : 10;

    // Set number of ticks (5-7 is usually good for readability)
    const tickCount = 5;

    // Calculate the interval between ticks
    const range = max - min;
    const rawInterval = range / (tickCount - 1);

    // Round the interval to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
    let interval;

    if (rawInterval / magnitude < 1.5) {
      interval = magnitude;
    } else if (rawInterval / magnitude < 3) {
      interval = 2 * magnitude;
    } else if (rawInterval / magnitude < 7) {
      interval = 5 * magnitude;
    } else {
      interval = 10 * magnitude;
    }

    // Generate the ticks, ensuring min and max are included
    const ticks = [];
    let currentTick = Math.floor(min / interval) * interval;

    // Add ticks up to max
    while (currentTick <= max) {
      ticks.push(currentTick);
      currentTick += interval;
    }

    // If the max value wasn't added (due to rounding), add it explicitly
    const lastTick = ticks.length > 0 ? ticks[ticks.length - 1] : undefined;
    if (lastTick !== undefined && lastTick < max) {
      ticks.push(max);
    }

    return ticks;
  }, [pnlValues]);

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
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
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
              domain={[
                pnlValues.min < 0 ? Math.floor(pnlValues.min) : 0,
                pnlValues.max > 0 ? Math.ceil(pnlValues.max) : 10,
              ]}
              ticks={yAxisTicks}
              tickCount={6}
              interval="preserveEnd"
              tickFormatter={value => {
                // Use abbreviated currency format for tick values
                if (Math.abs(value) < 0.01) return '0';

                // Format with abbreviations
                const absValue = Math.abs(value);
                let formattedValue;

                if (absValue >= 1000000) {
                  formattedValue = `$${(value / 1000000).toFixed(1)}M`;
                } else if (absValue >= 1000) {
                  formattedValue = `$${(value / 1000).toFixed(1)}k`;
                } else {
                  formattedValue = formatCurrency(value);
                }

                return formattedValue;
              }}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
              tickMargin={8}
              allowDataOverflow={false}
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
              strokeWidth={theme === THEME.DARK ? 2.5 : 1.5}
              connectNulls
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
