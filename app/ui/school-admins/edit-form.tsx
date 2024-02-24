'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button'; // Make sure this path is correct
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateSchoolAdmin } from '@/app/lib/actions2'; // Import the correct update function for school-admins

export default function EditSchoolAdminForm({
  schoolAdmin,
}: {
  schoolAdmin: any; // Adjust the type definition accordingly
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateSchoolAdmin(schoolAdmin._id, formData); // Call the update function for school-admins
      toast.success('SchoolAdmin updated successfully!');
    } catch (error) {
      toast.error('Failed to update schoolAdmin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            defaultValue={schoolAdmin.firstname} // Use schoolAdmin's attribute for first name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            defaultValue={schoolAdmin.lastname} // Use schoolAdmin's attribute for last name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={schoolAdmin.email}
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* School Name */}
        <div className="mb-4">
          <label htmlFor="school_name" className="mb-2 block text-sm font-medium">
            School Name
          </label>
          <input
            id="school_name"
            name="school_name"
            type="text"
            defaultValue={schoolAdmin.school_name} // Use schoolAdmin's attribute for last name
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/system-admin-dashboard/school-admins" // Update link to return to school-admins dashboard
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update School Admin'}
        </Button>
      </div>
    </form>
  );
}
