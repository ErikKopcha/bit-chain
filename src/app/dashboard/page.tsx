import { BarChartHorizontal } from '@/components/layout/charts/BarChartHorizontal';
import { ChartAreaInteractive } from '@/components/layout/charts/ChartAreaInteractive';
import { RadarChart } from '@/components/layout/charts/RadarChart';
import { DashboardHeader } from '@/components/layout/navigation/DashboardHeader';
import { AppSidebar } from '@/components/layout/navigation/Sidebar';
import { SectionCards } from '@/components/layout/SectionCards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <RadarChart />
                <BarChartHorizontal />
                <BarChartHorizontal />
                <BarChartHorizontal />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
