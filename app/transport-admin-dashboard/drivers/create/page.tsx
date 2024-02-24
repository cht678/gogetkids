import Form from '@/app/ui/drivers/create-form';
import Breadcrumbs from '@/app/ui/drivers/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Drivers', href: '/transport-admin-dashboard/drivers' },
          {
            label: 'Create Driver',
            href: '/transport-admin-dashboard/drivers/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}