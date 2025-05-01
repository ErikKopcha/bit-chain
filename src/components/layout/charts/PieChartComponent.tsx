'use client';

import { Cell, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartSkeleton } from './ChartSkeleton';

interface PieChartData {
  name: string;
  percentage: number;
  value?: number;
}

interface PieChartComponentProps {
  title: string;
  description: string;
  data: PieChartData[];
  colors: string[];
  isLoading?: boolean;
}

export function PieChartComponent({
  title,
  description,
  data,
  colors,
  isLoading,
}: PieChartComponentProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    pie: {
      label: title,
      color: colors[0],
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex items-center justify-center h-full">
        <ChartContainer config={chartConfig} className="aspect-square h-[250px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={value => value} indicator="dot" />}
            />
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
