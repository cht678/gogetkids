import Form from '@/app/ui/students/create-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchAllParentsEmail, fetchAllClassNames, fetchSchoolName } from '@/app/lib/data';

export default async function Page() {
    // Fetch the company name
    const schoolName = await fetchSchoolName();
    console.log('Company Name:', schoolName);

    console.log("testing123", schoolName)
    // Fetch parents and classes
    const parents = await fetchAllParentsEmail();
    const classes = await fetchAllClassNames(schoolName);
    console.log("testing223", parents)
    console.log("testing323", classes)
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Students', href: '/dashboard/students' },
                    {
                        label: 'Create Student',
                        href: '/dashboard/students/create',
                        active: true,
                    },
                ]}
            />
            {/* Pass in fetched parents and classes to Form */}
            <Form parents={parents} classes={classes} />
        </main>
    );
}
