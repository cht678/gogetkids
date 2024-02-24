'use server'

import Papa from 'papaparse';
import { connect, disconnect } from './dbConfig';

// ---------------------------------------------- TEACHERS -----------------------------------------------

interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  school_name: string;
}

export async function parseTeachersJSON(jsonData: any): Promise<Teacher[]> {
  console.log('Parsing JSON data...');

  const parsedTeachers: Teacher[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedTeachers;
}

export async function parseTeachersCSVToJSON(csvData: string): Promise<Teacher[]> {
  console.log('Parsing CSV data to JSON...');

  const parsedTeachers: Teacher[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Teacher interface properties
      const { email, firstName, lastName, password, phoneNum, role, school_name } = data as any;
      const teacher: Teacher = {
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        password: password || '',
        phoneNum: phoneNum || '',
        role: role || '',
        school_name: school_name || ''
      };
      parsedTeachers.push(teacher);
    }
    console.log('CSV parsing complete');
    return parsedTeachers;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

export async function insertTeachersFromJSON(parsedTeachers: Teacher[]): Promise<void> {
  console.log('Inserting teachers into the database...');

  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const teachersCollection = database.collection('users');

    await teachersCollection.insertMany(parsedTeachers.map(teacher => ({
      ...teacher,
      role: 'teacher', // Add role field with value 'teacher'
    })));

    console.log('Teachers inserted successfully');
  } catch (error) {
    console.error('Error inserting teachers:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
// -------------------------------------------------------------------------------------------------------

// ---------------------------------------------- STUDENTS -----------------------------------------------
interface Student {
  studentid: number | undefined;
  firstname: string;
  lastname: string;
  gender: string;
  address: string;
  postcode: number;
  dob: string;
  zone: string;
  parent_id: string;
  class_name: string;
  school_name: string;
}

// Function to generate a random student ID
function generateStudentId(): number {
  // Generate a random number between 100000 and 999999 and convert it to a number
  return Math.floor(Math.random() * 900000) + 100000;
}

// Function to check if the generated student ID is unique
async function isStudentIdUnique(studentid: number): Promise<boolean> {
  const client = await connect();
  const db = client.db('GoGetKids');
  const existingStudent = await db.collection('students').findOne({ studentid });
  await client.close();
  return !existingStudent;
}

export async function parseStudentsJSON(jsonData: any): Promise<Student[]> {
  console.log('Parsing JSON data for students...');
  const parsedStudents: Student[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  console.log('Generating and validating student IDs...');
  for (const student of parsedStudents) {
    let isUnique = false;
    let studentid: number | undefined;
    while (!isUnique) {
      studentid = generateStudentId();
      isUnique = await isStudentIdUnique(studentid);
    }
    student.studentid = studentid;
  }
  console.log('Student IDs generated and validated successfully');
  return parsedStudents;
}

export async function parseStudentsCSVToJSON(csvData: string): Promise<Student[]> {
  console.log('Parsing CSV data to JSON...');

  const parsedStudents: Student[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Student interface properties
      const { firstname, lastname, gender, address, postcode, dob, zone, parent_id, class_name, school_name } = data as any;
      const student: Student = {
        studentid: undefined, // Placeholder, will be generated later
        firstname: firstname || '',
        lastname: lastname || '',
        gender: gender || '',
        address: address || '',
        postcode: parseInt(postcode) || 0,
        dob: dob || '',
        zone: zone || '',
        parent_id: parent_id || '',
        class_name: class_name || '',
        school_name: school_name || ''
      };
      parsedStudents.push(student);
    }
    console.log('CSV parsing complete');
    console.log('Generating and validating student IDs...');
    for (const student of parsedStudents) {
      let isUnique = false;
      let studentid: number | undefined;
      while (!isUnique) {
        studentid = generateStudentId();
        isUnique = await isStudentIdUnique(studentid);
      }
      student.studentid = studentid;
    }
    console.log('Student IDs generated and validated successfully');
    return parsedStudents;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

export async function insertStudentsFromJSON(parsedStudents: Student[]): Promise<void> {
  console.log('Inserting students into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const studentsCollection = database.collection('students');
    await studentsCollection.insertMany(parsedStudents);
    console.log('Students inserted successfully');
  } catch (error) {
    console.error('Error inserting students:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
// -------------------------------------------------------------------------------------------------------

// ---------------------------------------------- CLASSES -----------------------------------------------
// Interface for classes
interface Class {
  class_name: string;
  class_level: string;
  teacherid: string;
  school_name: string;
}

// Function to parse JSON data for classes
export async function parseClassesJSON(jsonData: any): Promise<Class[]> {
  console.log('Parsing JSON data for classes...');

  const parsedClasses: Class[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedClasses;
}

// Function to parse CSV data to JSON for classes
export async function parseClassesCSVToJSON(csvData: string): Promise<Class[]> {
  console.log('Parsing CSV data to JSON for classes...');

  const parsedClasses: Class[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Class interface properties
      const { class_name, class_level, teacherid, school_name } = data as any;
      const classObj: Class = {
        class_name: class_name || '',
        class_level: class_level || '',
        teacherid: teacherid || '',
        school_name: school_name || ''
      };
      parsedClasses.push(classObj);
    }
    console.log('CSV parsing complete');
    return parsedClasses;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

// Function to insert classes into the database
export async function insertClassesFromJSON(parsedClasses: Class[]): Promise<void> {
  console.log('Inserting classes into the database...');

  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const classesCollection = database.collection('classes');

    await classesCollection.insertMany(parsedClasses);

    console.log('Classes inserted successfully');
  } catch (error) {
    console.error('Error inserting classes:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

// -------------------------------------------------------------------------------------------------------

// ---------------------------------------------- Schedules -----------------------------------------------
// Interface for schedules
interface Schedule {
  studentid: number;
  date: string;
  transport_type: string;
  pickup_time: string;
  dismissal_time: string;
}

// Function to parse JSON data for schedules
export async function parseSchedulesJSON(jsonData: any): Promise<Schedule[]> {
  console.log('Parsing JSON data for schedules...');
  const parsedSchedules: Schedule[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  return parsedSchedules;
}

// Function to parse CSV data to JSON for schedules
export async function parseSchedulesCSVToJSON(csvData: string): Promise<Schedule[]> {
  console.log('Parsing CSV data to JSON for schedules...');

  const parsedSchedules: Schedule[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Schedule interface properties
      const { studentid, date, transport_type, pickup_time, dismissal_time } = data as any;
      const schedule: Schedule = {
        studentid: parseInt(studentid),
        date: date || '',
        transport_type: transport_type || '',
        pickup_time: pickup_time || '',
        dismissal_time: dismissal_time || ''
      };
      parsedSchedules.push(schedule);
    }
    console.log('CSV parsing complete');
    return parsedSchedules;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

// Function to insert schedules into the database
export async function insertSchedulesFromJSON(parsedSchedules: Schedule[]): Promise<void> {
  console.log('Inserting schedules into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const schedulesCollection = database.collection('schedules');
    await schedulesCollection.insertMany(parsedSchedules);
    console.log('Schedules inserted successfully');
  } catch (error) {
    console.error('Error inserting schedules:', error);
    throw error;
  } finally {
    await disconnect();
  }
}




interface Vehicle {
  vehicleId: string;
  status: string;
  nextServicing: string;
  company_name: string;
  role: string;
}

export async function parseVehiclesJSON(jsonData: any): Promise<Vehicle[]> {
  console.log('Parsing JSON data for vehicles...');
  const parsedVehicles: Vehicle[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  return parsedVehicles;
}

export async function parseVehiclesCSVToJSON(csvData: string): Promise<Vehicle[]> {
  console.log('Parsing CSV data to JSON for vehicles...');

  const parsedVehicles: Vehicle[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Vehicle interface properties
      const { vehicleId, status, nextServicing, company_name, role } = data as any;
      const vehicle: Vehicle = {
        vehicleId: vehicleId || '',
        status: status || '',
        nextServicing: nextServicing || '',
        company_name: company_name || '',
        role: role || ''
      };
      parsedVehicles.push(vehicle);
    }
    console.log('CSV parsing complete');
    return parsedVehicles;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

export async function insertVehiclesFromJSON(parsedVehicles: Vehicle[]): Promise<void> {
  console.log('Inserting vehicles into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const vehiclesCollection = database.collection('vehicles');
    await vehiclesCollection.insertMany(parsedVehicles);
    console.log('Vehicles inserted successfully');
  } catch (error) {
    console.error('Error inserting vehicles:', error);
    throw error;
  } finally {
    await disconnect();
  }
}



interface Trip {
  vehicle_number: string;
  driver_email: string;
  company_name: string;
  school_name: string;
  zone: string;
  start_time: Date;
  end_time: Date;
}

export async function parseTripsJSON(jsonData: any): Promise<Trip[]> {
  console.log('Parsing JSON data for trips...');
  const parsedTrips: Trip[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  return parsedTrips;
}

export async function parseTripsCSVToJSON(csvData: string): Promise<Trip[]> {
  console.log('Parsing CSV data to JSON for trips...');
  const parsedTrips: Trip[] = [];
  // Your CSV parsing logic here
  return parsedTrips;
}

async function getNextTripId(): Promise<number> {
  try {
    const client = await connect();
    const db = client.db('GoGetKids');
    const tripsCollection = db.collection('trips');

    // Find the document with the highest tripId
    const maxTrip = await tripsCollection.find().sort({ tripId: -1 }).limit(1).next();

    await client.close();

    if (maxTrip && maxTrip.tripId) {
      // If there is a max tripId, increment it by 1
      const nextTripId = Number(maxTrip.tripId) + 1;
      return nextTripId;
    } else {
      // If no documents are found or tripId is missing, start with 1
      return 1;
    }
  } catch (error) {
    console.error('Error getting next tripId:', error);
    throw error;
  }
}


export async function insertTripsFromJSON(parsedTrips: Trip[]): Promise<void> {
  console.log('Inserting trips into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const tripsCollection = database.collection('trips');
    await tripsCollection.insertMany(parsedTrips.map(trip => ({
      ...trip,
      start_time: new Date(trip.start_time), // Convert to Date object if needed
      end_time: new Date(trip.end_time) // Convert to Date object if needed
    })));
    console.log('Trips inserted successfully');
  } catch (error) {
    console.error('Error inserting trips:', error);
    throw error;
  } finally {
    await disconnect();
  }
}




// Interface for drivers
interface Driver {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  company_name: string;
  license: string;
}

// Function to parse JSON data for drivers
export async function parseDriversJSON(jsonData: any): Promise<Driver[]> {
  console.log('Parsing JSON data for drivers...');
  const parsedDrivers: Driver[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  return parsedDrivers;
}

// Function to parse CSV data to JSON for drivers
export async function parseDriversCSVToJSON(csvData: string): Promise<Driver[]> {
  console.log('Parsing CSV data to JSON for drivers...');

  const parsedDrivers: Driver[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Driver interface properties
      const { email, firstName, lastName, password, phoneNum, role, company_name, license } = data as any;
      const driver: Driver = {
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        password: password || '',
        phoneNum: phoneNum || '',
        role: role || '',
        company_name: company_name || '',
        license: license || ''
      };
      parsedDrivers.push(driver);
    }
    console.log('CSV parsing complete');
    return parsedDrivers;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

// Function to insert drivers into the database
export async function insertDriversFromJSON(parsedDrivers: Driver[]): Promise<void> {
  console.log('Inserting drivers into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const driversCollection = database.collection('users');
    await driversCollection.insertMany(parsedDrivers.map(driver => ({
      ...driver,
      role: 'driver' // Ensure role is set to 'driver'
    })));
    console.log('Drivers inserted successfully');
  } catch (error) {
    console.error('Error inserting drivers:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
