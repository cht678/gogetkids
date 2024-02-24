import Form from '@/app/ui/school-admins/edit-form';
import Breadcrumbs from '@/app/ui/school-admins/breadcrumbs';
import { fetchSchoolAdminById } from '@/app/lib/data2';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const schoolAdmin = await fetchSchoolAdminById(id); // Fetch schoolAdmin data instead of parent data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'School Admins', href: '/system-admin-dashboard/school-admins' },
          {
            label: 'Edit School Admin',
            href: `/system-admin-dashboard/school-admins/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form schoolAdmin={schoolAdmin} />
    </main>
  );
}
