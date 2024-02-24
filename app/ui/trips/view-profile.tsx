import Link from 'next/link';

const ViewProfile = ({ trip }: { trip: any }) => {
  return (
    <div>
      <h1>Trip Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label className="block text-sm font-medium">Trip Number:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.tripId}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Driver:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.driver_email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Vehicle:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.vehicle_number}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">School Name:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.school_name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Zone:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.zone}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.date}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Start Time:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.start_time}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">End Time:</label>
          <p className="mt-1 text-sm text-gray-900">{trip.end_time}</p>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/transport-admin-dashboard/trips/${trip._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Trip
        </Link>
        <Link href="/transport-admin-dashboard/trips" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
