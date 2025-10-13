'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSmartRecommendations, SmartRecommendationsOutput } from '@/ai/flows/smart-recommendation-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const recommendationFormSchema = z.object({
  priceRange: z.string().min(1, 'Igiciro ni ngombwa.'),
  carType: z.string().min(1, 'Ubwoko bw\'imodoka ni ngombwa.'),
  features: z.string().min(1, 'Andika byibuze ikintu kimwe kiranga imodoka.'),
  purpose: z.string().min(1, 'Impamvu yo gukodesha ni ngombwa.'),
  location: z.string().min(1, 'Aho uherereye ni ngombwa.'),
});

type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<SmartRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      priceRange: '65000-130000',
      carType: 'SUV',
      features: 'GPS, Bluetooth',
      purpose: 'Urugendo rw\'umuryango',
      location: 'Kigali, Rwanda',
    },
  });

  async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await getSmartRecommendations(data);
      setRecommendations(result);
    } catch (e) {
      setError('Ntibyakunze kubona inama. Gerageza nanone.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold mb-2">Inama Zisobanutse</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tubwire ibyo ukeneye, AI yacu izagushakira imodoka ikunogeye.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Ibyo ukunda</CardTitle>
            <CardDescription>Uzuza iyi fomu kugirango utangire.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Igiciro (RWF/ku munsi)</FormLabel>
                      <FormControl>
                        <Input placeholder="urugero, 65000-130000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubwoko bw'imodoka</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Hitamo ubwoko bw'imodoka" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Convertible">Convertible</SelectItem>
                           <SelectItem value="Truck">Ikamyo</SelectItem>
                          <SelectItem value="Any">Icyo aricyo cyose</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ibyo yifuzwaho</FormLabel>
                      <FormControl>
                        <Textarea placeholder="urugero, GPS, Apple CarPlay, Sunroof" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impamvu yo gukodesha</FormLabel>
                      <FormControl>
                        <Input placeholder="urugero, Urugendo rw'akazi, Urugendo rw'umuryango" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aho muherereye</FormLabel>
                      <FormControl>
                        <Input placeholder="urugero, Kigali, Rwanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Shaka Inama
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 rounded-lg border-2 border-dashed">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">AI yacu irimo kugushakira imodoka nziza...</p>
            </div>
          )}
          {error && <p className="text-destructive text-center p-8">{error}</p>}
          {recommendations && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Inama Z'ingenzi Kuri Wowe</h2>
              {recommendations.recommendations.map((rec, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{rec.carName}</CardTitle>
                        <CardDescription>{rec.rentalCompany}</CardDescription>
                      </div>
                      <div className="text-right">
                          <p className="text-2xl font-bold">{rec.price.toLocaleString()} RWF</p>
                          <p className="text-sm text-muted-foreground">/ku munsi</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm">{rec.reasoning}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-muted-foreground">Igereranya:</p>
                        <Progress value={rec.suitabilityScore * 100} className="w-[100px]" />
                        <span className="text-sm font-semibold">{Math.round(rec.suitabilityScore * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && !recommendations && !error && (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground p-8 text-center">Inama zawe bwite zizagaragara hano.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
