'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateTeacher } from '@/app/lib/actions'; // Import the correct update function for teachers

export default function EditTeacherForm({
  teacher,
}: {
  teacher: any; // Adjust the type definition accordingly
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateTeacher(teacher._id, formData); // Call the update function for teachers
      toast.success('Teacher updated successfully!');
    } catch (error) {
      toast.error('Failed to update teacher. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={teacher.firstName} // Use teacher's attribute for first name
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
            defaultValue={teacher.lastName} // Use teacher's attribute for last name
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
            defaultValue={teacher.email} // Use teacher's attribute for email
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
            defaultValue={teacher.phoneNum} // Use teacher's attribute for phone number
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>


      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/teachers" // Update link to return to teachers dashboard
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Teacher'}
        </Button>
      </div>
    </form>
  );
}