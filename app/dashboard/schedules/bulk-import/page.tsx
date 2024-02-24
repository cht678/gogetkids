import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';
import BulkImportForm from '@/app/ui/schedules/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Schedules', href: '/dashboard/schedules' },
          {
            label: 'Bulk Import',
            href: '/dashboard/schedules/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
