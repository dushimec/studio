
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: {
    href: string;
    label: string;
    icon: string;
  }[];
};

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-[calc(100vh-3.5rem-1px)] flex flex-col md:flex-row">
        <Sidebar>
          <SidebarHeader>
            <div className="hidden md:block">
              <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={pathname === item.href}
                    asChild
                    tooltip={item.label}
                  >
                    <a href={item.href}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Can add footer items here if needed */}
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">
          <div className="p-2 hidden md:block">
             <SidebarTrigger className="md:hidden" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
