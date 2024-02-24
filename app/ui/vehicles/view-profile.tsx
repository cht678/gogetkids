import Link from 'next/link';

const ViewProfile = ({ vehicle }: { vehicle: any }) => {
  return (
    <div>
      <h1>Vehicle Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label className="block text-sm font-medium">Vehicle Plate:</label>
          <p className="mt-1 text-sm text-gray-900">{vehicle.vehicleId}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Status:</label>
          <p className="mt-1 text-sm text-gray-900">{vehicle.status}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Next Servicing Date:</label>
          <p className="mt-1 text-sm text-gray-900">{vehicle.nextServicing}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Company:</label>
          <p className="mt-1 text-sm text-gray-900">{vehicle.company_name}</p>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/transport-admin-dashboard/vehicles/${vehicle._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/transport-admin-dashboard/vehicles" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
