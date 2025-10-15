
'use client';

import { useAuth, findUsers } from '@/context/auth-context';
import { findCars, findBookings } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  const allUsers = useMemo(() => findUsers(), []);
  const allCars = useMemo(() => findCars(), []);
  const allBookings = useMemo(() => findBookings(), []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Permission Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to access this page.</p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }
  
  const getStatusBadgeVariant = (status: Booking['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Upcoming': return 'default';
      case 'Active': return 'secondary';
      case 'Completed': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Platform-wide overview and management.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">group</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">Registered users on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">book_online</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBookings.length}</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allCars.length}</div>
            <p className="text-xs text-muted-foreground">Available for rent</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* User Management */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
             <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'admin' ? 'destructive' : 'outline'}>{u.role}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </Card>
        </div>

        {/* Recent Platform Bookings */}
        <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {allBookings.slice(0, 5).map(booking => {
                        const car = allCars.find(c => c.id === booking.carId);
                        return (
                            <div key={booking.id} className="flex items-center">
                                <div className="flex-grow">
                                    <p className="font-semibold">{car?.name || 'Unknown Car'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(booking.startDate, 'MMM d')} - {format(booking.endDate, 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{booking.totalPrice.toLocaleString()} RWF</p>
                                    <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                                </div>
                            </div>
                        )
                    })}
                     {allBookings.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No bookings on the platform yet.</p>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
