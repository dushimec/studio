
'use client';

import { useAuth } from '@/context/auth-context';
import { useMockData } from '@/lib/data';
import type { Car, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard-layout';


const carFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  year: z.coerce.number().min(1900, 'Invalid year'),
  type: z.enum(['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Truck']),
  pricePerDay: z.coerce.number().min(0, 'Price must be positive'),
  seats: z.coerce.number().min(1, 'At least 1 seat'),
  fuel: z.enum(['Gasoline', 'Electric', 'Hybrid']),
  transmission: z.enum(['Automatic', 'Manual']),
  description: z.string().min(1, 'Description is required'),
  availability: z.enum(['Available', 'Booked', 'Maintenance']),
  features: z.string().optional(),
  images: z.any().optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

function ManageVehicleDialog({ 
    car, 
    trigger,
    ownerId,
    onSave,
    onDelete,
} : { 
    car?: Car, 
    trigger: React.ReactNode, 
    ownerId: string,
    onSave: (car: Car, images: FileList | null) => void,
    onDelete?: (carId: string) => void,
}) {
    const [open, setOpen] = React.useState(false);
    const isEditMode = !!car;

    const { register, handleSubmit, control, formState: { errors } } = useForm<CarFormValues>({
        resolver: zodResolver(carFormSchema),
        defaultValues: {
            name: car?.name || '',
            brand: car?.brand || '',
            year: car?.year || new Date().getFullYear(),
            type: car?.type || 'Sedan',
            pricePerDay: car?.pricePerDay || 0,
            seats: car?.seats || 4,
            fuel: car?.fuel || 'Gasoline',
            transmission: car?.transmission || 'Automatic',
            description: car?.description || '',
            availability: car?.availability || 'Available',
            features: car?.features?.join(', ') || '',
            images: null,
        }
    });

    const onSubmit = (data: CarFormValues) => {
        const featuresArray = data.features ? data.features.split(',').map(f => f.trim()) : [];
        
        const carData: Omit<Car, 'id' | 'images' | 'rentalCompany' | 'ownerId'> = {
            name: data.name,
            brand: data.brand,
            year: data.year,
            type: data.type,
            pricePerDay: data.pricePerDay,
            seats: data.seats,
            fuel: data.fuel,
            transmission: data.transmission,
            description: data.description,
            availability: data.availability,
            features: featuresArray,
        };

        const carToSave: Car = {
            ...carData,
            id: car?.id || `car-${Date.now()}`,
            rentalCompany: car?.rentalCompany || 'My Fleet',
            ownerId: ownerId,
            images: car?.images || [], // Preserve old images if no new ones are uploaded
        };
        
        onSave(carToSave, data.images);
        setOpen(false);
    };

    const handleDelete = () => {
        if (car && onDelete) {
            onDelete(car.id);
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Manage Vehicle' : 'Add New Vehicle'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the details of your vehicle.' : 'Fill in the details to add a new vehicle to your fleet.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" {...register('brand')} />
                            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" {...register('year')} />
                            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="pricePerDay">Price/Day (RWF)</Label>
                            <Input id="pricePerDay" type="number" {...register('pricePerDay')} />
                            {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay.message}</p>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Input id="features" {...register('features')} placeholder="e.g., GPS, Bluetooth, Sunroof" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Controller name="type" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SUV">SUV</SelectItem>
                                        <SelectItem value="Sedan">Sedan</SelectItem>
                                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                                        <SelectItem value="Convertible">Convertible</SelectItem>
                                        <SelectItem value="Truck">Truck</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                         <div>
                            <Label>Transmission</Label>
                            <Controller name="transmission" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Automatic">Automatic</SelectItem>
                                        <SelectItem value="Manual">Manual</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                        <div>
                            <Label>Fuel Type</Label>
                            <Controller name="fuel" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                        <SelectItem value="Electric">Electric</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="seats">Seats</Label>
                            <Input id="seats" type="number" {...register('seats')} />
                            {errors.seats && <p className="text-red-500 text-xs mt-1">{errors.seats.message}</p>}
                        </div>
                        <div>
                            <Label>Availability</Label>
                            <Controller name="availability" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Booked">Booked</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="images">Car Images</Label>
                        <Input id="images" type="file" multiple {...register('images')} />
                        <p className="text-xs text-muted-foreground mt-1">
                            {isEditMode ? "Uploading new images will replace all existing ones." : "Select one or more images to upload."}
                        </p>
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message as string}</p>}
                    </div>

                    <DialogFooter className="sm:justify-between pt-4">
                        {isEditMode && <Button type="button" variant="destructive" onClick={handleDelete}>Delete Vehicle</Button>}
                        {!isEditMode && <div />}
                        <div className="flex gap-2">
                           <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                           </DialogClose>
                            <Button type="submit">Save</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { cars, bookings, updateCar, addCar, deleteCar } = useMockData();
  
  const ownerCars = useMemo(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) return [];
    // Admins can see all cars, owners see only their own
    if (user.role === 'admin') return cars;
    return cars.filter(car => car.ownerId === user.id);
  }, [user, cars]);

  const ownerBookings = useMemo(() => {
    if (!ownerCars.length) return [];
    const ownerCarIds = ownerCars.map(c => c.id);
    return bookings.filter(b => ownerCarIds.includes(b.carId));
  }, [ownerCars, bookings]);


  const totalEarnings = useMemo(() => {
    return ownerBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalPrice, 0);
  }, [ownerBookings]);

  const activeBookings = useMemo(() => {
    return ownerBookings.filter(b => b.status === 'Active' || b.status === 'Upcoming').length;
  }, [ownerBookings]);


  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You must be an owner or admin to view this page.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  const getBadgeVariant = (status: Car['availability']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Booked':
        return 'secondary';
      case 'Maintenance':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const handleSaveVehicle = (car: Car, imageFiles: FileList | null) => {
    const updatedCar = { ...car };

    if (imageFiles && imageFiles.length > 0) {
        const imageUrls: string[] = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            
            // =================================================================
            // INTEGRATION POINT: UPLOAD TO BACKEND
            // =================================================================
            // In a real application, you would upload the `file` to your backend here.
            //
            // Example:
            // const formData = new FormData();
            // formData.append('image', file);
            // const response = await fetch('/api/upload-image', {
            //     method: 'POST',
            //     body: formData,
            // });
            // const { url } = await response.json();
            // imageUrls.push(url);
            //
            // For this mock implementation, we will use local object URLs.
            // These are temporary and will only work for the current session.
            const objectUrl = URL.createObjectURL(file);
            imageUrls.push(objectUrl);
        }
        updatedCar.images = imageUrls;
    }


    if (cars.find(c => c.id === updatedCar.id)) { // use `cars` from mock data to check existence
        updateCar(updatedCar);
    } else {
        addCar(updatedCar);
    }
  }
  
  const navItems = user.role === 'admin'
    ? [
        { href: '/admin', label: 'Admin', icon: 'shield_person' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      ];


  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Owner Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {user.name}. Here's an overview of your fleet.</p>
        </div>
         <ManageVehicleDialog
            trigger={<Button>Add Vehicle</Button>}
            ownerId={user.id}
            onSave={handleSaveVehicle}
         />
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">payments</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} RWF</div>
            <p className="text-xs text-muted-foreground">From completed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active & Upcoming Bookings</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">event_available</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <span className="material-symbols-outlined text-muted-foreground">directions_car</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerCars.length}</div>
            <p className="text-xs text-muted-foreground">In your fleet</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* My Vehicles Table */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">My Vehicles</h2>
             <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price/Day (RWF)</TableHead>
                      <TableHead className="text-right">Total Bookings</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ownerCars.length > 0 ? ownerCars.map(car => (
                      <TableRow key={car.id}>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(car.availability)}>{car.availability}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{car.pricePerDay.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{bookings.filter(b => b.carId === car.id).length}</TableCell>
                        <TableCell className="text-right">
                          <ManageVehicleDialog 
                            car={car}
                            trigger={<Button variant="outline" size="sm">Manage</Button>}
                            ownerId={user.id}
                            onSave={handleSaveVehicle}
                            onDelete={deleteCar}
                          />
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">You have no vehicles listed.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </Card>
        </div>

        {/* Recent Bookings */}
        <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {ownerBookings.slice(0, 5).map(booking => {
                        const car = cars.find(c => c.id === booking.carId);
                        return (
                            <div key={booking.id} className="flex items-center">
                                <div className="flex-grow">
                                    <p className="font-semibold">{car?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(booking.startDate, 'MMM d')} - {format(booking.endDate, 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{booking.totalPrice.toLocaleString()} RWF</p>
                                    <Badge variant={booking.status === "Completed" ? "outline" : "default"}>{booking.status}</Badge>
                                </div>
                            </div>
                        )
                    })}
                     {ownerBookings.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No bookings for your vehicles yet.</p>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
    

    