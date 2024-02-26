import { Pool } from 'pg';
import Form from '@/app/ui/schedules/create-form';
import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';
import {
    fetchAllStudentIds,
    fetchSessionToken,
    fetchSchoolName,
    fetchScheduleById,
    fetchClassById, fetchAllTeachersEmail, fetchStudentById, fetchAllParentsEmail, fetchAllClassNames
} from '@/app/lib/data';

import { ObjectId } from 'mongodb';

const dbConfig = {
    host: 'ep-rough-unit-92773982-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    port: 5432, // Change this if your PostgreSQL server uses a different port
};

const pool = new Pool(dbConfig);


export default async function Page() {
    const schoolName = await fetchSchoolName();
    console.log('Company Name:', schoolName);

    console.log("testing123", schoolName)
    // Fetch parents and classes
    const students = await fetchAllStudentIds(schoolName);

    console.log("testing223", students)


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Schedule', href: '/dashboard/schedules'},
                    {
                        label: 'Create Schedule',
                        href: '/dashboard/schedules/create',
                        active: true,
                    },
                ]}
            />
            <Form students={students}/>
        </main>
    );
}
    /*try {
        const id = new ObjectId(params.id);

        console.log('Fetching data from PostgreSQL...');
        console.log("Test", id);

        const scheduleObject = await fetchScheduleById(id);
        console.log('Schedule Object:', scheduleObject);

        if (!scheduleObject || !scheduleObject.school_name) {
            console.error('Error: School name not found in the fetched data.');
            // Handle the error or return an appropriate value
            return <div>Error: School name not found in the fetched data.</div>;
        }

        const schoolName = scheduleObject.school_name;
        console.log('School Name:', schoolName);

        const students = await fetchAllStudentIds(schoolName);
        console.log('Students:', students);

        console.log('Data successfully fetched from PostgreSQL.');


        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Schedule', href: '/dashboard/schedules' },
                        {
                            label: 'Create Schedule',
                            href: '/dashboard/schedules/create',
                            active: true,
                        },
                    ]}
                />
                <Form students={students} />
            </main>
        );
    } catch (error) {
        console.error('Error:', error);
        console.error('Failed to fetch data from PostgreSQL.');
        return <div>Error: Failed to fetch data from PostgreSQL. Please check the console for details.</div>;
    }
*/

