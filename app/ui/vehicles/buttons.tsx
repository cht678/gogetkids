import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { deleteVehicle } from '@/app/lib/actions3';

export function CreateVehicle() {
  return (
    <Link
      href="/transport-admin-dashboard/vehicles/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Vehicle</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateVehicle({ id }: { id: string }) {
  return (
    <Link
      href={`/transport-admin-dashboard/vehicles/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteVehicle({ id }: { id: string }) {
  const deleteVehicleWithId = deleteVehicle.bind(null, id);

  return (
    <form action={deleteVehicleWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

// Bulk Import
export function BulkImportVehicles() {
  return (
    <Link
      href="/transport-admin-dashboard/vehicles/bulk-import"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Bulk Import</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}