import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroSearchForm } from '@/components/hero-search-form';
import { findCars } from '@/lib/data';
import { CarCard } from '@/components/car-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const featuredCars = findCars().slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-screen">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-fade-in-up">
            Urugendo rwawe, Imodoka yawe.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 animate-fade-in-up animation-delay-300">
            Kodesha imodoka ikunogeye kurugendo rwawe. Ibiciro byiza, ingendo zitabarika, hamwe no gukora booking byoroshye.
          </p>
          <div className="w-full max-w-4xl animate-fade-in-up animation-delay-600">
            <HeroSearchForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">Bikora bite</h2>
           <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Shaka Imodoka Yawe</h3>
                <p className="text-muted-foreground">Shakisha mu mahitamo yacu yagutse y'imodoka uhitemo ikujyanye.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Kora Booking Byoroshye</h3>
                <p className="text-muted-foreground">Hitamo amatariki yawe hanyuma ukore booking mu kanya gato.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ishimire Urugendo Rwawe</h3>
                <p className="text-muted-foreground">Fata imodoka yawe utangire urugendo. Biroroshye gutyo.</p>
              </div>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Imodoka z'Icyitegererezo</h2>
            <p className="text-muted-foreground mt-2">Reba imodoka zacu zakunzwe cyane.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} generateImage={true} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/browse">Reba Imodoka Zose</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
