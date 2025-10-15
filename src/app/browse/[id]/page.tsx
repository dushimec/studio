
'use client';

import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useMockData } from '@/lib/data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Car, Booking } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format, differenceInCalendarDays } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

const getAvailabilityProps = (availability: Car['availability']) => {
    switch (availability) {
        case 'Available':
            return { icon: 'verified_user', text: 'Available', color: 'text-green-500', bgColor: 'bg-green-500/10' };
        case 'Booked':
            return { icon: 'lock', text: 'Booked', color: 'text-red-500', bgColor: 'bg-red-500/10' };
        case 'Maintenance':
            return { icon: 'build', text: 'Under Maintenance', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
        default:
            return { icon: 'verified_user', text: 'Available', color: 'text-green-500', bgColor: 'bg-green-500/10' };
    }
}

export default function CarDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { findCarById, addBooking, updateCar } = useMockData();
  const car = findCarById(id);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<DateRange | undefined>();
  const [isBooking, setIsBooking] = useState(false);

  if (!car) {
    notFound();
  }
  
  const numberOfDays = date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) + 1 : 0;
  const totalPrice = numberOfDays * car.pricePerDay;

  const handleBooking = () => {
    if (!user || !date?.from || !date?.to || !car) return;
    
    setIsBooking(true);

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      carId: car.id,
      startDate: date.from,
      endDate: date.to,
      totalPrice,
      status: 'Upcoming',
    };
    
    // Simulate API call
    setTimeout(() => {
        addBooking(newBooking);
        updateCar({ ...car, availability: 'Booked' });

        toast({
            title: "Booking Successful!",
            description: `Your booking for the ${car.name} has been confirmed.`,
        });

        router.push('/booking');
        setIsBooking(false);
    }, 1500);
  };

  const carImages = car.images;
  const availability = getAvailabilityProps(car.availability);

  const renderBookingButton = () => {
    if (car.availability !== 'Available') {
      return <Button size="lg" className="text-lg" disabled>Not Available</Button>;
    }
    if (user) {
      return <Button size="lg" className="text-lg" onClick={handleBooking} disabled={!date?.from || !date?.to || isBooking}>
         {isBooking ? <span className="material-symbols-outlined mr-2 h-4 w-4 animate-spin">progress_activity</span> : 'Book Now'}
      </Button>;
    }
    return (
      <Button size="lg" className="text-lg" asChild>
        <Link href="/login">Login to Book</Link>
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {carImages.length > 0 ? carImages.map((imgUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={imgUrl}
                      alt={`${car.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              )) : (
                 <CarouselItem>
                  <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        
        <div>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-2">{car.name}</h1>
              <p className="text-lg text-muted-foreground">{car.brand} - {car.year}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${availability.bgColor} ${availability.color}`}>
              <span className="material-symbols-outlined text-lg">{availability.icon}</span>
              <span className="font-semibold">{availability.text}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-md mt-2">{car.type}</Badge>
          <p className="mt-4 text-lg text-muted-foreground">{car.description}</p>
          
          <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-card rounded-lg border">
              <span className="material-symbols-outlined text-3xl text-primary mb-2 mx-auto">group</span>
              <p className="font-semibold">{car.seats} Seats</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <span className="material-symbols-outlined text-3xl text-primary mb-2 mx-auto">local_gas_station</span>
              <p className="font-semibold">{car.fuel}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <span className="material-symbols-outlined text-3xl text-primary mb-2 mx-auto">settings</span>
              <p className="font-semibold">{car.transmission}</p>
            </div>
             <div className="p-4 bg-card rounded-lg border">
              <span className="material-symbols-outlined text-3xl text-primary mb-2 mx-auto">speed</span>
              <p className="font-semibold">Unlimited</p>
              <p className="text-xs text-muted-foreground">Mileage</p>
            </div>
          </div>
          
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle>Start Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
               {car.availability === 'Available' && user && (
                 <div className="grid gap-2">
                    <label className="text-sm font-medium">Select Dates</label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant="outline"
                            className={cn(
                            'w-full justify-start text-left font-normal h-12',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <span className="material-symbols-outlined mr-2 h-4 w-4">calendar_month</span>
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                            ) : (
                            <span>Pick your dates</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price per day</p>
                  <span className="text-xl font-bold">{car.pricePerDay.toLocaleString()} RWF</span>
                </div>
                {numberOfDays > 0 && (
                   <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total for {numberOfDays} day(s)</p>
                        <span className="text-3xl font-bold">{totalPrice.toLocaleString()} RWF</span>
                   </div>
                )}
              </div>
               <div className="pt-2">
                 {renderBookingButton()}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-2">
            {car.features.map((feature, i) => (
              <li key={i} className="flex items-center text-lg">
                <span className="material-symbols-outlined w-5 h-5 mr-3 text-primary">check_circle</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Rental Policies</h2>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Driver Requirements</AccordionTrigger>
              <AccordionContent>
                All drivers must be at least 21 years old and hold a valid driver's license.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Insurance Policy</AccordionTrigger>
              <AccordionContent>
                Basic insurance is included. Additional coverage options are available at the rental desk.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Fuel Policy</AccordionTrigger>
              <AccordionContent>
                The vehicle must be returned with the same amount of fuel as at the start of the rental to avoid refueling charges.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
