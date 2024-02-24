import Pagination from '@/app/ui/parents/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/parents/table';
import { CreateParent } from '@/app/ui/parents/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ParentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchParentsPages, fetchSessionToken } from '@/app/lib/data';
import jwt, { JwtPayload } from 'jsonwebtoken';

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

  // Decode the token to get school_name
  let schoolName;
  try {
    const decodedToken: JwtPayload = jwt.verify(token!, process.env.TOKEN_SECRET!) as JwtPayload;
    schoolName = decodedToken.school_name;
  } catch (error) {
    console.error('Error decoding token:', error);
    // Handle error if token decoding fails
    return null; // Or handle the error in some other way
  }

  const totalPages = await fetchParentsPages(query, schoolName);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Parents</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search parents..." />
        <CreateParent />
      </div>
      <Suspense key={query + currentPage} fallback={<ParentsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} schoolName={schoolName} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}