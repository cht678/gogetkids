'use client'

import { Button } from '@/app/ui/button';
import { createVehicle } from '@/app/lib/actions3'; // Updated import
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createVehicle(formData); // Updated function call
      // If createVehicle does not throw an error, display success toast
      toast.success('Vehicle created successfully!'); // Updated success message
    } catch (error) {
      // If createVehicle throws an error, display error toast
      toast.error('Failed to create vehicle. Please try again.'); // Updated error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Vehicle ID */}
        <div className="mb-4">
          <label htmlFor="vehicleId" className="mb-2 block text-sm font-medium">
            Vehicle ID
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="vehicleId"
              name="vehicleId"
              type="text"
              placeholder="Enter Vehicle ID"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="status"
              name="status"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
              required
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Servicing">Servicing</option>
              <option value="In Repair">In Repair</option>
            </select>
          </div>
        </div>

        {/* Next Servicing Date */}
        <div className="mb-4">
          <label htmlFor="nextServicing" className="mb-2 block text-sm font-medium">
            Next Servicing Date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="nextServicing"
              name="nextServicing"
              type="date"
              placeholder="Enter Next Servicing Date"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/transport-admin-dashboard/vehicles" // Updated href
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Vehicle'} {/* Updated button text */}
        </Button>
      </div>
    </form>
  );

}
