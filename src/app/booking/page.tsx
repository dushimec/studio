import { findBookings, findCarById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BookingsPage() {
  const bookings = findBookings();

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">Amabookinga yanjye</h1>
        <p className="text-lg text-muted-foreground">Genzura amakode yawe yashize, ayariho, n'azaza.</p>
      </div>
      
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const car = findCarById(booking.carId);
            if (!car) return null;
            const carImage = PlaceHolderImages.find(p => p.id === car.images[0]);
            return (
              <Card key={booking.id} className="grid md:grid-cols-12 gap-4 items-center p-4 hover:bg-card/80 transition-colors">
                <div className="md:col-span-3">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    {carImage ? (
                      <Image 
                        src={carImage.imageUrl} 
                        alt={car.name} 
                        fill
                        className="object-cover"
                        data-ai-hint={carImage.imageHint}
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
                      {format(booking.startDate, 'MMM d, yyyy')} kugeza {format(booking.endDate, 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </div>
                <div className="md:col-span-3 text-left md:text-right">
                  <p className="text-2xl font-bold mb-2">{booking.totalPrice.toLocaleString()} RWF</p>
                  {booking.status === 'Upcoming' && <Button variant="outline" size="sm">Genzura</Button>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Nta Booking Zibonetse</h2>
          <p className="text-muted-foreground mb-4">Ntabwo uragira booking n'imwe ukora.</p>
          <Button asChild>
            <Link href="/browse">Reba Imodoka</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
