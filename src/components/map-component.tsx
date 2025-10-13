'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Car } from '@/lib/types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Location = {
    id: string;
    name: string;
    position: L.LatLngTuple;
    carIds: string[];
}

type MapComponentProps = {
    center: L.LatLngTuple;
    cars: Car[];
    locations: Location[];
    userLocation: L.LatLngTuple | null;
    nearestLocation: Location | null;
    userIcon: L.Icon;
};

function MapFlyTo({ position }: { position: L.LatLngTuple }) {
    const map = useMap();
    map.flyTo(position, 13);
    return null;
}

export default function MapComponent({ center, cars, locations, userLocation, nearestLocation, userIcon }: MapComponentProps) {
    return (
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
    )
}
