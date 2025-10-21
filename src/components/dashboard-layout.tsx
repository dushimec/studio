'use client';

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { OwnerSidebar } from './owner-sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems?: {
    href: string;
    label: string;
    icon: string;
  }[];
};

export function DashboardLayout({ children, navItems = [] }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, isUserLoading: isUserLoadingAuth } = useUser();
  const { profile, isLoading: isProfileLoading } = useAuthWithProfile();

  const isUserLoading = isUserLoadingAuth || isProfileLoading;

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // Or a redirect to login
    return null;
  }

  if (profile?.role === 'owner') {
    return (
      <div className="flex min-h-screen">
        <OwnerSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    );
  }

  const defaultNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  ];

  const finalNavItems = navItems.length > 0 ? navItems : defaultNavItems;

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
              {finalNavItems.map((item) => (
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
