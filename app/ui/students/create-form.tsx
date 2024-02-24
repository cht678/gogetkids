'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createStudent } from '@/app/lib/actions';

interface Props {
  parents: string[]; // Define the type of the parents prop
  classes: string[]; // Define the type of the classes prop
}

export default function Form({ parents, classes }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createStudent(formData);
      // If createStudent does not throw an error, display success toast
      toast.success('Student created successfully!');
    } catch (error) {
      // If createStudent throws an error, display error toast
      toast.error('Failed to create student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Your form inputs here */}
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter First Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter Last Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label htmlFor="gender" className="mb-2 block text-sm font-medium">
            Gender
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="gender"
              name="gender"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="dob" className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="dob"
              name="dob"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter Block No. and Street"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Postalcode */}
        <div className="mb-4">
          <label htmlFor="postcode" className="mb-2 block text-sm font-medium">
            Postal Code
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="postcode"
              name="postcode"
              type="text"
              maxLength={6}
              placeholder="Enter Postal Code"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
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
            />
          </div>
        </div>

        {/* Class Name */}
        <div className="mb-4">
          <label htmlFor="class_name" className="mb-2 block text-sm font-medium">
            Class Name
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="class_name"
              name="class_name"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
            >
              <option value="">Select Class</option>
              {classes.map((className, index) => (
                <option key={index} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parent's Email */}
        <div className="mb-4">
          <label htmlFor="parent_id" className="mb-2 block text-sm font-medium">
            Parent Email
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="parent_id"
              name="parent_id"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
            >
              <option value="">Select Parent Email</option>
              {parents.map((email, index) => (
                <option key={index} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/students"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}





