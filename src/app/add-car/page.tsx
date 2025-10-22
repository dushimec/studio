'use client';

import { ManageVehicleDialog } from '@/components/manage-vehicle-dialog';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { useTranslation } from 'react-i18next';

export default function AddCarPage() {
  const { user } = useAuthWithProfile();
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-headline font-bold mb-8">{t('Add New Car')}</h1>
      <div className="animate-slide-in-from-bottom">
        <ManageVehicleDialog ownerId={user?.uid} />
      </div>
    </div>
  );
}
