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
        throw new Error('Max retries exceeded.');
      }
    }
  }
  throw new Error('Function execution failed.');
}

export async function fetchSchoolAdminsPages(query: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const schoolAdminsCollection = db.collection('adminusers');

    // Count all school admins from the users collection based on role
    const count = await schoolAdminsCollection.countDocuments({ role: 'school admin' });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchFilteredSchoolAdmins(query: string, currentPage: number) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const schoolAdminsCollection = db.collection('adminusers');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // Fetch school admins from the users collection based on role
    const schoolAdmins = await schoolAdminsCollection
      .find({ role: 'school admin' })
      .sort({ email: 1 }) // Sort by email in ascending order
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return schoolAdmins;
  });
}

export async function fetchSchoolAdminById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const schoolAdmin = await db.collection('adminusers').findOne({ _id: id, role: 'school admin' });

    await client.close();
    return schoolAdmin;
  });
}


export async function fetchTransportAdminById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const transportAdmin = await db.collection('adminusers').findOne({ _id: id, role: 'transport admin' });

    await client.close();
    return transportAdmin;
  });
}

export async function fetchTransportAdminsPages(query: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const transportAdminsCollection = db.collection('adminusers');

    // Count all transport admins from the users collection based on role
    const count = await transportAdminsCollection.countDocuments({ role: 'transport admin' });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchFilteredTransportAdmins(query: string, currentPage: number) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const transportAdminsCollection = db.collection('adminusers');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // Fetch transport admins from the users collection based on role
    const transportAdmins = await transportAdminsCollection
      .find({ role: 'transport admin' })
      .sort({ email: 1 }) // Sort by email in ascending order
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return transportAdmins;
  });
}
