'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { findCars } from '@/lib/data';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const locations = [
  { id: '1', name: 'Kigali International Airport', position: [-1.9639, 30.1344], carIds: ['1', '2'] },
  { id: '2', name: 'Kigali City Center', position: [-1.9441, 30.0619], carIds: ['3', '4'] },
  { id: '3', name: 'Gisenyi/Rubavu', position: [-1.7000, 29.2500], carIds: ['5'] },
  { id: '4', name: 'Butare/Huye', position: [-2.6000, 29.7400], carIds: ['6'] },
];

export default function MapPage() {
  const cars = findCars();
  const center: L.LatLngTuple = [-1.9441, 30.0619];

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold mb-2">Rental Map of Rwanda</h1>
        <p className="text-lg text-muted-foreground">Explore our car rental locations across the country.</p>
      </div>
      <Card className="overflow-hidden">
        <div className="h-[600px] w-full">
          <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(location => (
              <Marker key={location.id} position={location.position}>
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
          </MapContainer>
        </div>
      </Card>
    </div>
  );
}
