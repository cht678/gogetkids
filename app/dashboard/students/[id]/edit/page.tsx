import Form from '@/app/ui/students/edit-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchStudentById, fetchAllParentsEmail, fetchAllClassNames, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id); // Convert id to ObjectId
  const student = await fetchStudentById(id);

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

  // Extract user ID from decoded token
  const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;

  // Fetch the company name using the user ID
  const schoolName = await fetchSchoolName(sessionUserId);
  console.log('Company Name:', schoolName);

  const parents = await fetchAllParentsEmail();
  const classes = await fetchAllClassNames(schoolName);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'Edit Student',
            href: `/dashboard/students/${params.id}/edit`, // Use params.id directly here
            active: true,
          },
        ]}
      />
      <Form student={student} classes={classes} parents={parents} />
    </main>
  );
}
