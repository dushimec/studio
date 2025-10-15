'use client';

import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { findCars, findLocations } from '@/lib/data';
import { CarCard } from '@/components/car-card';
import dynamic from 'next/dynamic';
import type { Location } from '@/lib/types';


function haversineDistance(coords1: [number, number], coords2: [number, number]): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coords2[0] - coords1[0]);
  const dLon = toRad(coords2[1] - coords1[1]);
  const lat1 = toRad(coords1[0]);
  const lat2 = toRad(coords2[0]);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function MapPage() {
  const cars = findCars();
  const locations = findLocations();
  const center: [number, number] = [-1.9441, 30.0619];
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindNearest = () => {
    setIsLoading(true);
    setNearestLocation(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);

          let closestLocation: Location | null = null;
          let minDistance = Infinity;

          locations.forEach(location => {
            const distance = haversineDistance(userPos, location.position);
            if (distance < minDistance) {
              minDistance = distance;
              closestLocation = location;
            }
          });

          setNearestLocation(closestLocation);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setIsLoading(false);
          alert("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setIsLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  const Map = useMemo(() => dynamic(() => import('@/components/map-component'), {
    loading: () => <div className="h-[600px] w-full bg-muted flex items-center justify-center"><span className="material-symbols-outlined text-5xl animate-spin text-primary">progress_activity</span></div>,
    ssr: false
  }), [userLocation, nearestLocation]);


  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold mb-2">Car Rental Map of Rwanda</h1>
        <p className="text-lg text-muted-foreground">Find our locations across the country.</p>
        <Button onClick={handleFindNearest} disabled={isLoading} className="mt-4">
          {isLoading ? (
            <span className="material-symbols-outlined mr-2 h-4 w-4 animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined mr-2 h-4 w-4">my_location</span>
          )}
          Find Nearest Location
        </Button>
      </div>
      <Card className="overflow-hidden">
        <Map
            center={center}
            cars={cars}
            locations={locations}
            userLocation={userLocation}
            nearestLocation={nearestLocation}
          />
      </Card>
      {nearestLocation && (
        <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Nearest Location: {nearestLocation.name}</h2>
              <p className="text-muted-foreground">These cars are available near you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {nearestLocation.carIds.map(carId => {
                    const car = cars.find(c => c.id === carId);
                    if (!car) return null;
                    return (
                        <CarCard key={car.id} car={car} />
                    )
                })}
            </div>
        </div>
      )}
    </div>
  );
}
