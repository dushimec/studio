
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Car as CarType } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getCarImage } from '@/ai/flows/car-image-flow';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

type CarCardProps = {
  car: CarType;
  generateImage?: boolean;
};

export function CarCard({ car, generateImage = false }: CarCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fallbackImage = 'https://picsum.photos/seed/car-placeholder/800/600';
  
  // If the car has user-uploaded images (even temporary blob URLs), use them.
  // Otherwise, decide whether to generate one with AI.
  const hasUserImage = car.images && car.images.length > 0;
  const shouldGenerateImage = generateImage && !hasUserImage;


  useEffect(() => {
    async function generate() {
      if (hasUserImage) {
        setImageUrl(car.images[0]);
        setLoading(false);
        return;
      }

      if (shouldGenerateImage) {
        try {
          const result = await getCarImage({
            carName: car.name,
            carType: car.type,
            carDescription: car.description,
          });
          setImageUrl(result.imageUrl);
        } catch (error) {
          setImageUrl(fallbackImage);
        } finally {
          setLoading(false);
        }
      } else {
        setImageUrl(fallbackImage);
        setLoading(false);
      }
    }
    generate();
  }, [car, shouldGenerateImage, hasUserImage, fallbackImage]);

  const availabilityStyles = {
    Available: 'bg-green-500/20 text-green-400 border-green-500/30',
    Booked: 'bg-red-500/20 text-red-400 border-red-500/30',
    Maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  
  const isAvailable = car.availability === 'Available';

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all duration-300 hover:shadow-primary/20 shadow-lg",
       !isAvailable && "opacity-60 hover:opacity-80"
    )}>
      <CardHeader className="p-0">
        <Link href={`/browse/${car.id}`} className="block">
          <div className="relative h-56 w-full">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={car.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={'car image'}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-foreground">directions_car</span>
              </div>
            )}
             <Badge variant="secondary" className="absolute top-3 left-3">{car.type}</Badge>
             <Badge 
                className={cn("absolute top-3 right-3", availabilityStyles[car.availability])}
             >
                {car.availability}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl mb-2">
          <Link href={`/browse/${car.id}`} className="hover:text-primary transition-colors">
            {car.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3">{car.brand} &middot; {car.year}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">group</span>
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">local_gas_station</span>
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">settings</span>
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between bg-secondary/30">
        <div>
          <span className="text-2xl font-bold">{car.pricePerDay.toLocaleString()} RWF</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild disabled={!isAvailable}>
          <Link href={`/browse/${car.id}`}>{isAvailable ? 'Book Now' : 'Not Available'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    