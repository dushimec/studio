
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Car } from '@/lib/types';
import { CarCard } from '@/components/car-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export function BrowseGrid() {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const carsQuery = useMemoFirebase(() => collection(firestore, 'cars'), [firestore]);
  const { data: allCars, isLoading } = useCollection<Car>(carsQuery);
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<Car[] | null>(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [fuelType, setFuelType] = useState('all');
  const [brand, setBrand] = useState('all');
  const [seats, setSeats] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortOrder, setSortOrder] = useState('any');

  const brands = useMemo(() => {
    if (!allCars) return ['all'];
    return ['all', ...Array.from(new Set(allCars.map(car => car.brand)))];
  }, [allCars]);

  useEffect(() => {
    if (!allCars) return;

    let cars = [...allCars];

    if (searchTerm) {
      cars = cars.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (fuelType !== 'all') {
      cars = cars.filter(car => car.fuelType === fuelType);
    }
    if (brand !== 'all') {
        cars = cars.filter(car => car.brand === brand);
    }
    if (seats !== 'all') {
        cars = cars.filter(car => car.seats >= parseInt(seats));
    }
    cars = cars.filter(car => car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]);
    if (sortOrder === 'low-to-high') {
        cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortOrder === 'high-to-low') {
        cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    setFilteredCars(cars);
  }, [searchTerm, fuelType, brand, seats, priceRange, sortOrder, allCars]);


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">{t('Browse Our Fleet')}</h1>
        <p className="text-lg text-muted-foreground">{t('Find the perfect car for your journey.')}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4">
          <div className="p-4 bg-card rounded-lg border space-y-6 sticky top-24">
            <h3 className="text-xl font-semibold">{t('Search & Filter')}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Search by name')}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">search</span>
                <Input placeholder={t('e.g., Toyota RAV4')} className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Fuel Type')}</label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Types')}</SelectItem>
                  <SelectItem value="Gasoline">{t('Gasoline')}</SelectItem>
                  <SelectItem value="Diesel">{t('Diesel')}</SelectItem>
                  <SelectItem value="Hybrid">{t('Hybrid')}</SelectItem>
                  <SelectItem value="Electric">{t('Electric')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
             <div className="space-y-2">
              <label className="text-sm font-medium">{t('Brand')}</label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b} value={b}>{b === 'all' ? t('All Brands') : b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t('Seats')}</label>
                <Select value={seats} onValueChange={setSeats}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('Any')}</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                        <SelectItem value="7">7+</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium">{t('Price Range (RWF/day)')}</label>
              <Slider
                min={0}
                max={200000}
                step={5000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()}</span>
                <span>{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Sort by price')}</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t('Relevance')}</SelectItem>
                  <SelectItem value="low-to-high">{t('Low to High')}</SelectItem>
                  <SelectItem value="high-to-low">{t('High to Low')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <main className="lg:w-3/4">
            {isLoading || !filteredCars ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => <CarCard key={i} car={null} />)}
                </div>
            ) : filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">{t('No Cars Found')}</h2>
                    <p className="text-muted-foreground">{t('Try adjusting your filters to find the perfect car.')}</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
