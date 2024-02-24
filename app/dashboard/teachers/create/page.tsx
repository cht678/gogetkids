import Form from '@/app/ui/teachers/create-form';
import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'Create Teacher',
            href: '/dashboard/teachers/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}