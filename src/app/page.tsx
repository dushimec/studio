
'use client';

import { HeroSearchForm } from '@/components/hero-search-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { CarCard } from '@/components/car-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import type { Car } from '@/lib/types';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const carsQuery = useMemoFirebase(() => collection(firestore, 'cars'), [firestore]);
  const { data: cars, isLoading } = useCollection<Car>(carsQuery);
  const featuredCars = cars?.slice(0, 3) || [];

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
            {t('We Go - Your Journey, Your Car.')}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mb-8 animate-fade-in-up animation-delay-300">
            {t('We Go is an online platform that allows people in Rwanda to easily rent cars for travel, business, or tourism. We connect car owners directly with customers, making car rental simple, safe, and reliable.')}
          </p>
          <div className="w-full max-w-4xl animate-fade-in-up animation-delay-600">
            <HeroSearchForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">{t('How It Works')}</h2>
           <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                   <span className="material-symbols-outlined text-4xl text-primary">search</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('1. Find Your Car')}</h3>
                <p className="text-muted-foreground">{t('Visit the website, search for a car, and check if it’s available for your desired dates.')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">calendar_month</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('2. Book with Ease')}</h3>
                <p className="text-muted-foreground">{t('Send a booking request. The car owner or admin will review and approve it.')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">directions_car</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('3. Enjoy Your Ride')}</h3>
                <p className="text-muted-foreground">{t('Once approved, pick up the car at the agreed location and start your journey.')}</p>
              </div>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('Featured Cars')}</h2>
            <p className="text-muted-foreground mt-2">{t('Check out our most popular cars.')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <CarCard key={i} car={null} />)
            ) : (
              featuredCars.map((car) => (
                <CarCard key={car.id} car={car} generateImage={true} />
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/browse">{t('Browse All Cars')}</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">{t('About Us')}</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                 <span className="material-symbols-outlined text-4xl text-primary">track_changes</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{t('Our Mission')}</h3>
              <p className="text-muted-foreground">{t('To simplify transportation access in Rwanda by providing a trustworthy online platform where customers can easily find cars for rent and owners can reach more clients.')}</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <span className="material-symbols-outlined text-4xl text-primary">visibility</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{t('Our Vision')}</h3>
              <p className="text-muted-foreground">{t('To become Rwanda’s leading and most trusted digital car rental service — making car rentals accessible to anyone, anywhere, anytime.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">{t('Why Choose Us?')}</h2>
           <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                   <span className="material-symbols-outlined text-4xl text-primary">thumb_up</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('Simple Booking')}</h3>
                <p className="text-muted-foreground">{t('Our booking process is fast, straightforward, and can be completed in just a few clicks.')}</p>
              </div>
              <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">verified_user</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('Verified Owners')}</h3>
                <p className="text-muted-foreground">{t('We partner with reliable and verified car owners to ensure your safety and satisfaction.')}</p>
              </div>
              <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-lg transition-.shadow">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">schedule</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('Clear Availability')}</h3>
                <p className="text-muted-foreground">{t('See which cars are available in real-time, so you can plan your trip without any guesswork.')}</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
