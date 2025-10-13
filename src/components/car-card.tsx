'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Fuel, Gauge, Cog, Car } from 'lucide-react';
import type { Car as CarType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getCarImage } from '@/ai/flows/car-image-flow';
import { Skeleton } from './ui/skeleton';

type CarCardProps = {
  car: CarType;
  generateImage?: boolean;
};

export function CarCard({ car, generateImage = false }: CarCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(generateImage);
  const fallbackImage = PlaceHolderImages.find(img => img.id === car.images[0]);

  useEffect(() => {
    async function generate() {
      if (generateImage) {
        try {
          const result = await getCarImage({
            carName: car.name,
            carType: car.type,
            carDescription: car.description,
          });
          setImageUrl(result.imageUrl);
        } catch (error) {
          console.error("Failed to generate car image:", error);
          if (fallbackImage) {
            setImageUrl(fallbackImage.imageUrl);
          }
        } finally {
          setLoading(false);
        }
      } else {
        if(fallbackImage) {
            setImageUrl(fallbackImage.imageUrl);
        }
      }
    }
    generate();
  }, [car, generateImage, fallbackImage]);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 shadow-lg">
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
                data-ai-hint={fallbackImage?.imageHint || 'car image'}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Car className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
             <Badge variant="secondary" className="absolute top-3 right-3">{car.type}</Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl mb-2">
          <Link href={`/browse/${car.id}`} className="hover:text-primary transition-colors">
            {car.name}
          </Link>
        </CardTitle>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-primary" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <span>Unlimited miles</span>
          </div>
          <div className="flex items-center gap-2">
            <Cog className="w-4 h-4 text-primary" />
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between bg-secondary/30">
        <div>
          <span className="text-2xl font-bold">${car.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild>
          <Link href={`/browse/${car.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
