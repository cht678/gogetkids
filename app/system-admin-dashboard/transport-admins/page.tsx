import Pagination from '@/app/ui/transport-admins/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/transport-admins/table';
import { CreateTransportAdmin } from '@/app/ui/transport-admins/buttons';
import { lusitana } from '@/app/ui/fonts';
import { DefaultSkeletonTable } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchTransportAdminsPages,} from '@/app/lib/data2';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // Fetch TransportAdmins pages with the transport name
  const totalPages = await fetchTransportAdminsPages(query);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transport Admins</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Transport Admins..." />
        <CreateTransportAdmin />
      </div>
      <Suspense key={query + currentPage} fallback={<DefaultSkeletonTable />}>
        <Table query={query} currentPage={currentPage}  />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}
