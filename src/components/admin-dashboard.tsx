'use client';

import type { User, Car, Booking } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { ManageVehicleDialog } from './manage-vehicle-dialog';
import { Button } from './ui/button';
import { format } from 'date-fns';

export function AdminDashboard({ users, cars, bookings, loading }: { users: User[] | null, cars: Car[] | null, bookings: Booking[] | null, loading: boolean }) {

  const totalUsers = users?.length || 0;
  const totalCars = cars?.length || 0;
  const totalBookings = bookings?.length || 0;

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'rejected':
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <>
      <div className="mb-8">
          <h1 className="text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Platform-wide statistics and management.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
             <span className="material-symbols-outlined text-muted-foreground">group</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">book_online</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center h-24">Loading...</TableCell></TableRow>
                ) : users?.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge>{user.role}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Cars</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                ) : cars?.map(car => {
                    const owner = users?.find(u => u.uid === car.ownerId);
                    return (
                      <TableRow key={car.id}>
                        <TableCell>{car.brand} {car.model}</TableCell>
                        <TableCell>{owner?.displayName || 'N/A'}</TableCell>
                        <TableCell>{car.pricePerDay.toLocaleString()} RWF</TableCell>
                        <TableCell><Badge variant={car.available ? 'default' : 'secondary'}>{car.available ? 'Available' : 'Unavailable'}</Badge></TableCell>
                        <TableCell className="text-right">
                            <ManageVehicleDialog car={car} ownerId={car.ownerId} trigger={<Button variant="outline" size="sm">Manage</Button>} />
                        </TableCell>
                      </TableRow>
                    )
                })}
              </TableBody>
            </Table>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                ) : bookings?.map(booking => {
                    const car = cars?.find(c => c.id === booking.carId);
                    const customer = users?.find(u => u.uid === booking.customerId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>{car ? `${car.brand} ${car.model}` : 'N/A'}</TableCell>
                        <TableCell>{customer?.displayName || 'N/A'}</TableCell>
                        <TableCell>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge></TableCell>
                        <TableCell className="text-right">{booking.totalPrice.toLocaleString()} RWF</TableCell>
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
