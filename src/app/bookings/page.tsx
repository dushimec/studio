'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Booking, Car } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { OwnerLayout } from '@/components/owner-layout';

export default function BookingsPage() {
  const { user, userProfile } = useAuthWithProfile();
  const firestore = useFirestore();
  const { t } = useTranslation();

  const ownerBookingsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'owner') return null;
    return query(collection(firestore, 'bookings'), where('ownerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: ownerBookings, isLoading: bookingsLoading } = useCollection<Booking>(ownerBookingsQuery);

  const ownerCarIds = useMemoFirebase(() => {
    if (!ownerBookings) return [];
    return [...new Set(ownerBookings.map(b => b.carId))];
  }, [ownerBookings]);

  const carsQuery = useMemoFirebase(() => {
    if (ownerCarIds.length === 0 || !firestore) return null;
    return query(collection(firestore, 'cars'), where('id', 'in', ownerCarIds));
  }, [ownerCarIds, firestore]);
  const { data: cars, isLoading: carsLoading } = useCollection<Car>(carsQuery);

  const handleBookingStatusChange = (bookingId: string, status: 'approved' | 'rejected') => {
    const bookingRef = doc(firestore, 'bookings', bookingId);
    setDocumentNonBlocking(bookingRef, { status }, { merge: true });
  };

  const isLoading = bookingsLoading || carsLoading;

  return (
    <OwnerLayout>
      <div>
        <h1 className="text-4xl font-headline font-bold mb-8">{t('Manage Bookings')}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t('Your Bookings')}</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Vehicle')}</TableHead>
                <TableHead>{t('Dates')}</TableHead>
                <TableHead>{t('Customer')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead className="text-right">{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">{t('Loading bookings...')}</TableCell></TableRow>
              ) : ownerBookings?.map(booking => {
                const car = cars?.find(c => c.id === booking.carId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell>{car ? `${car.brand} ${car.model}` : t('N/A')}</TableCell>
                    <TableCell>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{booking.fullName}</TableCell>
                    <TableCell><Badge>{booking.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleBookingStatusChange(booking.id, 'approved')}>{t('Approve')}</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleBookingStatusChange(booking.id, 'rejected')}>{t('Reject')}</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </OwnerLayout>
  );
}
