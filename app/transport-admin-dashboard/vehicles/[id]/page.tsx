import Profile from '@/app/ui/vehicles/view-profile';
import Breadcrumbs from '@/app/ui/vehicles/breadcrumbs';
import { fetchVehicleById } from '@/app/lib/data3';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const vehicle = await fetchVehicleById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/transport-admin-dashboard/vehicles' },
          {
            label: 'View Vehicle Profile',
            href: `/transport-admin-dashboard/vehicles/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile vehicle={vehicle} />
    </main>
  );
}
