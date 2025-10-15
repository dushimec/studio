
'use client';

import { useAuth } from '@/context/auth-context';
import { findCars, findBookings, findCarById } from '@/lib/data';
import type { Car, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const allBookings = useMemo(() => findBookings(), []);

  const ownerCars = useMemo(() => {
    if (!user) return [];
    return findCars({ ownerId: user.id });
  }, [user]);

  const ownerBookings = useMemo(() => {
    if (!ownerCars.length) return [];
    const ownerCarIds = ownerCars.map(c => c.id);
    return allBookings.filter(b => ownerCarIds.includes(b.carId));
  }, [ownerCars, allBookings]);


  const totalEarnings = useMemo(() => {
    return ownerBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalPrice, 0);
  }, [ownerBookings]);

  const activeBookings = useMemo(() => {
    return ownerBookings.filter(b => b.status === 'Active' || b.status === 'Upcoming').length;
  }, [ownerBookings]);


  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your owner dashboard.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  const getBadgeVariant = (status: Car['availability']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Booked':
        return 'secondary';
      case 'Maintenance':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">Owner Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome back, {user.name}. Here's an overview of your fleet.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">payments</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} RWF</div>
            <p className="text-xs text-muted-foreground">From completed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active & Upcoming Bookings</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">event_available</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerCars.length}</div>
            <p className="text-xs text-muted-foreground">In your fleet</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* My Vehicles Table */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">My Vehicles</h2>
             <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price/Day (RWF)</TableHead>
                      <TableHead className="text-right">Total Bookings</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ownerCars.length > 0 ? ownerCars.map(car => (
                      <TableRow key={car.id}>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(car.availability)}>{car.availability}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{car.pricePerDay.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{ownerBookings.filter(b => b.carId === car.id).length}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">You have no vehicles listed.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </Card>
        </div>

        {/* Recent Bookings */}
        <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {ownerBookings.slice(0, 5).map(booking => {
                        const car = findCarById(booking.carId);
                        return (
                            <div key={booking.id} className="flex items-center">
                                <div className="flex-grow">
                                    <p className="font-semibold">{car?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(booking.startDate, 'MMM d')} - {format(booking.endDate, 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{booking.totalPrice.toLocaleString()} RWF</p>
                                    <Badge variant={booking.status === "Completed" ? "outline" : "default"}>{booking.status}</Badge>
                                </div>
                            </div>
                        )
                    })}
                     {ownerBookings.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No bookings for your vehicles yet.</p>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
