'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Booking, Car } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { useTranslation } from 'react-i18next';
import { OwnerLayout } from '@/components/owner-layout';
import { useMemo } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function BookingCard({ booking }: { booking: Booking }) {
  const firestore = useFirestore();
  const carRef = useMemoFirebase(() => booking.carId ? doc(firestore, 'cars', booking.carId) : null, [firestore, booking.carId]);
  const { data: car, isLoading } = useDoc<Car>(carRef);
  const { t } = useTranslation();

  const getBadgeVariant = (status: Booking['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'completed': return 'outline';
      case 'rejected':
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  if (!booking.carId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This booking is missing a car ID.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <p>Loading car details...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{car?.make} {car?.model}</CardTitle>
        <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
      </CardHeader>
      <CardContent>
        <p>Start Date: {booking.startDate}</p>
        <p>End Date: {booking.endDate}</p>
      </CardContent>
    </Card>
  );
}


export default function BookingsPage() {
  const { user, userProfile } = useAuthWithProfile();
  const firestore = useFirestore();
  const { t } = useTranslation();

  const ownerBookingsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'owner') return null;
    return query(collection(firestore, 'bookings'), where('ownerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: ownerBookings, isLoading: bookingsLoading } = useCollection<Booking>(ownerBookingsQuery);

  if (bookingsLoading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <OwnerLayout>
      <div>
        <h1 className="text-4xl font-headline font-bold mb-8">{t('Manage Bookings')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownerBookings?.filter(booking => booking).map(booking => <BookingCard key={booking.id} booking={booking} />)}
        </div>
      </div>
    </OwnerLayout>
  );
}
