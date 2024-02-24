import Form from '@/app/ui/drivers/edit-form';
import Breadcrumbs from '@/app/ui/drivers/breadcrumbs';
import { fetchDriverById } from '@/app/lib/data3';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const driver = await fetchDriverById(id); // Fetch driver data instead of parent data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Drivers', href: '/transport-admin-dashboard/drivers' },
          {
            label: 'Edit Driver',
            href: `/transport-admin-dashboard/drivers/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form driver={driver} />
    </main>
  );
}
