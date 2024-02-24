import Link from 'next/link';
import { UpdateVehicle, DeleteVehicle } from '@/app/ui/vehicles/buttons';
import { fetchFilteredVehicles } from '@/app/lib/data3';

export default async function VehiclesTable({
  query,
  currentPage,
  companyName,
}: {
  query: string;
  currentPage: number;
  companyName: string;
}) {
  let vehicles: any[] = [];

  try {
    vehicles = await fetchFilteredVehicles(query, currentPage, companyName);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Vehicle Plate
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Next Servicing Date
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
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/transport-admin-dashboard/vehicles/${vehicle._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        {vehicle.vehicleId}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.nextServicing}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {vehicle.company_name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateVehicle id={vehicle._id} />
                      <DeleteVehicle id={vehicle._id} />
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
