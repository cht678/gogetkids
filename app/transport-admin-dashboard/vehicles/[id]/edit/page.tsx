import Form from '@/app/ui/vehicles/edit-form';
import Breadcrumbs from '@/app/ui/vehicles/breadcrumbs';
import { fetchVehicleById } from '@/app/lib/data3';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const vehicle = await fetchVehicleById(id); // Fetch vehicle data instead of parent data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/transport-admin-dashboard/vehicles' },
          {
            label: 'Edit Vehicle',
            href: `/transport-admin-dashboard/vehicles/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form vehicle={vehicle} />
    </main>
  );
}
