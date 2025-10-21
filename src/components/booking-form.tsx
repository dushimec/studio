'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimePicker } from "./time-picker"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Car, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import React, { useMemo } from "react";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DateRange } from "react-day-picker";
import { isDateRangeAvailable } from "@/lib/availability";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phoneNumber: z.string().min(10, { message: "Please enter a valid phone number"}),
    email: z.string().email({ message: "Please enter a valid email address."}),
    pickupLocation: z.string().min(2, { message: "Please enter a pickup location."}),
    dropoffLocation: z.string().min(2, { message: "Please enter a drop-off location."}),
    pickupDate: z.date(),
    pickupTime: z.object({
        hour: z.number(),
        minute: z.number(),
    }),
    dropoffDate: z.date(),
    dropoffTime: z.object({
        hour: z.number(),
        minute: z.number(),
    }),
});


export function BookingForm({ car, owner, availableDates }: { car: Car, owner: User | null, availableDates: Date[] }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            pickupLocation: car.location, 
            dropoffLocation: car.location,
            pickupDate: new Date(),
            pickupTime: { hour: 10, minute: 0 },
            dropoffDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            dropoffTime: { hour: 10, minute: 0 },
        },
    });

    const pickupDateTime = useMemo(() => {
        const date = form.watch("pickupDate");
        const time = form.watch("pickupTime");
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute);
    }, [form]);

    const dropoffDateTime = useMemo(() => {
        const date = form.watch("dropoffDate");
        const time = form.watch("dropoffTime");
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute);
    }, [form]);


    const dayCount = useMemo(() => {
        const diff = dropoffDateTime.getTime() - pickupDateTime.getTime();
        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
    }, [pickupDateTime, dropoffDateTime]);

    const baseRate = useMemo(() => {
        return dayCount * car.pricePerDay;
    }, [dayCount, car.pricePerDay]);

    const serviceFee = 5000;
    const securityDeposit = 20000;

    const totalPrice = useMemo(() => {
        return baseRate + serviceFee + securityDeposit;
    }, [baseRate, serviceFee, securityDeposit]);


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to make a booking.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const bookingRange: DateRange = { from: pickupDateTime, to: dropoffDateTime };
        if (!isDateRangeAvailable(bookingRange, availableDates)) {
             toast({
                title: "Dates not available",
                description: "The selected date range is not available for this vehicle.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }


        try {
            await addDoc(collection(firestore, "bookings"), {
                carId: car.id,
                ownerId: car.ownerId,
                customerId: user.uid,
                customerInfo: {
                    fullName: values.fullName,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                },
                startDate: pickupDateTime.toISOString(),
                endDate: dropoffDateTime.toISOString(),
                pickupLocation: values.pickupLocation,
                dropoffLocation: values.dropoffLocation,
                totalPrice: totalPrice,
                status: "pending", // pending, approved, rejected, completed, cancelled
                createdAt: serverTimestamp(),
            });

            toast({
                title: t("Booking Successful!"),
                description: t("Your booking has been submitted and is pending approval."),
            });

        } catch (error) {
            console.error("Error creating booking: ", error);
            toast({
                title: t("Booking Failed"),
                description: (error as Error).message || t("An unknown error occurred."),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isUserLoading) {
        return <p>{t('Loading...')}</p>; 
    }

    if (!user) {
        return (
            <div className="text-center">
                <p className="mb-4">{t('Please log in to book this car.')}</p>
                <Button asChild>
                    <Link href="/login">{t('Login')}</Link>
                </Button>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[70vh] pr-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Full Name')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('John Doe')} {...field} />
                            </FormControl>
                            <FormDescription>{t('Your full legal name.')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Phone Number')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('123-456-7890')} {...field} />
                            </FormControl>
                            <FormDescription>{t('Your contact phone number.')}</FormDescription>
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
                                <Input placeholder="youremail@example.com" {...field} />
                            </FormControl>
                            <FormDescription>{t("Your email address for booking confirmation.")}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="pickupDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('Start Date')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
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
                                            disabled={(date) => date < new Date() || !availableDates.find(d => d.toDateString() === date.toDateString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pickupTime"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('Pickup Time')}</FormLabel>
                                <FormControl>
                                     <TimePicker value={field.value} onChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dropoffDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('End Date')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
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
                                            disabled={(date) => date < pickupDateTime || !availableDates.find(d => d.toDateString() === date.toDateString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dropoffTime"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t('Dropoff Time')}</FormLabel>
                                <FormControl>
                                     <TimePicker value={field.value} onChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Pickup Location')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('e.g., Airport')} {...field} />
                            </FormControl>
                            <FormDescription>{t('Where you will pick up the car.')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <h3 className="font-bold text-lg">{t('Pricing Details')}</h3>
                    <div className="flex justify-between">
                        <span>{t('Base Rate')} ({dayCount} {dayCount > 1 ? t('days') : t('day')})</span>
                        <span>{baseRate.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('Service Fee')}</span>
                        <span>{serviceFee.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('Security Deposit')}</span>
                        <span>{securityDeposit.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t('Total')}</span>
                        <span>{totalPrice.toLocaleString()} RWF</span>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading || isUserLoading}>
                {isLoading ? t('Submitting...') : t('Submit')}
                </Button>
            </form>
        </Form>
        </ScrollArea>
    );
}
