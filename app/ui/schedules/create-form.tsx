"use client";

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createSchedule } from '@/app/lib/actions'; // Import the function for creating a schedule

interface Props {
  students: string[]; // Define the type of the students prop
}

export default function Form({ students }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createSchedule(formData); // Use the function for creating a schedule
      // If createSchedule does not throw an error, display success toast
      toast.success('Schedule created successfully!');
    } catch (error) {
      // If createSchedule throws an error, display error toast
      toast.error('Failed to create schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudent(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Student ID Dropdown */}
        <div className="mb-4">
          <label htmlFor="studentid" className="mb-2 block text-sm font-medium">
            Student ID
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="studentid"
              name="studentid"
              value={selectedStudent}
              onChange={handleSelectChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 mt-1"
            >
              <option value="" disabled>Select Student ID</option>
              {students
                .slice() // create a copy of the array before sorting
                .sort((a, b) => parseInt(a) - parseInt(b)) // sort the array numerically in ascending order
                .map((studentId, index) => (
                  <option key={index} value={studentId}>
                    {studentId}
                  </option>
                ))}
            </select>
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
              placeholder="Enter Date"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Transport Type */}
        <div className="mb-4">
          <label htmlFor="transport_type" className="mb-2 block text-sm font-medium">
            Transport Type
          </label>
          <select
            id="transport_type"
            name="transport_type"
            className="block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          >
            <option value="" disabled selected>Select Transport Type</option>
            <option value="Bus">Bus</option>
            <option value="Parent">Parent</option>
            <option value="Guardian">Guardian</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Pickup Time */}
        <div className="mb-4">
          <label htmlFor="pickup_time" className="mb-2 block text-sm font-medium">
            Pickup Time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="pickup_time"
              name="pickup_time"
              type="time"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Dismissal Time */}
        <div className="mb-4">
          <label htmlFor="dismissal_time" className="mb-2 block text-sm font-medium">
            Dismissal Time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="dismissal_time"
              name="dismissal_time"
              type="time"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/schedules"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  );
}
