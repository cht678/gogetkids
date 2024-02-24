import Link from 'next/link';

const ViewProfile = ({ student }: { student: any }) => {
  return (
    <div>
      <h1>Student Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Student ID:</label>
          <p className="mt-1 text-sm text-gray-900">{student.studentid}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <p className="mt-1 text-sm text-gray-900">{student.firstname}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <p className="mt-1 text-sm text-gray-900">{student.lastname}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Gender:</label>
          <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date of Birth:</label>
          <p className="mt-1 text-sm text-gray-900">{student.dob}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Address:</label>
          <p className="mt-1 text-sm text-gray-900">{student.address}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Postal Code:</label>
          <p className="mt-1 text-sm text-gray-900">{student.postcode}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Zone:</label>
          <p className="mt-1 text-sm text-gray-900">{student.zone}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Class Name:</label>
          <p className="mt-1 text-sm text-gray-900">{student.class_name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Parent Email:</label>
          <p className="mt-1 text-sm text-gray-900">{student.parent_id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">School:</label>
          <p className="mt-1 text-sm text-gray-900">{student.school_name}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/dashboard/students/${student._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/dashboard/students" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
