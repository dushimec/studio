import type { Car, Booking } from './types';

export const cars: Car[] = [
  {
    id: '1',
    name: 'Stark SUV 2024',
    type: 'SUV',
    pricePerDay: 85,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Bluetooth', 'Heated Seats'],
    images: ['car-suv-1', 'car-suv-2'],
    description: 'Experience the perfect blend of luxury and performance with the Stark SUV. Ideal for family trips or navigating city streets in style.',
    rentalCompany: 'Apex Rentals',
  },
  {
    id: '2',
    name: 'Orion Sedan',
    type: 'Sedan',
    pricePerDay: 70,
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'Apple CarPlay', 'Cruise Control'],
    images: ['car-sedan-1'],
    description: 'The Orion Sedan offers a smooth, efficient ride with modern amenities. Perfect for business trips or a comfortable commute.',
    rentalCompany: 'Starlight Drives',
  },
  {
    id: '3',
    name: 'Pulsar Hatchback',
    type: 'Hatchback',
    pricePerDay: 55,
    seats: 4,
    fuel: 'Gasoline',
    transmission: 'Manual',
    features: ['Air Conditioning', 'Bluetooth'],
    images: ['car-hatchback-1'],
    description: 'A zippy and economical choice for city driving. The Pulsar Hatchback is easy to park and fun to drive.',
    rentalCompany: 'City Wheels',
  },
  {
    id: '4',
    name: 'Comet Convertible',
    type: 'Convertible',
    pricePerDay: 120,
    seats: 2,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Premium Sound System'],
    images: ['car-convertible-1'],
    description: 'Feel the wind in your hair with the Comet Convertible. The ultimate car for a scenic coastal drive or a weekend getaway.',
    rentalCompany: 'Apex Rentals',
  },
  {
    id: '5',
    name: 'Titan Truck',
    type: 'Truck',
    pricePerDay: 95,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'Towing Package', '4x4 Drive'],
    images: ['car-truck-1'],
    description: 'For heavy-duty needs or off-road adventures, the Titan Truck delivers power and reliability.',
    rentalCompany: 'Rugged Rides',
  },
  {
    id: '6',
    name: 'Galaxy SUV',
    type: 'SUV',
    pricePerDay: 90,
    seats: 7,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Third-Row Seating', 'Sunroof'],
    images: ['car-suv-2', 'car-suv-1'],
    description: 'The spacious Galaxy SUV is perfect for large families or groups, offering comfort and versatility for any journey.',
    rentalCompany: 'Starlight Drives',
  },
];

export const bookings: Booking[] = [
  {
    id: 'booking1',
    carId: '2',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-08-15'),
    totalPrice: 350,
    status: 'Upcoming',
  },
  {
    id: 'booking2',
    carId: '5',
    startDate: new Date('2024-06-20'),
    endDate: new Date('2024-06-25'),
    totalPrice: 475,
    status: 'Completed',
  },
  {
    id: 'booking3',
    carId: '1',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-03'),
    totalPrice: 170,
    status: 'Upcoming',
  },
];

export function findCarById(id: string): Car | undefined {
  return cars.find(car => car.id === id);
}

export function findBookings(): Booking[] {
  return bookings;
}

export function findCars(): Car[] {
  return cars;
}
