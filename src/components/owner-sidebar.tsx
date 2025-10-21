'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ManageVehicleDialog } from './manage-vehicle-dialog';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Cars', path: '/my-cars' },
  { name: 'Bookings', path: '/bookings' },
  { name: 'Earnings', path: '/earnings' },
  { name: 'Messages', path: '/messages' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Reports', path: '/reports' },
  { name: 'Profile', path: '/profile' },
  { name: 'Settings', path: '/settings' },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuthWithProfile();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background p-4">
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            asChild
            variant={pathname === item.path ? 'secondary' : 'ghost'}
          >
            <Link href={item.path}>{t(item.name)}</Link>
          </Button>
        ))}
        <ManageVehicleDialog
          trigger={<Button variant='ghost' className="justify-start">{t('Add New Car')}</Button>}
          ownerId={user?.uid}
        />
      </nav>
      <div className="mt-auto">
        <Button asChild variant="ghost">
          <Link href="/logout">{t('Logout')}</Link>
        </Button>
      </div>
    </aside>
  );
}
