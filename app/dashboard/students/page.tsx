import Pagination from '@/app/ui/students/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/students/table';
import { CreateStudent, BulkImportStudents } from '@/app/ui/students/buttons';
import { lusitana } from '@/app/ui/fonts';
import { StudentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchStudentsPages, fetchSessionToken } from '@/app/lib/data';
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
    // Type assertion to assert that token is a non-null string
    decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!) as JwtPayload;
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails or token is null
    return null; // Or handle the error in some other way
  }

  // Extract school_name from decoded token
  const schoolName = decodedToken?.school_name;

  // Fetch students pages with the school name
  const totalPages = await fetchStudentsPages(query, schoolName);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Students</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search students..." />
        <CreateStudent />
        <BulkImportStudents />
      </div>
      <Suspense key={query + currentPage} fallback={<StudentsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} schoolName={schoolName} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}
