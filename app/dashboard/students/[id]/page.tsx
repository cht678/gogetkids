import Profile from '@/app/ui/students/view-profile';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchStudentById } from '@/app/lib/data';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const student = await fetchStudentById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'View Student Profile',
            href: `/dashboard/students/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile student={student} />
    </main>
  );
}
