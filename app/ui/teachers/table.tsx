import { UpdateTeacher, DeleteTeacher } from '@/app/ui/teachers/buttons';
import Link from 'next/link';
import { fetchFilteredTeachers } from '@/app/lib/data';

export default async function TeachersTable({
  query,
  currentPage,
  schoolName,
}: {
  query: string;
  currentPage: number;
  schoolName: string;
}) {
  let teachers: any[] = [];

  try {
    // Call fetchFilteredTeachers2 with the retrieved school name
    teachers = await fetchFilteredTeachers(query, currentPage, schoolName);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    // Handle errors if necessary
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact Number
                </th>
                {/* Actions column */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {teachers?.map((teacher) => (
                <tr
                  key={teacher._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/dashboard/teachers/${teacher._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        {teacher.email}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {teacher.phoneNum}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTeacher id={teacher._id} />
                      <DeleteTeacher id={teacher._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
