'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createTrip } from '@/app/lib/actions3';

interface Props {
  drivers: string[]; // Define the type of the drivers prop
  vehicles: string[]; // Define the type of the vehicles prop
}

export default function Form({ drivers, vehicles }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createTrip(formData); // Use the function for creating a trip
      // If createTrip does not throw an error, display success toast
      toast.success('Trip created successfully!');
    } catch (error) {
      // If createTrip throws an error, display error toast
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDriver(event.target.value);
  };

  const handleVehicleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Driver Email Dropdown */}
        <div className="mb-4">
          <label htmlFor="driver_email" className="mb-2 block text-sm font-medium">
            Driver Email
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="driver_email"
              name="driver_email"
              value={selectedDriver}
              onChange={handleDriverSelectChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 mt-1"
              required
            >
              <option value="" disabled>Select Driver Email</option>
              {drivers.map((driverEmail, index) => (
                <option key={index} value={driverEmail}>
                  {driverEmail}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Vehicle Number Dropdown */}
        <div className="mb-4">
          <label htmlFor="vehicle_number" className="mb-2 block text-sm font-medium">
            Vehicle Number
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="vehicle_number"
              name="vehicle_number"
              value={selectedVehicle}
              onChange={handleVehicleSelectChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 mt-1"
              required
            >
              <option value="" disabled>Select Vehicle Number</option>
              {vehicles.map((vehicleNumber, index) => (
                <option key={index} value={vehicleNumber}>
                  {vehicleNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* School Name */}
        <div className="mb-4">
          <label htmlFor="school_name" className="mb-2 block text-sm font-medium">
            School Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="school_name"
              name="school_name"
              type="text"
              placeholder="Enter School Name"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>
  
        {/* Zone */}
        <div className="mb-4">
          <label htmlFor="zone" className="mb-2 block text-sm font-medium">
            Zone
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="zone"
              name="zone"
              type="text"
              placeholder="Enter Zone"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="date"
              name="date"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label htmlFor="start_time" className="mb-2 block text-sm font-medium">
            Start Time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="start_time"
              name="start_time"
              type="time"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>
  
        {/* End Time */}
        <div className="mb-4">
          <label htmlFor="end_time" className="mb-2 block text-sm font-medium">
            End Time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="end_time"
              name="end_time"
              type="time"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/transport-admin-dashboard/trips"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
}
