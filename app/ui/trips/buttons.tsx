import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { deleteTrip } from '@/app/lib/actions3';

export function CreateTrip() {
  return (
    <Link
      href="/transport-admin-dashboard/trips/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Trip</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateTrip({ id }: { id: string }) {
  return (
    <Link
      href={`/transport-admin-dashboard/trips/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTrip({ id }: { id: string }) {
  const deleteTripWithId = deleteTrip.bind(null, id);

  return (
    <form action={deleteTripWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

// Bulk Import
export function BulkImportTrips() {
  return (
    <Link
      href="/transport-admin-dashboard/trips/bulk-import"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Bulk Import</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}