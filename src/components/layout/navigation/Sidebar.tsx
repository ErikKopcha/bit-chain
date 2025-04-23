'use client';

import { ArrowUpCircleIcon, LayoutDashboardIcon, TableIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/features/auth/constants';
import { useSession } from 'next-auth/react';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: ROUTES.DASHBOARD.path,
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Journal',
      url: ROUTES.TRADING_JOURNAL.path,
      icon: TableIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const email = session?.user?.email;

  if (email) {
    data.user.email = email;
    data.user.name = email.split('@')[0] || '';
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href={ROUTES.DASHBOARD.path}>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Trading Journal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
