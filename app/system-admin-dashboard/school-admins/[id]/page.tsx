import Profile from '@/app/ui/school-admins/view-profile';
import Breadcrumbs from '@/app/ui/school-admins/breadcrumbs';
import { fetchSchoolAdminById } from '@/app/lib/data2';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const schoolAdmin = await fetchSchoolAdminById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'School Admins', href: '/system-admin-dashboard/school-admins' },
          {
            label: 'View School Admin Profile',
            href: `/system-admin-dashboard/school-admins/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile schoolAdmin={schoolAdmin} />
    </main>
  );
}
