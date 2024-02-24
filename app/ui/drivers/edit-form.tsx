'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateDriver } from '@/app/lib/actions3'; // Import the correct update function for drivers

export default function EditDriverForm({
  driver,
}: {
  driver: any; // Adjust the type definition accordingly
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateDriver(driver._id, formData); // Call the update function for drivers
      toast.success('Driver updated successfully!');
    } catch (error) {
      toast.error('Failed to update driver. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={driver.email} // Use driver's attribute for email
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={driver.firstName} // Use driver's attribute for first name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={driver.lastName} // Use driver's attribute for last name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* License */}
        <div className="mb-4">
          <label htmlFor="license" className="mb-2 block text-sm font-medium">
            License
          </label>
          <input
            id="license"
            name="license"
            type="text"
            defaultValue={driver.license} // Use driver's attribute for last name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNum" className="mb-2 block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="phoneNum"
            name="phoneNum"
            type="tel"
            defaultValue={driver.phoneNum} // Use driver's attribute for phone number
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>



      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/transport-admin-dashboard/drivers" // Update link to return to drivers dashboard
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Driver'}
        </Button>
      </div>
    </form>
  );
}