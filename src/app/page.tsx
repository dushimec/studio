
import { HeroSearchForm } from '@/components/hero-search-form';
import { findCars } from '@/lib/data';
import { CarCard } from '@/components/car-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Calendar, Car } from 'lucide-react';

export default function Home() {
  const featuredCars = findCars().slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-screen overflow-hidden">
        <video
          src="https://res.cloudinary.com/drwi9cpdi/video/upload/v1760387629/202510132120_siq18y.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-fade-in-up">
            Your Journey, Your Car.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 animate-fade-in-up animation-delay-300">
            Rent the perfect car for your next adventure. Best prices, unlimited mileage, and easy booking.
          </p>
          <div className="w-full max-w-4xl animate-fade-in-up animation-delay-600">
            <HeroSearchForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
           <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                   <Search className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Your Car</h3>
                <p className="text-muted-foreground">Browse our wide selection of cars and choose the one that fits your needs.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book with Ease</h3>
                <p className="text-muted-foreground">Select your dates and book your car in just a few clicks.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <Car className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
                <p className="text-muted-foreground">Pick up your car and start your journey. It's that simple.</p>
              </div>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Cars</h2>
            <p className="text-muted-foreground mt-2">Check out our most popular cars.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} generateImage={true} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/browse">Browse All Cars</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
