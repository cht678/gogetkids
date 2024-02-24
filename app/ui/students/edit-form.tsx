'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateStudent } from '@/app/lib/actions';

export default function EditStudentForm({
  student,
  classes,
  parents,
}: {
  student: any; // Adjust the type definition accordingly
  classes: string[]; // Array of class names
  parents: string[]; // Array of parent emails
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateStudent(student._id, formData);
      toast.success('Student updated successfully!');
    } catch (error) {
      toast.error('Failed to update student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Student ID */}
        <div className="mb-4" style={{ opacity: 0.5 }}>
          <label htmlFor="studentid" className="mb-2 block text-sm font-medium">
            Student ID
          </label>
          <input
            id="studentid"
            name="studentid"
            type="number"
            value={student.studentid}
            readOnly
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 bg-gray-300" // Apply additional CSS class for disabled state
            required
          />
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            defaultValue={student.firstname}
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
            defaultValue={student.lastname}
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            required
          />
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
              defaultValue={student.gender}
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
              defaultValue={student.dob}
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
                defaultValue={student.address}
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
              defaultValue={student.postcode}
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
              defaultValue={student.zone}
              placeholder="Enter Zone"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={student.status}
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
            required
          >
            <option value="At Home">At Home</option>
            <option value="In School">In School</option>
            <option value="New">New</option>
            <option value="Transit out of school">Transit out of school</option>
            <option value="Transit to school">Transit to school</option>
          </select>
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
              defaultValue={student.class_name}
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
              defaultValue={student.parent_id}
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
          {isLoading ? 'Updating...' : 'Update Student'}
        </Button>
      </div>
    </form>
  );
}
