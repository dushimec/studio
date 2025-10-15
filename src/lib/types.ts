

export type Car = {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuelType: 'Gasoline' | 'Electric' | 'Hybrid' | 'Diesel';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  images: string[];
  location: string;
  available: boolean;
  availabilityDates?: { start: string; end: string }[];
  description: string;
  features: string[];
};

export type Booking = {
  id: string;
  carId: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'customer' | 'owner' | 'admin';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'booking_update' | 'system_alert';
    read: boolean;
    createdAt: string;
};

export type Review = {
    id: string;
    bookingId: string;
    carId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type Location = {
    id: string;
    name: string;
    position: [number, number];
    carIds: string[];
};
