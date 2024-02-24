import Profile from '@/app/ui/trips/view-profile';
import Breadcrumbs from '@/app/ui/trips/breadcrumbs';
import { fetchTripById } from '@/app/lib/data3';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const trip = await fetchTripById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trips', href: '/transport-admin-dashboard/trips' },
          {
            label: 'View Trip Profile',
            href: `/transport-admin-dashboard/trips/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile trip={trip} />
    </main>
  );
}
