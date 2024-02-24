'use client'

import { Button } from '@/app/ui/button';
import { createTeacher } from '@/app/lib/actions'; // Updated import
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
      await createTeacher(formData); // Updated function call
      // If createTeacher does not throw an error, display success toast
      toast.success('Teacher created successfully!'); // Updated success message
    } catch (error) {
      // If createTeacher throws an error, display error toast
      toast.error('Failed to create teacher. Please try again.'); // Updated error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Your form inputs here */}
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter First Name"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter Last Name"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNum" className="mb-2 block text-sm font-medium">
            Phone Number
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="phoneNum"
              name="phoneNum"
              type="text"
              placeholder="Enter Phone Number"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/teachers" // Updated href
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Teacher'} {/* Updated button text */}
        </Button>
      </div>
    </form>
  );
}
