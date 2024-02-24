import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import BulkImportForm from '@/app/ui/classes/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Classes', href: '/dashboard/classes' },
          {
            label: 'Bulk Import',
            href: '/dashboard/classes/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
