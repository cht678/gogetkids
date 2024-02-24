import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import BulkImportForm from '@/app/ui/students/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'Bulk Import',
            href: '/dashboard/students/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
