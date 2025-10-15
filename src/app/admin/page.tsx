
'use client';

import { useAuth } from '@/context/auth-context';
import { findCars, findBookings, useMockData } from '@/lib/data';
import type { Booking, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/dashboard-layout';

function ManageUserDialog({ user: targetUser, onUpdate, onDelete }: { user: User, onUpdate: (user: User) => void, onDelete: (userId: string) => void }) {
    const [role, setRole] = React.useState(targetUser.role);
    const [open, setOpen] = React.useState(false);

    const handleSave = () => {
        onUpdate({ ...targetUser, role });
        setOpen(false);
    }
    
    const handleDelete = () => {
        onDelete(targetUser.id);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage {targetUser.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <p id="email" className="col-span-3">{targetUser.email}</p>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as User['role'])}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button type="button" variant="destructive" onClick={handleDelete}>Delete User</Button>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSave}>Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users, cars, bookings, updateUser, deleteUser } = useMockData();
  
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

  const navItems = [
    { href: '/admin', label: 'Overview', icon: 'grid_view' },
    { href: '/dashboard', label: 'Fleet', icon: 'directions_car' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-4 sm:p-6 lg:p-8">
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
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered users on the platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <span className="material-symbols-outlined text-muted-foreground">book_online</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Across all vehicles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cars.length}</div>
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
                      {users.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'admin' ? 'destructive' : 'outline'}>{u.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <ManageUserDialog user={u} onUpdate={updateUser} onDelete={deleteUser} />
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
                      {bookings.slice(0, 5).map(booking => {
                          const car = cars.find(c => c.id === booking.carId);
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
                       {bookings.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">No bookings on the platform yet.</p>
                       )}
                  </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
