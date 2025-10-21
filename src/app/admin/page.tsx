
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useTranslation } from 'react-i18next';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  // This is a placeholder. A real admin page would fetch and display platform-wide data.
  // We are keeping it simple for now. The core logic for dashboards is in /dashboard
  const user = { role: 'admin' }; // Mock user for layout

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('Permission Denied')}</h1>
        <p className="text-muted-foreground mb-6">{t('You do not have permission to access this page.')}</p>
        <Button asChild>
          <Link href="/">{t('Go to Homepage')}</Link>
        </Button>
      </div>
    );
  }
  
  const navItems = [
    { href: '/admin', label: t('Admin'), icon: 'shield_person' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-headline font-bold mb-2">{t('Admin Dashboard')}</h1>
        <p className="text-lg text-muted-foreground">{t('Platform-wide overview and management.')}</p>
        {/* Admin-specific components would go here */}
         <div className="mt-8 text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">{t('Admin Features')}</h2>
          <p className="text-muted-foreground mb-4">{t('User management, platform analytics, and other admin tools would be displayed here.')}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
