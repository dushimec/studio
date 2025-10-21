'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Car, Booking, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { collection, query, where } from 'firebase/firestore';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { OwnerDashboard } from '@/components/owner-dashboard';
import { CustomerDashboard } from '@/components/customer-dashboard';
import { AdminDashboard } from '@/components/admin-dashboard';
import { OwnerLayout } from '@/components/owner-layout';

export default function DashboardPage() {
  const { user, isUserLoading, userProfile, isProfileLoading } = useAuthWithProfile();
  const firestore = useFirestore();

  // Data fetching for Owner
  const ownerCarsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'owner') return null;
    return query(collection(firestore, 'cars'), where('ownerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: ownerCars, isLoading: carsLoading } = useCollection<Car>(ownerCarsQuery);

  const ownerBookingsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'owner') return null;
    return query(collection(firestore, 'bookings'), where('ownerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: ownerBookings, isLoading: bookingsLoading } = useCollection<Booking>(ownerBookingsQuery);

  // Data fetching for Customer
  const customerBookingsQuery = useMemoFirebase(() => {
    if (!user || !firestore || userProfile?.role !== 'customer') return null;
    return query(collection(firestore, 'bookings'), where('customerId', '==', user.uid));
  }, [user, firestore, userProfile]);
  const { data: customerBookings, isLoading: customerBookingsLoading } = useCollection<Booking>(customerBookingsQuery);

  // Data fetching for Admin
  const allUsersQuery = useMemoFirebase(() => {
    if (!firestore || userProfile?.role !== 'admin') return null;
    return collection(firestore, 'users');
  }, [firestore, userProfile]);
  const { data: allUsers, isLoading: usersLoading } = useCollection<User>(allUsersQuery);

  const allCarsQuery = useMemoFirebase(() => {
    if (!firestore || userProfile?.role !== 'admin') return null;
    return collection(firestore, 'cars');
  }, [firestore, userProfile]);
  const { data: allCars, isLoading: allCarsLoading } = useCollection<Car>(allCarsQuery);

  const allBookingsQuery = useMemoFirebase(() => {
    if (!firestore || userProfile?.role !== 'admin') return null;
    return collection(firestore, 'bookings');
  }, [firestore, userProfile]);
  const { data: allBookings, isLoading: allBookingsLoading } = useCollection<Booking>(allBookingsQuery);


  if (isUserLoading || isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You must be logged in to view the dashboard.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (userProfile?.role === 'owner') {
    return (
        <OwnerLayout>
            <OwnerDashboard 
                user={user} 
                ownerCars={ownerCars} 
                ownerBookings={ownerBookings} 
                carsLoading={carsLoading} 
                bookingsLoading={bookingsLoading} 
            />
        </OwnerLayout>
    );
  }

  const navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  ];

  if (userProfile?.role === 'admin') {
      navItems.push({ href: '/admin', label: 'Admin', icon: 'shield_person' });
  }

  const renderDashboard = () => {
    switch (userProfile?.role) {
      case 'customer':
        return <CustomerDashboard 
                  user={user}
                  bookings={customerBookings} 
                  isLoading={customerBookingsLoading} 
                />;
      case 'admin':
        return <AdminDashboard 
                  users={allUsers}
                  cars={allCars}
                  bookings={allBookings}
                  loading={usersLoading || allCarsLoading || allBookingsLoading}
                />;
      default:
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Role not assigned</h1>
            <p className="text-muted-foreground mb-6">Your user role has not been assigned. Please contact support.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout navItems={navItems}>
      {renderDashboard()}
    </DashboardLayout>
  );
}