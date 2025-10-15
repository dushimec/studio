
'use client';
import type { Car, Booking, Location, User } from './types';
import { useState, useCallback } from 'react';

const initialCars: Car[] = [
  {
    id: '1',
    name: 'Stark SUV 2024',
    brand: 'Cadillac',
    year: 2024,
    type: 'SUV',
    pricePerDay: 110500,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Bluetooth', 'Heated Seats'],
    images: ['https://www.topgear.com/sites/default/files/2024/02/2024-cadillac-escalade-v-series-010.jpg'],
    description: 'Experience the perfect blend of luxury and performance with the Stark SUV. Ideal for family trips or navigating city streets in style.',
    rentalCompany: 'Apex Rentals',
    availability: 'Available',
    ownerId: 'admin@gmail.com',
  },
  {
    id: '2',
    name: 'Orion Sedan',
    brand: 'Volkswagen',
    year: 2023,
    type: 'Sedan',
    pricePerDay: 91000,
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'Apple CarPlay', 'Cruise Control'],
    images: ['https://spn-sta.spinny.com/blog/20220308152631/VW-Virtus-launch.jpg'],
    description: 'The Orion Sedan offers a smooth, efficient ride with modern amenities. Perfect for business trips or a comfortable commute.',
    rentalCompany: 'Starlight Drives',
    availability: 'Booked',
    ownerId: 'dush@gmail.com',
  },
  {
    id: '3',
    name: 'Pulsar Hatchback',
    brand: 'Honda',
    year: 2025,
    type: 'Hatchback',
    pricePerDay: 71500,
    seats: 4,
    fuel: 'Gasoline',
    transmission: 'Manual',
    features: ['Air Conditioning', 'Bluetooth'],
    images: ['https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2025/03/2025-honda-civic-hatchback.jpg'],
    description: 'A zippy and economical choice for city driving. The Pulsar Hatchback is easy to park and fun to drive.',
    rentalCompany: 'City Wheels',
    availability: 'Available',
    ownerId: 'dush@gmail.com',
  },
  {
    id: '4',
    name: 'Comet Convertible',
    brand: 'BMW',
    year: 2024,
    type: 'Convertible',
    pricePerDay: 156000,
    seats: 2,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Premium Sound System'],
    images: ['https://www.lloydmotorgroup.com/VehicleLibrary/101011-Nosg28I8e0Szk5DNrHxnAg.jpg'],
    description: 'Feel the wind in your hair with the Comet Convertible. The ultimate car for a scenic coastal drive or a weekend getaway.',
    rentalCompany: 'Apex Rentals',
    availability: 'Maintenance',
    ownerId: 'admin@gmail.com',
  },
  {
    id: '5',
    name: 'Titan Truck',
    brand: 'Ford',
    year: 2022,
    type: 'Truck',
    pricePerDay: 123500,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'Towing Package', '4x4 Drive'],
    images: ['https://www.investopedia.com/thmb/eQJIp9UXcrxlTiPyO9VD0cJ_w9E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cq5dam.web.3840.3840-bf2160fea77047d79ef249e4db3565fc.jpeg'],
    description: 'For heavy-duty needs or off-road adventures, the Titan Truck delivers power and reliability.',
    rentalCompany: 'Rugged Rides',
    availability: 'Available',
    ownerId: 'dush@gmail.com',
  },
  {
    id: '6',
    name: 'Galaxy SUV',
    brand: 'Geely',
    year: 2024,
    type: 'SUV',
    pricePerDay: 117000,
    seats: 7,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Third-Row Seating', 'Sunroof'],
    images: ['https://console.kr-asia.com/wp-content/uploads/2024/12/Geely-Galaxy-Starship-7-EM-i.jpg'],
    description: 'The spacious Galaxy SUV is perfect for large families or groups, offering comfort and versatility for any journey.',
    rentalCompany: 'Starlight Drives',
    availability: 'Available',
    ownerId: 'admin@gmail.com',
  },
];

const initialBookings: Booking[] = [
  {
    id: 'booking1',
    carId: '2',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-08-15'),
    totalPrice: 455000,
    status: 'Upcoming',
  },
  {
    id: 'booking2',
    carId: '5',
    startDate: new Date('2024-06-20'),
    endDate: new Date('2024-06-25'),
    totalPrice: 617500,
    status: 'Completed',
  },
  {
    id: 'booking3',
    carId: '1',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-03'),
    totalPrice: 221000,
    status: 'Upcoming',
  },
    {
    id: 'booking4',
    carId: '6',
    startDate: new Date('2024-07-28'),
    endDate: new Date('2024-08-02'),
    totalPrice: 585000,
    status: 'Active',
  },
];

const initialLocations: Location[] = [
  { id: '1', name: 'Kigali International Airport', position: [-1.9639, 30.1344], carIds: ['1', '2'] },
  { id: '2', name: 'Kigali City Center', position: [-1.9441, 30.0619], carIds: ['3', '4'] },
  { id: '3', name: 'Gisenyi/Rubavu', position: [-1.7000, 29.2500], carIds: ['5'] },
  { id: '4', name: 'Butare/Huye', position: [-2.6000, 29.7400], carIds: ['6'] },
];


const initialUsers: User[] = [
    { id: 'user-dushime', name: 'Dushime', email: 'dushime@gmail.com', role: 'user' },
    { id: 'owner-dush', name: 'Dush', email: 'dush@gmail.com', role: 'owner' },
    { id: 'admin-admin', name: 'Admin', email: 'admin@gmail.com', role: 'admin' },
];

let cars: Car[] = [...initialCars];
let bookings: Booking[] = [...initialBookings];
let locations: Location[] = [...initialLocations];
let users: User[] = [...initialUsers];

// This hook provides a reactive state for the mock data and functions to manipulate it.
export function useMockData() {
    const [data, setData] = useState({ cars, bookings, locations, users });

    const forceUpdate = () => setData({
      cars: [...cars],
      bookings: [...bookings],
      locations: [...locations],
      users: [...users]
    });

    const updateUser = useCallback((updatedUser: User) => {
        users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        forceUpdate();
    }, []);

    const deleteUser = useCallback((userId: string) => {
        users = users.filter(u => u.id !== userId);
        forceUpdate();
    }, []);

    const addCar = useCallback((newCar: Car) => {
        cars.unshift(newCar);
        forceUpdate();
    }, []);

    const updateCar = useCallback((updatedCar: Car) => {
        cars = cars.map(c => c.id === updatedCar.id ? updatedCar : c);
        forceUpdate();
    }, []);
    
    const deleteCar = useCallback((carId: string) => {
        cars = cars.filter(c => c.id !== carId);
        // Also remove from locations
        locations.forEach(loc => {
            loc.carIds = loc.carIds.filter(id => id !== carId);
        });
        forceUpdate();
    }, []);

    const addBooking = useCallback((newBooking: Booking) => {
        bookings.unshift(newBooking);
        forceUpdate();
    }, []);
    
    const findCarById = useCallback((id: string): Car | undefined => {
      return data.cars.find(car => car.id === id);
    }, [data.cars]);

    return {
        cars: data.cars,
        bookings: data.bookings,
        locations: data.locations,
        users: data.users,
        updateUser,
        deleteUser,
        addCar,
        updateCar,
        deleteCar,
        addBooking,
        findCarById,
    };
}

export function findCars() {
  return cars;
}

export function findBookings() {
    return bookings;
}
    
