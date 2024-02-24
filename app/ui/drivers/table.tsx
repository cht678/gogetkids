import Link from 'next/link';
import { UpdateDriver, DeleteDriver } from '@/app/ui/drivers/buttons';
import { fetchFilteredDrivers } from '@/app/lib/data3';

export default async function DriversTable({
  query,
  currentPage,
  companyName,
}: {
  query: string;
  currentPage: number;
  companyName: string;
}) {
  let drivers: any[] = [];

  try {
    drivers = await fetchFilteredDrivers(query, currentPage, companyName);
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact Number
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Company
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {drivers.map((driver) => (
                <tr
                  key={driver._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/transport-admin-dashboard/drivers/${driver._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        {driver.email}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${driver.firstName} ${driver.lastName}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {driver.phoneNum}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {driver.company_name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateDriver id={driver._id} />
                      <DeleteDriver id={driver._id} />
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
