'use client';

import { useState } from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

export function HeroSearchForm() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-2xl">
      <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">Location</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">location_on</span>
            <Input id="location" placeholder="City, address, or postal code" className="pl-10 h-12" />
          </div>
        </div>
        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-foreground mb-1">Pickup & Return</label>
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
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" size="lg" className="w-full h-12 text-base">
            <span className="material-symbols-outlined mr-2 h-5 w-5">search</span>
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
