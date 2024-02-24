import Form from '@/app/ui/vehicles/create-form';
import Breadcrumbs from '@/app/ui/vehicles/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/transport-admin-dashboard/vehicles' },
          {
            label: 'Create Vehicle',
            href: '/transport-admin-dashboard/vehicles/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}