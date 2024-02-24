import Link from 'next/link';
import { UpdateTrip, DeleteTrip } from '@/app/ui/trips/buttons';
import { fetchFilteredTrips } from '@/app/lib/data3';

export default async function TripsTable({
  query,
  currentPage,
  companyName,
}: {
  query: string;
  currentPage: number;
  companyName: string;
}) {
  let trips: any[] = [];

  try {
    trips = await fetchFilteredTrips(query, currentPage, companyName);
  } catch (error) {
    console.error('Error fetching trips:', error);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Trip Number
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Vehicle Plate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  School Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Zone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Start Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  End Time
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
              {trips.map((trip) => (
                <tr
                  key={trip._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/transport-admin-dashboard/trips/${trip._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        {trip.tripId}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.vehicle_number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.school_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.zone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.start_time}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trip.end_time}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTrip id={trip._id} />
                      <DeleteTrip id={trip._id} />
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
