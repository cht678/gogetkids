import Pagination from '@/app/ui/vehicles/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/vehicles/table';
import { CreateVehicle, BulkImportVehicles } from '@/app/ui/vehicles/buttons';
import { lusitana } from '@/app/ui/fonts';
import { VehiclesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSessionToken } from '@/app/lib/data';
import { fetchCompanyName, fetchVehiclesPages } from '@/app/lib/data3';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import jwt

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

  // Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);

  // Verify and decode the token
  let decodedToken: JwtPayload | string; // Explicitly type decodedToken
  try {
    decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!);
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails
    return null; // Or handle the error in some other way
  }

  const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
  console.log(sessionUserId);

  // Extract company_name from decoded token
  const companyName = await fetchCompanyName(sessionUserId);
  console.log(companyName);

  // Fetch vehicles pages with the school name
  const totalPages = await fetchVehiclesPages(query, companyName);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Vehicles</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search vehicles..." />
        <CreateVehicle />
        <BulkImportVehicles />
      </div>
      <Suspense key={query + currentPage} fallback={<VehiclesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} companyName={companyName} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}


