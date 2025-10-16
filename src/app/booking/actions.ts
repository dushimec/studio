
'use server';

import { z } from 'zod';
import { admin, firestore } from '@/firebase/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const BookingSchema = z.object({
  carId: z.string(),
  customerId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number(),
});

function getDatesInRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

export async function submitBooking(bookingData: any) {
  const parsedData = BookingSchema.parse(bookingData);

  const bookingRef = firestore.collection('bookings').doc();
  const carRef = firestore.collection('cars').doc(parsedData.carId);

  return await firestore.runTransaction(async (transaction) => {
    const carDoc = await transaction.get(carRef);
    if (!carDoc.exists) {
      throw new Error('Car not found');
    }

    const carData = carDoc.data();

    const unavailableDates = getDatesInRange(new Date(parsedData.startDate), new Date(parsedData.endDate));

    const newBooking = {
      ...parsedData,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    };

    transaction.set(bookingRef, newBooking);
    transaction.update(carRef, {
      unavailableDates: FieldValue.arrayUnion(...unavailableDates),
    });

    return { id: bookingRef.id, ...newBooking };
  });
}
