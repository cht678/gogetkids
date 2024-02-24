import { UpdateTransportAdmin, DeleteTransportAdmin } from '@/app/ui/transport-admins/buttons';
import Link from 'next/link';
import { fetchFilteredTransportAdmins } from '@/app/lib/data2';

export default async function TransportAdminsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  let transportAdmins: any[] = [];

  try {
    // Call fetchFilteredTransportAdmins with the retrieved transport name
    transportAdmins = await fetchFilteredTransportAdmins(query, currentPage);
  } catch (error) {
    console.error('Error fetching transport admins:', error);
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
                  Company Name
                </th>
                {/* Actions column */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transportAdmins?.map((admin) => (
                <tr
                  key={admin._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/system-admin-dashboard/transport-admins/${admin._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        {admin.email}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${admin.firstname} ${admin.lastname}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {admin.company_name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTransportAdmin id={admin._id} />
                      <DeleteTransportAdmin id={admin._id} />
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
