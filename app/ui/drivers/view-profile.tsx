import Link from 'next/link';

const ViewProfile = ({ driver }: { driver: any }) => {
  return (
    <div>
      <h1>Driver Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.firstName}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.lastName}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone Number:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.phoneNum}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">License:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.license}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Company:</label>
          <p className="mt-1 text-sm text-gray-900">{driver.company_name}</p>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/transport-admin-dashboard/drivers/${driver._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/transport-admin-dashboard/drivers" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
