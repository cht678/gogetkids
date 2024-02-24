import { object } from 'zod';
import { connect, disconnect } from './dbConfig';
import { Db, ObjectId } from 'mongodb';
import { fetchSessionToken } from './data';

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

export async function fetchFilteredVehicles(query: string, currentPage: number, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehiclesCollection = db.collection('vehicles');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const vehicles = await vehiclesCollection
      .find({ company_name: companyName }) // Filter by school name
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return vehicles;
  });
}

export async function fetchVehiclesPages(query: string, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehiclesCollection = db.collection('vehicles');

    const count = await vehiclesCollection.countDocuments({ company_name: companyName }); // Count documents based on school name
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchVehicleById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehicle = await db.collection('vehicles').findOne({ _id: id });

    await client.close();
    return vehicle;
  });
}

export async function fetchCompanyName(id: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');

    const objectId = new ObjectId(id);

    const adminUser = await db.collection('adminusers').findOne(
      { _id: objectId }, // Query
      { projection: { company_name: 1 } } // Projection to only include the 'company_name' field
    );

    await client.close();
    return adminUser?.company_name; // Return company_name field
  });
}


export async function fetchFilteredDrivers(query: string, currentPage: number, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const driversCollection = db.collection('users');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const drivers = await driversCollection
      .find({ role: 'driver', company_name: companyName })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    await client.close();
    return drivers;
  });
}

export async function fetchDriversPages(query: string, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const driversCollection = db.collection('users');

    const count = await driversCollection.countDocuments({ role: 'driver', company_name: companyName });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}

export async function fetchDriverById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehicle = await db.collection('users').findOne({ _id: id });

    await client.close();
    return vehicle;
  });
}

export async function fetchFilteredTrips(query: string, currentPage: number, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const tripsCollection = db.collection('trips');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const trips = await tripsCollection
      .find({ company_name: companyName }) // Filter by company name
      .sort({ date: 1 }) // Sort by date
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    // Convert start_time and end_time to strings if they are Date objects
    trips.forEach((trip: any) => {
      if (trip.start_time instanceof Date) {
        trip.start_time = trip.start_time.toISOString().split('T')[0]; // Keep only the date part
      }
      if (trip.end_time instanceof Date) {
        trip.end_time = trip.end_time.toISOString().split('T')[0]; // Keep only the date part
      }
    });

    await client.close();
    return trips;
  });
}

export async function fetchTripsPages(query: string, companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const tripsCollection = db.collection('trips');

    const count = await tripsCollection.countDocuments({ company_name: companyName }); // Count documents based on company name
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    await client.close();
    return totalPages;
  });
}


export async function fetchAllDriversEmails(companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const driversCollection = db.collection('users');

    const driversEmails = await driversCollection
      .find({ role: 'driver', company_name: companyName }) // Include company_name in the query
      .project({ _id: 0, email: 1 })
      .toArray();

    await client.close();
    return driversEmails.map(driver => driver.email);
  });
}


export async function fetchAllVehicleIds(companyName: string) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehiclesCollection = db.collection('vehicles');

    const vehicleIds = await vehiclesCollection
      .find({ company_name: companyName })
      .project({ _id: 0, vehicleId: 1 })
      .toArray();

    await client.close();
    return vehicleIds.map(vehicle => vehicle.vehicleId); // Adjust according to the actual field name in your documents
  });
}


export async function fetchTripById(id: ObjectId) {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const vehicle = await db.collection('trips').findOne({ _id: id });

    await client.close();
    return vehicle;
  });
}
