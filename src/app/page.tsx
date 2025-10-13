import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroSearchForm } from '@/components/hero-search-form';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
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
            Your Journey, Your Car.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 animate-fade-in-up animation-delay-300">
            Rent the perfect car for your next adventure. Unbeatable prices, unlimited miles, and flexible bookings.
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
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Your Car</h3>
                <p className="text-muted-foreground">Search our wide selection of vehicles and find the one that fits your needs.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book with Ease</h3>
                <p className="text-muted-foreground">Select your dates and book your car in just a few clicks.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
                <p className="text-muted-foreground">Pick up your car and hit the road. It's that simple.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
