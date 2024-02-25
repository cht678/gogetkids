import { MongoClient, MongoClientOptions } from 'mongodb';
import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

const mongoDBUrl = 'mongodb+srv://systemadmin1:Password123456@cluster0.3fkxfwy.mongodb.net/';

export default async function Page({ params }: { params: { id: string } }) {
    try {
        // Ensure params.id is a valid ObjectId
        const id = new ObjectId(params.id);

        // Connect to MongoDB
        const client = new MongoClient(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions);
        await client.connect();
        const db = client.db();

        // Log a message indicating the start of the operation
        console.log('Fetching data from MongoDB...');

        // Fetch session token
        const sessionName = 'currentSession';
        const token = await fetchSessionToken(sessionName);

        // Log session token
        console.log('Session token:', token);

        // Check if session token is null or undefined
        if (!token) {
            console.error('Session token is null or undefined.');
            return null;
        }

        // Verify and decode the token
        let decodedToken: JwtPayload | string;
        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
            console.log('Decoded token data:', decodedToken);
        } catch (error) {
            console.error('Error verifying token:', error);
            return null;
        }

        // Check token expiry
        if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
            console.error('Token has expired.');
            return null;
        }

        // Extract user ID from decoded token
        const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;

        // Fetch the school name using the user ID
        const schoolName = await fetchSchoolName(sessionUserId);
        console.log('Company Name:', schoolName);

        // Fetch teachers' email addresses
        const teachers = await fetchAllTeachersEmail(schoolName);
        console.log('Teachers:', teachers);

        // Fetch the class object by ID
        const classObject = await fetchClassById(id);
        console.log('Class Object:', classObject);

        // Log a success message
        console.log('Data successfully fetched from MongoDB.');

        // Close the MongoDB connection
        await client.close();

        // Return the main component with the fetched data
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

        // Log a message indicating the failure
        console.error('Failed to fetch data from MongoDB.');

        return null;
    }
}
