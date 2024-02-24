'use client'

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { updateClass } from '@/app/lib/actions';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EditClassForm({ classroom, teachers }: { classroom: any; teachers: string[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateClass(classroom._id, formData);
      // Handle success
      toast.success('Class updated successfully!');
    } catch (error) {
      // Handle error
      toast.error('Failed to update class. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Class Name */}
        <div className="mb-4">
          <label htmlFor="class_name" className="mb-2 block text-sm font-medium">
            Class Name
          </label>
          <input
            id="class_name"
            name="class_name"
            type="text"
            defaultValue={classroom.class_name}
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Class Level */}
        <div className="mb-4">
          <label htmlFor="class_level" className="mb-2 block text-sm font-medium">
            Class Level
          </label>
          <input
            id="class_level"
            name="class_level"
            type="text"
            defaultValue={classroom.class_level}
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Teacher's Email */}
        <div className="mb-4">
          <label htmlFor="teacherid" className="mb-2 block text-sm font-medium">
            Teacher Email
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="teacherid"
              name="teacherid"
              defaultValue={classroom.teacherid}
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
            {isLoading ? 'Updating...' : 'Update Class'}
          </Button>
        </div>
    </form>
  );
}
