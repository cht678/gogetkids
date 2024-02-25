import { Pool } from 'pg';
import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSchoolName } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const dbConfig = {
    host: 'ep-rough-unit-92773982-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    port: 5432, // Change this if your PostgreSQL server uses a different port
};

const pool = new Pool(dbConfig);

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const id = new ObjectId(params.id);

        console.log('Fetching data from PostgreSQL...');

        // Your existing code for fetching data
        const schoolName = await fetchSchoolName(); // Assuming fetchSchoolName doesn't need parameters
        console.log('School Name:', schoolName);

        const teachers = await fetchAllTeachersEmail(schoolName);
        console.log('Teachers:', teachers);

        const classObject = await fetchClassById(id);
        console.log('Class Object:', classObject);

        console.log('Data successfully fetched from PostgreSQL.');

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
        console.error('Failed to fetch data from PostgreSQL.');
        return <div>Error: Failed to fetch data from PostgreSQL. Please check the console for details.</div>;
    }
}
