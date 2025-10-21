
import type { Car } from './types';
import type { DateRange } from 'react-day-picker';

export function isCarAvailable(car: Car): boolean {
  if (!car.availabilityDates || car.availabilityDates.length === 0) {
    return car.available; 
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const unavailability of car.availabilityDates) {
    const startDate = new Date(unavailability.start);
    const endDate = new Date(unavailability.end);
    if (today >= startDate && today <= endDate) {
      return false; // Currently unavailable
    }
  }

  return true; // Available
}

export function isDateRangeAvailable(range: DateRange, availableDates: Date[]): boolean {
  if (!range.from || !range.to) {
    return false;
  }

  const startDate = new Date(range.from);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(range.to);
  endDate.setHours(0, 0, 0, 0);

  const availableDateSet = new Set(availableDates.map(d => new Date(d).toDateString()));

  let currentDate = startDate;
  while (currentDate <= endDate) {
    if (!availableDateSet.has(currentDate.toDateString())) {
      return false;
    }
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return true;
}
