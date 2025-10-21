'use client';

import type { Car, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { ManageVehicleDialog } from './manage-vehicle-dialog';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useTranslation } from 'react-i18next';

export function OwnerDashboard({ ownerCars, ownerBookings, carsLoading, bookingsLoading, user }: { ownerCars: Car[] | null, ownerBookings: Booking[] | null, carsLoading: boolean, bookingsLoading: boolean, user: any }) {
  const firestore = useFirestore();
  const { t } = useTranslation();

  const totalEarnings = useMemo(() => {
    if (!ownerBookings) return 0;
    return ownerBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0);
  }, [ownerBookings]);

  const activeBookings = useMemo(() => {
    if (!ownerBookings) return 0;
    return ownerBookings.filter(b => ['pending', 'approved'].includes(b.status)).length;
  }, [ownerBookings]);

  const getBadgeVariant = (available: Car['available']): "default" | "secondary" | "outline" | "destructive" => {
    return available ? 'default' : 'secondary';
  };

  const handleBookingStatusChange = (bookingId: string, status: 'approved' | 'rejected') => {
    const bookingRef = doc(firestore, 'bookings', bookingId);
    setDocumentNonBlocking(bookingRef, { status }, { merge: true });
  };

  return (
    <>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-4xl font-headline font-bold mb-2">{t('Owner Dashboard')}</h1>
              <p className="text-lg text-muted-foreground">{t("Welcome back, {{user.displayName}}. Here's an overview of your fleet.", { user })}</p>
          </div>
           <ManageVehicleDialog
              trigger={<Button>{t('Add Vehicle')}</Button>}
              ownerId={user.uid}
           />
        </div>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
              <span className="material-symbols-outlined text-muted-foreground">payments</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} RWF</div>
              <p className="text-xs text-muted-foreground">{t('From completed bookings')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active & Upcoming Bookings')}</CardTitle>
              <span className="material-symbols-outlined text-muted-foreground">event_available</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">{t('Across all vehicles')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Vehicles')}</CardTitle>
              <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerCars?.length ?? 0}</div>
              <p className="text-xs text-muted-foreground">{t('In your fleet')}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-8">
          {/* My Vehicles Table */}
          <Card>
              <CardHeader>
                  <CardTitle>{t('My Vehicles')}</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Vehicle')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                    <TableHead>{t('Price/Day')}</TableHead>
                    <TableHead>{t('Bookings')}</TableHead>
                    <TableHead className="text-right">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center h-24">{t('Loading your vehicles...')}</TableCell></TableRow>
                  ) : ownerCars?.map(car => (
                    <TableRow key={car.id}>
                      <TableCell>{car.brand} {car.model}</TableCell>
                      <TableCell><Badge variant={getBadgeVariant(car.available)}>{car.available ? t('Available') : t('Unavailable')}</Badge></TableCell>
                      <TableCell>{car.pricePerDay.toLocaleString()} RWF</TableCell>
                      <TableCell>{ownerBookings?.filter(b => b.carId === car.id).length || 0}</TableCell>
                      <TableCell className="text-right">
                        <ManageVehicleDialog 
                          car={car}
                          trigger={<Button variant="outline" size="sm">{t('Manage')}</Button>}
                          ownerId={user.uid}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </Card>

          {/* Bookings Table */}
          <Card>
              <CardHeader>
                  <CardTitle>{t('Manage Bookings')}</CardTitle>
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
                  {bookingsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center h-24">{t('Loading bookings...')}</TableCell></TableRow>
                  ) : ownerBookings?.map(booking => {
                      const car = ownerCars?.find(c => c.id === booking.carId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{car ? `${car.brand} ${car.model}` : t('N/A')}</TableCell>
                          <TableCell>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{t('Customer Name')}</TableCell> {/* Placeholder */}
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
    </>
  );
}
