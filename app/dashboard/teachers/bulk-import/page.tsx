import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';
import BulkImportForm from '@/app/ui/teachers/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'Bulk Import',
            href: '/dashboard/teachers/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
