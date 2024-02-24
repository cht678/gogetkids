import SchoolAdminForm from '@/app/ui/school-admins/create-form';
import Breadcrumbs from '@/app/ui/school-admins/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'School Admins', href: '/system-admin-dashboard/school-admins' },
          {
            label: 'Create School Admin',
            href: '/system-admin-dashboard/school-admins/create',
            active: true,
          },
        ]}
      />
      <SchoolAdminForm/>
    </main>
  );
}
