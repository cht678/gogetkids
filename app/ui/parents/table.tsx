import { UpdateParent, DeleteParent } from '@/app/ui/parents/buttons';
import { fetchFilteredParents, fetchStudentsByParentsEmail, fetchStudentNameById } from '@/app/lib/data'; // assuming fetchStudentsWithParentsId exists
import Link from 'next/link';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from 'react';

interface ParentsTableProps {
  query: string;
  currentPage: number;
  schoolName: string; // Add schoolName prop to the interface
}

export default async function ParentsTable({
  query,
  currentPage,
  schoolName,
}: ParentsTableProps) {
  let parents: any[] = [];
  let parentEmails: string[] = [];
  let students: any[] = [];
  let combinedData: any[] = []; // Initialize combinedData here

  try {
    parents = await fetchFilteredParents(query, currentPage, schoolName);
    parentEmails = parents.map((parent) => parent.email);
    students = await fetchStudentsByParentsEmail(parentEmails);

    const studentFirstNamesByParentEmail: any[] = [];

    for (const studentEntry of students) {
      const studentFirstNames: string[] = [];

      for (const studentId of studentEntry.studentIds) {
        const student = await fetchStudentNameById(studentId);
        if (student) {
          studentFirstNames.push(student.name);
        }
      }

      studentFirstNamesByParentEmail.push({
        email: studentEntry.email,
        student_name: studentFirstNames,
      });
    }

    combinedData = parents.map((parent) => {
      const studentNames =
        studentFirstNamesByParentEmail.find(
          (entry) => entry.email === parent.email
        )?.student_name || [];
      return {
        _id: parent._id,
        email: parent.email,
        name: `${parent.firstName} ${parent.lastName}`,
        phoneNum: parent.phoneNum,
        students: studentNames,
      };
    });

    console.log('Combined Data:', combinedData);
  } catch (error: any) {
    console.error('Error fetching parents:', error);
    // You can return an error message or a loading spinner here if needed
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Parent of
                </th>
                {/* Actions column */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {combinedData.map((parent) => (
                <tr
                  key={parent._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/dashboard/parents/${parent._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        <p>{parent.email}</p>
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.phoneNum}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.students.map((student: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
                      <p key={index}>{student}</p>
                    ))}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateParent id={parent._id} />
                      <DeleteParent id={parent._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {combinedData.length === 0 && (
            <div className="text-center py-5">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
