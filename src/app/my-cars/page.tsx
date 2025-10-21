'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Car } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ManageVehicleDialog } from '@/components/manage-vehicle-dialog';
import { useTranslation } from 'react-i18next';
import { OwnerLayout } from '@/components/owner-layout';

export default function MyCarsPage() {
  const { user, userProfile } = useAuthWithProfile();
  const firestore = useFirestore();
  const { t } = useTranslation();

  const ownerCarsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'owner') return null;
    return query(collection(firestore, 'cars'), where('ownerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: ownerCars, isLoading: carsLoading } = useCollection<Car>(ownerCarsQuery);

  const getBadgeVariant = (available: Car['available']): "default" | "secondary" | "outline" | "destructive" => {
    return available ? 'default' : 'secondary';
  };

  return (
    <OwnerLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-headline font-bold">{t('My Cars')}</h1>
          <ManageVehicleDialog
            trigger={<Button>{t('Add Vehicle')}</Button>}
            ownerId={user?.uid}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Your Fleet')}</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Vehicle')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead>{t('Price/Day')}</TableHead>
                <TableHead className="text-right">{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carsLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center h-24">{t('Loading your vehicles...')}</TableCell></TableRow>
              ) : ownerCars?.map(car => (
                <TableRow key={car.id}>
                  <TableCell>{car.brand} {car.model}</TableCell>
                  <TableCell><Badge variant={getBadgeVariant(car.available)}>{car.available ? t('Available') : t('Unavailable')}</Badge></TableCell>
                  <TableCell>{car.pricePerDay.toLocaleString()} RWF</TableCell>
                  <TableCell className="text-right">
                    <ManageVehicleDialog
                      car={car}
                      trigger={<Button variant="outline" size="sm">{t('Manage')}</Button>}
                      ownerId={user?.uid}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </OwnerLayout>
  );
}
