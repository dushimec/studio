'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Car } from "@/lib/types";
import type { User } from "firebase/auth";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

const FormSchema = (t: any) => z.object({
  full_name: z.string().min(2, {
    message: t("Full name must be at least 2 characters."),
  }),
  phone_number: z.string().min(10, {
    message: t("Phone number must be at least 10 digits."),
  }),
  email: z.string().email(),
  car_id: z.string(),
  pickup_location: z.string(),
  dropoff_location: z.string(),
  pickup_date: z.date(),
  dropoff_date: z.date(),
}).refine((data) => data.dropoff_date > data.pickup_date, {
  message: t("Drop-off date must be after the pickup date."),
  path: ["dropoff_date"], 
});

export function BookingForm({ car, user }: { car: Car, user: User | null }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema(t)),
    defaultValues: {
      full_name: user?.displayName || "",
      phone_number: user?.phoneNumber || "",
      email: user?.email || "",
      car_id: car.id,
      pickup_location: car.location,
      dropoff_location: car.location,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit booking');
        }

        toast({
            title: t("Booking Successful!"),
            description: t("Your booking has been submitted and is pending approval."),
        });
        form.reset();
    } catch (error) {
        let errorMessage = t('An unknown error occurred.');
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast({
            title: t("Booking Failed"),
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="car_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Full Name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('John Doe')} {...field} />
                </FormControl>
                <FormDescription>
                  {t('Your full legal name.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Phone Number')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('123-456-7890')} {...field} />
                </FormControl>
                <FormDescription>
                  {t('Your contact phone number.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('youremail@example.com')} {...field} />
                </FormControl>
                <FormDescription>
                  {t('Your email address for booking confirmation.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickup_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Pickup Location')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('e.g., Airport')} {...field} />
                </FormControl>
                <FormDescription>
                  {t('Where you will pick up the car.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoff_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Drop-off Location')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('e.g., Downtown')} {...field} />
                </FormControl>
                <FormDescription>
                  {t('Where you will return the car.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickup_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('Pickup Date')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('Pick a date')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  {t('The start date of your booking.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoff_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('Drop-off Date')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('Pick a date')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  {t('The end date of your booking.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('Submitting...') : t('Submit')}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
