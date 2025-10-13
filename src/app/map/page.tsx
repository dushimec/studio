'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { findCars } from '@/lib/data';
import { Loader2, LocateFixed } from 'lucide-react';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-location-marker'
});

const locations = [
  { id: '1', name: 'Kigali International Airport', position: [-1.9639, 30.1344] as L.LatLngTuple, carIds: ['1', '2'] },
  { id: '2', name: 'Kigali City Center', position: [-1.9441, 30.0619] as L.LatLngTuple, carIds: ['3', '4'] },
  { id: '3', name: 'Gisenyi/Rubavu', position: [-1.7000, 29.2500] as L.LatLngTuple, carIds: ['5'] },
  { id: '4', name: 'Butare/Huye', position: [-2.6000, 29.7400] as L.LatLngTuple, carIds: ['6'] },
];

function haversineDistance(coords1: L.LatLngTuple, coords2: L.LatLngTuple): number {
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

function MapFlyTo({ position }: { position: L.LatLngTuple }) {
  const map = useMap();
  map.flyTo(position, 13);
  return null;
}

export default function MapPage() {
  const cars = findCars();
  const center: L.LatLngTuple = [-1.9441, 30.0619];
  const [userLocation, setUserLocation] = useState<L.LatLngTuple | null>(null);
  const [nearestLocation, setNearestLocation] = useState<(typeof locations)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindNearest = () => {
    setIsLoading(true);
    setNearestLocation(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);

          let closestLocation = null;
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
          alert("Could not get your location. Please ensure you have location services enabled.");
        }
      );
    } else {
      setIsLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold mb-2">Rental Map of Rwanda</h1>
        <p className="text-lg text-muted-foreground">Explore our car rental locations across the country.</p>
        <Button onClick={handleFindNearest} disabled={isLoading} className="mt-4">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="mr-2 h-4 w-4" />
          )}
          Find Nearest Location
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="h-[600px] w-full">
          <MapContainer center={center} zoom={9} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            {nearestLocation && <MapFlyTo position={nearestLocation.position} />}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(location => (
              <Marker key={location.id} position={location.position} opacity={nearestLocation && nearestLocation.id !== location.id ? 0.5 : 1}>
                <Popup>
                    <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                        <div className="space-y-2">
                           <p className="font-semibold">Available Cars:</p>
                           {location.carIds.map(carId => {
                               const car = cars.find(c => c.id === carId);
                               if (!car) return null;
                               return (
                                   <Card key={car.id} className="p-2">
                                       <CardTitle className="text-sm">{car.name}</CardTitle>
                                       <CardContent className="p-0 mt-1">
                                           <p className="text-xs text-muted-foreground">${car.pricePerDay}/day</p>
                                           <Button asChild variant="link" className="p-0 h-auto text-xs mt-1">
                                               <Link href={`/browse/${car.id}`}>View Details</Link>
                                           </Button>
                                       </CardContent>
                                   </Card>
                               )
                           })}
                        </div>
                    </div>
                </Popup>
              </Marker>
            ))}
             {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </Card>
      {nearestLocation && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Nearest Location to You: {nearestLocation.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">These cars are available at your nearest location:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nearestLocation.carIds.map(carId => {
                        const car = cars.find(c => c.id === carId);
                        if (!car) return null;
                        return (
                            <Card key={car.id} className="p-4">
                                <CardTitle className="text-lg">{car.name}</CardTitle>
                                <CardContent className="p-0 mt-2">
                                    <p>${car.pricePerDay}/day</p>
                                     <Button asChild variant="secondary" className="mt-2 w-full">
                                       <Link href={`/browse/${car.id}`}>Book Now</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
