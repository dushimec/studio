
'use server';

import { z } from 'zod';
import { admin, firestore } from '@/firebase/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const BookingSchema = z.object({
  carId: z.string(),
  customerId: z.string(),
  ownerId: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

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
    if (!carData) {
        throw new Error('Car data not found');
    }

    // Availability Check
    const newStartDate = new Date(parsedData.startDate);
    const newEndDate = new Date(parsedData.endDate);

    if (carData.availabilityDates && carData.availabilityDates.length > 0) {
        for (const existingRange of carData.availabilityDates) {
            const existingStartDate = new Date(existingRange.start);
            const existingEndDate = new Date(existingRange.end);

            if (newStartDate <= existingEndDate && newEndDate >= existingStartDate) {
                throw new Error('Car is unavailable for the selected dates.');
            }
        }
    }

    const bookingDuration = (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 3600 * 24) + 1;
    const totalPrice = bookingDuration * carData.pricePerDay;

    const newBooking = {
      ...parsedData,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    transaction.set(bookingRef, newBooking);
    transaction.update(carRef, {
        availabilityDates: FieldValue.arrayUnion({ start: parsedData.startDate, end: parsedData.endDate }),
    });

    // Create a notification for the car owner
    const notificationRef = firestore.collection('notifications').doc();
    transaction.set(notificationRef, {
        userId: parsedData.ownerId,
        type: 'NEW_BOOKING_REQUEST',
        bookingId: bookingRef.id,
        message: `You have a new booking request from ${parsedData.fullName}.`,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
    });

    return { id: bookingRef.id, ...newBooking };
  });
}
