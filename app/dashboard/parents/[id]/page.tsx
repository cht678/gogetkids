import Profile from '@/app/ui/parents/view-profile';
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
            label: 'View Parent Profile',
            href: `/dashboard/parents/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile parent={parent} />
    </main>
  );
}
