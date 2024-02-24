import { connect, disconnect } from './dbConfig';
import { Db, ObjectId } from 'mongodb';

const ITEMS_PER_PAGE = 6;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 1000;

async function executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      return await fn();
    } catch (error) {
      console.error('Error:', error);
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error('Max retries exceeded.');
        throw new Error('Max retries exceeded.'); // Explicitly throw an error
      }
    }
  }
  throw new Error('Function execution failed.'); // Add a default return statement
}

export async function fetchSchoolName(id: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const objectId = new ObjectId(id);

    const adminUser = await db.collection('adminusers').findOne(
      { _id: objectId }, // Query
      { projection: { school_name: 1 } } // Projection to only include the 'school_name' field
    );

    await client.close();
    return adminUser?.school_name; // Return school_name field
  });
}

export async function fetchFilteredStudents(query: string, currentPage: number, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const students = await studentsCollection
      .find({ school_name: schoolName }) // Filter by school name
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return students;
  });
}

export async function fetchStudentsPages(query: string, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');

    const count = await studentsCollection.countDocuments({ school_name: schoolName }); // Count documents based on school name
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchStudentById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const student = await db.collection('students').findOne({ _id: id });

    await client.close();
    return student;
  });
}

export async function fetchStudentNameById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const student = await db.collection('students').findOne(
      { _id: id },
      { projection: { _id: 0, name: { $concat: ["$firstname", " ", "$lastname"] } } } // Project the combined name field
    );

    await client.close();
    return student;
  });
}

export async function fetchStudentsWithNoParent(schoolName: string) {
  try {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');

    // Fetch students from the specified school with blank parent_id
    const students = await studentsCollection.find({ school_name: schoolName, parent_id: "" }).toArray();

    await client.close();
    return students;
  } catch (error) {
    console.error('Error fetching students with no parent:', error);
    throw new Error('Failed to fetch students with no parent.');
  }
}

export async function fetchAllStudentIds(schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');

    const studentIds = await studentsCollection
      .find({ school_name: schoolName }) // Include school_name in the find condition
      .project({ _id: 0, studentid: 1 })
      .toArray();

    await client.close();
    return studentIds.map(student => student.studentid);
  });
}

// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- PARENTS -----------------------------------------------

export async function fetchFilteredParents(query: string, currentPage: number, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');
    const parentsCollection = db.collection('users');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // Fetch students from the specified school
    const students = await studentsCollection
      .find({ school_name: schoolName })
      .toArray();

    // Extract parent IDs (emails) from the students
    const parentIds = students.map(student => student.parent_id);

    // Fetch parents from the users collection based on parent IDs (emails)
    const parents = await parentsCollection
      .find({ role: 'parent', email: { $in: parentIds } })
      .sort({ email: 1 }) // Sort by email in ascending order
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return parents;
  });
}

export async function fetchParentsPages(query: string, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');
    const parentsCollection = db.collection('users');

    // Fetch students from the specified schoolf
    const students = await studentsCollection
      .find({ school_name: schoolName })
      .toArray();

    // Extract parent IDs (emails) from the students
    const parentIds = students.map(student => student.parent_id);

    // Count parents from the users collection based on parent IDs (emails)
    const count = await parentsCollection.countDocuments({ role: 'parent', email: { $in: parentIds } });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchAllParentsEmail() {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const parentsCollection = db.collection('users');

    const parentsEmails = await parentsCollection
      .find({ role: 'parent' }) // Include school_name in the find condition
      .project({ _id: 0, email: 1 })
      .toArray();

    await client.close();
    return parentsEmails.map(parent => parent.email);
  });
}


export async function fetchParentById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const parent = await db.collection('users').findOne({ _id: id, role: 'parent' });

    await client.close();
    return parent;
  });
}

export async function fetchStudentsByParentsEmail(emails: string[]) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    // Array to store student IDs for each parent email
    const studentIdsByParentEmail: any[] = [];

    // Loop through each parent email
    for (const email of emails) {
      // Search for students associated with the current parent email
      const students = await db.collection('students').find({ parent_id: email }).toArray();

      // Extract student IDs and store them for the current parent email
      const studentIds = students.map(student => student._id);
      studentIdsByParentEmail.push({ email, studentIds });
    }

    await client.close();
    return studentIdsByParentEmail;
  });
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- TEACHERS ----------------------------------------------

// ------------------------------------------------------------------------------------------------------
export async function fetchFilteredTeachers(query: string, currentPage: number, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const teachersCollection = db.collection('users');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const teachers = await teachersCollection
      .find({ role: 'teacher', school_name: schoolName })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return teachers;
  });
}

export async function fetchTeachersPages(query: string, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const teachersCollection = db.collection('users');

    const count = await teachersCollection.countDocuments({ role: 'teacher', school_name: schoolName });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchAllTeachersEmail(schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const teachersCollection = db.collection('users');

    const teachersEmails = await teachersCollection
      .find({ role: 'teacher', school_name: schoolName }) // Include school_name in the find condition
      .project({ _id: 0, email: 1 })
      .toArray();

    await client.close();
    return teachersEmails.map(teacher => teacher.email);
  });
}


export async function fetchTeacherById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const teacher = await db.collection('users').findOne({ _id: id, role: 'teacher' });

    await client.close();
    return teacher;
  });
}
// ---------------------------------------------- CLASSES -----------------------------------------------
export async function fetchFilteredClasses(query: string, currentPage: number, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const classesCollection = db.collection('classes');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const students = await classesCollection
      .find({ school_name: schoolName }) // Filter by school_name
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return students;
  });
}

export async function fetchClassesPages(query: string, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const classesCollection = db.collection('classes');

    const count = await classesCollection.countDocuments({ school_name: schoolName }); // Count documents with specified school_name

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    await client.close();
    return totalPages;
  });
}

export async function fetchAllClassNames(schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const classesCollection = db.collection('classes');

    const classNames = await classesCollection
      .find({ school_name: schoolName }) // Include school_name in the find condition
      .project({ _id: 0, class_name: 1 })
      .toArray();

    await client.close();
    return classNames.map(clazz => clazz.class_name);
  });
}


export async function fetchClassById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const classroom = await db.collection('classes').findOne({ _id: id });

    await client.close();
    return classroom;
  });
}

// ------------------------------------------------------------------------------------------------------
export async function fetchSessionToken(sessionName: string): Promise<string | null> {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const session = await db.collection('sessions').findOne({ sessionName });

    await client.close();
    return session ? session.token : null;
  });
}


export async function fetchFilteredSchedules(query: string, currentPage: number, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const schedulesCollection = db.collection('schedules');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const schedules = await schedulesCollection
      .find({ school_name: schoolName }) // Filter by school name
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    // Convert date objects to strings
    const schedulesWithDateString = schedules.map(schedule => {
      // Check if date field is a string or a Date object
      schedule.date = typeof schedule.date === 'string' ? schedule.date : new Date(schedule.date).toLocaleDateString();
      // Check if pickup_time field is a string or a Date object
      schedule.pickup_time = typeof schedule.pickup_time === 'string' ? schedule.pickup_time : new Date(schedule.pickup_time).toLocaleTimeString();
      // Check if dismissal_time field is a string or a Date object
      schedule.dismissal_time = typeof schedule.dismissal_time === 'string' ? schedule.dismissal_time : new Date(schedule.dismissal_time).toLocaleTimeString();
      return schedule;
    });

    await client.close();
    return schedulesWithDateString;
  });
}

export async function fetchSchedulesPages(query: string, schoolName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const schedulesCollection = db.collection('schedules');

    const count = await schedulesCollection.countDocuments({ school_name: schoolName }); // Count documents based on school name
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}


export async function fetchScheduleById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const schedule = await db.collection('schedules').findOne({ _id: id });

    await client.close();
    return schedule;
  });
}