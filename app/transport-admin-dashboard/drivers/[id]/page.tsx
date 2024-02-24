import Profile from '@/app/ui/drivers/view-profile';
import Breadcrumbs from '@/app/ui/drivers/breadcrumbs';
import { fetchDriverById } from '@/app/lib/data3';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const driver = await fetchDriverById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Drivers', href: '/transport-admin-dashboard/drivers' },
          {
            label: 'View Driver Profile',
            href: `/transport-admin-dashboard/drivers/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile driver={driver} />
    </main>
  );
}
