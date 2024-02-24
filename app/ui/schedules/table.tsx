import { UpdateSchedule, DeleteSchedule } from '@/app/ui/schedules/buttons';
import Link from 'next/link';
import { fetchFilteredSchedules } from '@/app/lib/data';

export default async function SchedulesTable({
  query,
  currentPage,
  schoolName,
}: {
  query: string;
  currentPage: number;
  schoolName: string;
}) {
  let schedules: any[] = [];

  try {
    schedules = await fetchFilteredSchedules(query, currentPage, schoolName);
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Student ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Transport Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Pick Up Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Dismissal Time
                </th>
                {/* Actions column */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {schedules?.map((schedule) => (
                <tr
                  key={schedule._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {schedule.studentid}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {schedule.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {schedule.transport_type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {schedule.pickup_time}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {schedule.dismissal_time}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSchedule id={schedule._id} />
                      <DeleteSchedule id={schedule._id} />
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
