import { MongoClient, MongoClientOptions } from 'mongodb';
import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSchoolName, fetchUserCredentials } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const mongoDBUrl = 'mongodb+srv://systemadmin1:Password123456@cluster0.3fkxfwy.mongodb.net/';

let client: MongoClient;

async function connectToMongoDB() {
    const options: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions;

    try {
        client = new MongoClient(mongoDBUrl, options);
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Propagate the error to the caller
    }
}

export default async function Page({ params }: { params: { password: string; username: string; id: string } }) {
    try {
        const id = new ObjectId(params.id);

        await connectToMongoDB();
        console.log('Fetching data from MongoDB...');

        const userCredentials = await fetchUserCredentials(params.username, params.password);

        if (!userCredentials) {
            console.error('Invalid username or password.');
            throw new Error('Invalid username or password.');
        }

        const token = jwt.sign({ id: userCredentials._id, username: userCredentials.username }, process.env.TOKEN_SECRET!, { expiresIn: '1h' });
        console.log('Generated token:', token);

        const schoolName = await fetchSchoolName(userCredentials._id);
        console.log('School Name:', schoolName);

        const teachers = await fetchAllTeachersEmail(schoolName);
        console.log('Teachers:', teachers);

        const classObject = await fetchClassById(id);
        console.log('Class Object:', classObject);

        console.log('Data successfully fetched from MongoDB.');

        await client.close();

        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Classes', href: '/dashboard/classes' },
                        { label: 'Edit Class', href: `/dashboard/classes/${params.id}/edit`, active: true },
                    ]}
                />
                <Form classroom={classObject} teachers={teachers} />
            </main>
        );
    } catch (error) {
        console.error('Error:', error);
        console.error('Failed to fetch data from MongoDB.');
        return <div>Error: Failed to fetch data from MongoDB. Please check the console for details.</div>;
    }
}
