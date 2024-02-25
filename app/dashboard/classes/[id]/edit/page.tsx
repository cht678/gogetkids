import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const id = new ObjectId(params.id);

        // Fetch session token
        const sessionName = 'currentSession';
        const token = await fetchSessionToken(sessionName);
        console.log('Session token:', token);

        if (!token) {
            console.error('Session token is null or undefined.');
            return null;
        }

        // Verify and decode the token
        let decodedToken: JwtPayload | string;
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        console.log('Decoded token data:', decodedToken);

        // Check token expiry
        if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
            console.error('Token has expired.');
            return null;
        }

        // Extract user ID from decoded token
        const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;

        // Fetch the company name using the user ID
        const schoolName = await fetchSchoolName(sessionUserId);
        console.log('Company Name:', schoolName);

        const teachers = await fetchAllTeachersEmail(schoolName);

        const classObject = await fetchClassById(id);

        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Classes', href: '/dashboard/classes' },
                        {
                            label: 'Edit Class',
                            href: `/dashboard/classes/${params.id}/edit`,
                            active: true,
                        },
                    ]}
                />
                <Form classroom={classObject} teachers={teachers} />
            </main>
        );
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
