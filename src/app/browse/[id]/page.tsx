import Image from 'next/image';
import { notFound } from 'next/navigation';
import { findCarById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Users, Fuel, Cog, Gauge } from 'lucide-react';

type CarDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = findCarById(params.id);

  if (!car) {
    notFound();
  }

  const carImages = car.images.map(imgId => PlaceHolderImages.find(p => p.id === imgId)).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {carImages.length > 0 ? carImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3]">
                    {img && (
                      <Image
                        src={img.imageUrl}
                        alt={`${car.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={img.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                </CarouselItem>
              )) : (
                 <CarouselItem>
                  <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Nta foto ibonetse</span>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-2">{car.name}</h1>
          <Badge variant="outline" className="text-lg">{car.type}</Badge>
          <p className="mt-4 text-lg text-muted-foreground">{car.description}</p>
          
          <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-card rounded-lg border">
              <Users className="w-8 h-8 mx-auto text-primary mb-2"/>
              <p className="font-semibold">Imyanya {car.seats}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <Fuel className="w-8 h-8 mx-auto text-primary mb-2"/>
              <p className="font-semibold">{car.fuel}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <Cog className="w-8 h-8 mx-auto text-primary mb-2"/>
              <p className="font-semibold">{car.transmission}</p>
            </div>
             <div className="p-4 bg-card rounded-lg border">
              <Gauge className="w-8 h-8 mx-auto text-primary mb-2"/>
              <p className="font-semibold">Zitabarika</p>
              <p className="text-xs text-muted-foreground">Ingendo</p>
            </div>
          </div>
          
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle>Kora Booking Y'urugendo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">{car.pricePerDay.toLocaleString()} RWF</span>
                <span className="text-sm text-muted-foreground"> / ku munsi</span>
              </div>
              <Button size="lg" className="text-lg">Komeza ukore Booking</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Iby'ingenzi</h2>
          <ul className="space-y-2">
            {car.features.map((feature, i) => (
              <li key={i} className="flex items-center text-lg">
                <CheckCircle2 className="w-5 h-5 mr-3 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Amategeko yo gukodesha</h2>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Ibisabwa utwara</AccordionTrigger>
              <AccordionContent>
                Abashoferi bose bagomba kuba bafite byibuze imyaka 21 kandi bafite uruhushya rwo gutwara ibinyabiziga rwemewe.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Amategeko y'ubwishingizi</AccordionTrigger>
              <AccordionContent>
                Ubwishingizi bw'ibanze burimo. Ubundi buryo bwo kwishingira buboneka ku biro byo gukodesha.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Amategeko ya lisansi</AccordionTrigger>
              <AccordionContent>
                Ikigomba gusubizwa gifite lisansi ingana niyicyatwaranye kugirango wirinde kwishyuzwa ibindi.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
