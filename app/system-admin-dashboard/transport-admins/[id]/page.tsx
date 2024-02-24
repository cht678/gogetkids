import Profile from '@/app/ui/transport-admins/view-profile';
import Breadcrumbs from '@/app/ui/transport-admins/breadcrumbs';
import { fetchTransportAdminById } from '@/app/lib/data2';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const transportAdmin = await fetchTransportAdminById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transport Admins', href: '/system-admin-dashboard/transport-admins' },
          {
            label: 'View Transport Admin Profile',
            href: `/system-admin-dashboard/transport-admins/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile transportAdmin={transportAdmin} />
    </main>
  );
}
