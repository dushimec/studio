
'use client';

import { useMockData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function BookingsPage() {
  const { user } = useAuth();
  const { bookings, findCarById } = useMockData();

  const getBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Upcoming':
        return 'default';
      case 'Active':
        return 'secondary';
      case 'Completed':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your bookings.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  // NOTE: In a real app, you'd fetch bookings for the specific logged-in user.
  // Here we just show all mock bookings.

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">My Bookings</h1>
        <p className="text-lg text-muted-foreground">Review your past, current, and future rentals.</p>
      </div>
      
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const car = findCarById(booking.carId);
            if (!car) return null;
            const carImage = car.images[0];
            return (
              <Card key={booking.id} className="grid md:grid-cols-12 gap-4 items-center p-4 hover:bg-card/80 transition-colors">
                <div className="md:col-span-3">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    {carImage ? (
                      <Image 
                        src={carImage} 
                        alt={car.name} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : <div className="bg-muted w-full h-full" /> }
                  </div>
                </div>
                <div className="md:col-span-6">
                  <CardHeader className="p-0">
                    <Badge variant={getBadgeVariant(booking.status)} className="w-fit mb-2">{booking.status}</Badge>
                    <CardTitle className="text-xl">{car.name}</CardTitle>
                    <CardDescription>{car.rentalCompany}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <p className="text-sm text-muted-foreground">
                      {format(booking.startDate, 'MMM d, yyyy')} to {format(booking.endDate, 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </div>
                <div className="md:col-span-3 text-left md:text-right">
                  <p className="text-2xl font-bold mb-2">{booking.totalPrice.toLocaleString()} RWF</p>
                  {booking.status === 'Upcoming' && <Button variant="outline" size="sm">Manage</Button>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Bookings Found</h2>
          <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
          <Button asChild>
            <Link href="/browse">Browse Cars</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

    