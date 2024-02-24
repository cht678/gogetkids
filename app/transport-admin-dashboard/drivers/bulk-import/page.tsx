import Breadcrumbs from '@/app/ui/drivers/breadcrumbs';
import BulkImportForm from '@/app/ui/drivers/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Drivers', href: '/transport-admin-dashboard/drivers' },
          {
            label: 'Bulk Import',
            href: '/transport-admin-dashboard/drivers/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
