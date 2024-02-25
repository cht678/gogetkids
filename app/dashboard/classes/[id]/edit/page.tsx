import { MongoClient, MongoClientOptions } from 'mongodb';
import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSchoolName, fetchUserCredentials } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

const mongoDBUrl = 'mongodb+srv://systemadmin1:Password123456@cluster0.3fkxfwy.mongodb.net/';

let client: MongoClient;

async function connectToMongoDB() {
    client = new MongoClient(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions);

    // Set up event listeners for MongoDB connection events
    client.on('close', () => {
        console.error('MongoDB connection closed');
        // Attempt to reconnect or handle accordingly
        connectToMongoDB();
    });

    client.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        // Attempt to reconnect or handle accordingly
        connectToMongoDB();
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // Attempt to reconnect or handle accordingly
        connectToMongoDB();
    }
}

export default async function Page({ params }: { params: {
        password: string;
        username: string;
        id: string } }) {
    try {
        // Ensure params.id is a valid ObjectId
        const id = new ObjectId(params.id);

        // Connect to MongoDB
        await connectToMongoDB();

        // Log a message indicating the start of the operation
        console.log('Fetching data from MongoDB...');

        // Fetch user credentials using some form of authentication (e.g., username/password)
        const userCredentials = await fetchUserCredentials(params.username, params.password);

        // Check if user credentials are valid
        if (!userCredentials) {
            console.error('Invalid username or password.');
            throw new Error('Invalid username or password.');
        }

        // Generate a JWT token
        const token = jwt.sign({ id: userCredentials._id, username: userCredentials.username }, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        // Log the token
        console.log('Generated token:', token);

        // Fetch the school name using the user ID
        const schoolName = await fetchSchoolName(userCredentials._id);
        console.log('School Name:', schoolName);

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

        // Return an error component or null
        return <div>Error: Failed to fetch data from MongoDB. Please check the console for details.</div>;
    }
}
