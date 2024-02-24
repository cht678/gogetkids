import Form from '@/app/ui/parents/edit-form';
import Breadcrumbs from '@/app/ui/parents/breadcrumbs';
import { fetchParentById } from '@/app/lib/data';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const parent = await fetchParentById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Parents', href: '/dashboard/parents' },
          {
            label: 'Edit Parent',
            href: `/dashboard/parents/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form parent={parent} />
    </main>
  );
}
