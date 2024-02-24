import TransportAdminForm from '@/app/ui/transport-admins/create-form';
import Breadcrumbs from '@/app/ui/transport-admins/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transport Admins', href: '/system-admin-dashboard/transport-admins' },
          {
            label: 'Create Transport Admin',
            href: '/system-admin-dashboard/transport-admins/create',
            active: true,
          },
        ]}
      />
      <TransportAdminForm/>
    </main>
  );
}
