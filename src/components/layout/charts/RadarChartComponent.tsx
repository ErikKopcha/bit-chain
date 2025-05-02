'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { ChartSkeleton } from './ChartSkeleton';

interface RadarChartData {
  name: string;
  value: number;
}

interface RadarChartComponentProps {
  title: string;
  description: string;
  data: RadarChartData[];
  color: string;
  isLoading?: boolean;
  footer?: React.ReactNode;
}

export function RadarChartComponent({
  title,
  description,
  data,
  color,
  isLoading,
  footer,
}: RadarChartComponentProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    radar: {
      label: title,
      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : color,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-square h-[250px] w-full">
          <RadarChart data={data}>
            <PolarGrid {...(theme === 'dark' ? { stroke: 'rgba(255, 255, 255, 0.2)' } : {})} />
            <PolarAngleAxis dataKey="name" />
            <Radar
              name="Value"
              dataKey="value"
              stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : color}
              fill={theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : color}
              fillOpacity={0.6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={value => value} indicator="dot" />}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
