import Form from '@/app/ui/parents/create-form';
import Breadcrumbs from '@/app/ui/parents/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Parents', href: '/dashboard/parents' },
          {
            label: 'Create Parent',
            href: '/dashboard/parents/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}