'use client'

import Link from 'next/link';

const ViewProfile = ({ transportAdmin }: { transportAdmin: any }) => {

  return (
    <div>
      <h1>Transport Admin Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <p className="mt-1 text-sm text-gray-900">{transportAdmin.firstname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <p className="mt-1 text-sm text-gray-900">{transportAdmin.lastname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email:</label>
          <p className="mt-1 text-sm text-gray-900">{transportAdmin.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Transport Name:</label>
          <p className="mt-1 text-sm text-gray-900">{transportAdmin.transport_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role:</label>
          <p className="mt-1 text-sm text-gray-900">{transportAdmin.role}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/system-admin-dashboard/transport-admins/${transportAdmin._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/system-admin-dashboard/transport-admins" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
