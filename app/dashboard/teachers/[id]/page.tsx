import Profile from '@/app/ui/teachers/view-profile';
import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';
import { fetchTeacherById } from '@/app/lib/data';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const teacher = await fetchTeacherById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'View Teacher Profile',
            href: `/dashboard/teachers/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile teacher={teacher} />
    </main>
  );
}
