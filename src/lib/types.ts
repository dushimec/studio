export type Car = {
  id: string;
  name: string;
  type: 'SUV' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Truck';
  pricePerDay: number;
  seats: number;
  fuel: 'Gasoline' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  features: string[];
  images: string[];
  description: string;
  rentalCompany: string;
};

export type Booking = {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
};

export type Location = {
    id: string;
    name: string;
    position: [number, number];
    carIds: string[];
};
