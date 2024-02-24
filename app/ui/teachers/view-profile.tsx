import Link from 'next/link';

const ViewProfile = ({ teacher }: { teacher: any }) => {
  return (
    <div>
      <h1>Teacher Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Teacher ID:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher._id}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher.firstName}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher.lastName}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone Number:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher.phoneNum}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">School:</label>
          <p className="mt-1 text-sm text-gray-900">{teacher.school_name}</p>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/dashboard/teachers/${teacher._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/dashboard/teachers" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
