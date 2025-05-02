'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';

export function DashboardHeader() {
  const pathname = usePathname().replace('/', '');
  const pageTitle = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium">{pageTitle}</h1>
        </div>
        <div className="flex items-center">
          <ThemeToggle className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}
