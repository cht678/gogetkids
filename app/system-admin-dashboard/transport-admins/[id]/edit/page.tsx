import Form from '@/app/ui/transport-admins/edit-form';
import Breadcrumbs from '@/app/ui/transport-admins/breadcrumbs';
import { fetchTransportAdminById } from '@/app/lib/data2';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const transportAdmin = await fetchTransportAdminById(id); // Fetch transportAdmin data instead of parent data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transport Admins', href: '/system-admin-dashboard/transport-admins' },
          {
            label: 'Edit Transport Admin',
            href: `/system-admin-dashboard/transport-admins/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form transportAdmin={transportAdmin} />
    </main>
  );
}
