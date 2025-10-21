
import type { Car } from './types';

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
