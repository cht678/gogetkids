'use server'

import { Db, ObjectId } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { fetchSessionToken } from "@/app/lib/data";
import { fetchCompanyName } from './data3';

// For password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// For token grabbing
const sessionName = 'currentSession';


const driverSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(), // Password is required
  phoneNum: z.string(),
  license: z.string(),
  role: z.enum(["driver"]), // Role must be "driver"
  company_name: z.string(),
});

export async function createDriver(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Validate form data using Zod schema
    const validatedData = driverSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      password: formData.get('password'),
      phoneNum: formData.get('phoneNum'),
      license: formData.get('license'),
      role: 'driver', // Hardcoded role as "driver"
      company_name: companyName, // Pass company_name extracted from token
    });

    // Check if the email is unique
    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here
    const existingDriver = await db.collection('users').findOne({ email: validatedData.email });
    if (existingDriver) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds); // Use bcrypt to hash the password with 10 salt rounds

    // Insert driver data into the MongoDB collection with hashed password
    const result = await db.collection('users').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Driver created successfully:', result.insertedId);
      revalidatePath('/transport-admin-dashboard/drivers');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create driver.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating driver:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}


export async function deleteVehicle(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the vehicle from the MongoDB collection
    const result = await db.collection('vehicles').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Vehicle deleted successfully:', id);
      revalidatePath('/dashboard/vehicles');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Vehicle not found:', id);
      return { success: false, errorMessage: 'Vehicle not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting vehicle:', error.message);
    toast.error('Failed to delete vehicle. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Define the schema for vehicle data validation using Zod
const vehicleSchema = z.object({
  vehicleId: z.string(),
  status: z.string(),
  nextServicing: z.string(), // Updated to accept string values
  company_name: z.string(),
  role: z.string(),
});

export async function createVehicle(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {

    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Validate form data using Zod schema
    const validatedData = vehicleSchema.parse({
      vehicleId: formData.get('vehicleId'),
      status: formData.get('status'),
      nextServicing: formData.get('nextServicing'),
      company_name: companyName,
      role: 'vehicle',
    });

    // Connect to MongoDB
    client = await connect();
    const db = client.db('GoGetKids');

    // Insert vehicle data into the MongoDB collection
    const result = await db.collection('vehicles').insertOne(validatedData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Vehicle created successfully:', result.insertedId);
      toast.success('Vehicle created successfully');
      revalidatePath('/transport-admin-dashboard/vehicles')
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create vehicle.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating vehicle:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export async function updateVehicle(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get company_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = vehicleSchema.parse({
      vehicleId: formData.get('vehicleId'),
      status: formData.get('status'),
      nextServicing: formData.get('nextServicing'),
      company_name: companyName,
    });

    client = await connect();
    const db = client.db('GoGetKids');

    // Update vehicle data in the MongoDB collection
    const result = await db.collection('vehicles').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Vehicle updated successfully:', id);
      revalidatePath('/transport-admin-dashboard/vehicles');
      return { success: true };
    } else {
      console.error('Failed to update vehicle.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating vehicle:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}


const updateDriverSchema = driverSchema.omit({password: true});

export async function updateDriver(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get company_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = updateDriverSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      license: formData.get('license'),
      phoneNum: formData.get('phoneNum'),
      role: 'driver', // Change role to "driver"
      company_name: companyName, // Pass company_name extracted from token
    });

    client = await connect();
    const db = client.db('GoGetKids');

    // Update driver data in the MongoDB collection
    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Driver updated successfully:', id);
      revalidatePath('/transport-admin-dashboard/drivers');
      return { success: true };
    } else {
      console.error('Failed to update driver.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating driver:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}


export async function deleteDriver(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the driver from the MongoDB collection
    const result = await db.collection('users').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Driver deleted successfully:', id);
      revalidatePath('/transport-admin-dashboard/drivers');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Driver not found:', id);
      return { success: false, errorMessage: 'Driver not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting driver:', error.message);
    toast.error('Failed to delete driver. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}


export async function deleteTrip(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the trip from the MongoDB collection
    const result = await db.collection('trips').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Trip deleted successfully:', id);
      revalidatePath('/transport-admin-dashboard/trips');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Trip not found:', id);
      return { success: false, errorMessage: 'Trip not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting trip:', error.message);
    toast.error('Failed to delete trip. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}


const tripSchema = z.object({
  tripId: z.number(), // Add the tripId field
  vehicle_number: z.string(),
  driver_email: z.string().email(),
  school_name: z.string(),
  zone: z.string(),
  company_name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  date: z.string(),
});

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


// Function to create a trip
export async function createTrip(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get company_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Fetch the next available tripId
    const tripId = await getNextTripId();

    // Validate form data using Zod schema
    const validatedData = tripSchema.parse({
      vehicle_number: formData.get('vehicle_number'),
      driver_email: formData.get('driver_email'),
      school_name: formData.get('school_name'),
      zone: formData.get('zone'), // Correctly retrieve 'zone' from formData
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      company_name: companyName,
      date: formData.get('date'),
      tripId: tripId // Assign the fetched tripId
    });

    // Connect to MongoDB
    client = await connect();
    const db = client.db('GoGetKids');

    // Insert trip data into the MongoDB collection
    const result = await db.collection('trips').insertOne({
      ...validatedData,
      company_name: companyName,
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Trip created successfully:', result.insertedId);
      toast.success('Trip created successfully');
      revalidatePath('/transport-admin-dashboard/trips');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create trip.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating trip:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}



export async function updateTrip(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get company_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log(sessionUserId);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserId);
    console.log(companyName);

    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data
    const validatedData = {
      tripId: formData.get('tripId'),
      driver_email: formData.get('driver_email'),
      vehicle_number: formData.get('vehicle_number'),
      school_name: formData.get('school_name'),
      zone: formData.get('zone'),
      date: formData.get('date'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      company_name: companyName
    };

    // Connect to MongoDB
    client = await connect();
    const db = client.db('GoGetKids');

    // Update trip data in the MongoDB collection
    const result = await db.collection('trips').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Trip updated successfully:', id);
      toast.success('Trip updated successfully');
      revalidatePath('/transport-admin-dashboard/trips');
      return { success: true };
    } else {
      console.error('Failed to update trip.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating trip:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
