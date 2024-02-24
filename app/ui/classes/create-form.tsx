'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClass } from '@/app/lib/actions'; // Import the function for creating a class

interface Props {
  teachers: string[]; // Define the type of the teachers prop
}

export default function Form({ teachers }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createClass(formData); // Use the function for creating a class
      // If createClass does not throw an error, display success toast
      toast.success('Class created successfully!');
    } catch (error) {
      // If createClass throws an error, display error toast
      toast.error('Failed to create class. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Your form inputs here */}
        {/* Class Name */}
        <div className="mb-4">
          <label htmlFor="class_name" className="mb-2 block text-sm font-medium">
            Class Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="class_name"
              name="class_name"
              type="text"
              placeholder="Enter Class Name"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Class Level */}
        <div className="mb-4">
          <label htmlFor="class_level" className="mb-2 block text-sm font-medium">
            Class Level
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="class_level"
              name="class_level"
              type="text"
              placeholder="Enter Class Level"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Teacher's Email */}
        <div className="mb-4">
          <label htmlFor="teacher_email" className="mb-2 block text-sm font-medium">
            Teacher Email
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="teacher_email"
              name="teacher_email"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
              required
            >
              <option value="">Select Teacher Email</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/classes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Class'}
        </Button>
      </div>
    </form>
  );
}
