import { BarChartHorizontal } from '@/components/layout/charts/BarChartHorizontal';
import { ChartAreaInteractive } from '@/components/layout/charts/ChartAreaInteractive';
import { ChartLoader } from '@/components/layout/charts/ChartLoader';
import { RadarChart } from '@/components/layout/charts/RadarChart';
import { SectionCards } from '@/components/layout/SectionCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Trading Journal',
  description: 'Your trading dashboard overview',
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartLoader>
          <ChartAreaInteractive />
        </ChartLoader>
      </div>
      <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ChartLoader>
          <RadarChart />
        </ChartLoader>
        <ChartLoader>
          <BarChartHorizontal />
        </ChartLoader>
        <ChartLoader>
          <BarChartHorizontal />
        </ChartLoader>
        <ChartLoader>
          <BarChartHorizontal />
        </ChartLoader>
      </div>
    </div>
  );
}
