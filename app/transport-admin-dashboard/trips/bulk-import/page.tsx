import Breadcrumbs from '@/app/ui/trips/breadcrumbs';
import BulkImportForm from '@/app/ui/trips/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trips', href: '/transport-admin-dashboard/trips' },
          {
            label: 'Bulk Import',
            href: '/transport-admin-dashboard/trips/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}
