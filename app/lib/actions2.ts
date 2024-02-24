'use server'

import { connect, disconnect } from './dbConfig'; // Import the connect and disconnect functions from dbConfig.ts
import { Db, ObjectId } from 'mongodb';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

// Define the schema for school admin data validation using Zod
const schoolAdminSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(), // Password is required
  school_name: z.string(),
  role: z.enum(["school admin"]), // Role must be "school_admin"
});

export async function createSchoolAdmin(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Validate form data using Zod schema
    const validatedData = schoolAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      password: formData.get('password'),
      school_name: formData.get('school_name'),
      role: 'school admin',
    });

    // Check if the email is unique
    client = await connect(); // Connect to MongoDB using the connect function from dbConfig.ts
    const db: Db = client.db('GoGetKids'); // Specify the database name here
    const existingAdmin = await db.collection('adminusers').findOne({ email: validatedData.email });
    if (existingAdmin) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const saltRounds = 10; // Define salt rounds
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Insert school admin data into the MongoDB collection with hashed password
    const result = await db.collection('adminusers').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('School admin created successfully:', result.insertedId);
      revalidatePath('/system-admin-dashboard/school-admins');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create school admin.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating school admin:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}

const updateSchoolAdminSchema = schoolAdminSchema.omit({password: true})

export async function updateSchoolAdmin(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = updateSchoolAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      school_name: formData.get('school_name'),
      role: 'school admin',
    });

    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here

    // Update school admin data in the MongoDB collection
    const result = await db.collection('adminusers').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('School admin updated successfully:', id);
      revalidatePath('/system-admin-dashboard/school-admins')
      return { success: true };
    } else {
      console.error('Failed to update school admin.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating school admin:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}

export async function deleteSchoolAdmin(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    console.log('Connected to MongoDB');

    const db = client.db('GoGetKids'); // Connect to the 'GoGetKids' database
    console.log('Connected to database: test');

    // Delete the admin user from the MongoDB collection
    const result = await db.collection('adminusers').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Admin user deleted successfully:', id);
      revalidatePath('/system-admin-dashboard/school-admins');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Admin user not found:', id);
      return { success: false, errorMessage: 'Admin user not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting admin user:', error.message);
    // You can add additional error handling here if needed
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}




export async function deleteTransportAdmin(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    console.log('Connected to MongoDB');

    const db = client.db('GoGetKids'); // Connect to the 'GoGetKids' database
    console.log('Connected to database: test');

    // Delete the admin user from the MongoDB collection
    const result = await db.collection('adminusers').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Admin user deleted successfully:', id);
      revalidatePath('/system-admin-dashboard/transport-admins');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Admin user not found:', id);
      return { success: false, errorMessage: 'Admin user not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting admin user:', error.message);
    // You can add additional error handling here if needed
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}



// Define the schema for transport admin data validation using Zod
const transportAdminSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(), // Password is required
  company_name: z.string(),
  school_name: z.string(),
  role: z.enum(["transport admin"]), // Role must be "transport_admin"
});

export async function createTransportAdmin(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Validate form data using Zod schema
    const validatedData = transportAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      password: formData.get('password'),
      company_name: formData.get('company_name'),
      school_name: 'NA',
      role: 'transport admin',
    });

    // Check if the email is unique
    client = await connect(); // Connect to MongoDB using the connect function from dbConfig.ts
    const db: Db = client.db('GoGetKids'); // Specify the database name here
    const existingAdmin = await db.collection('adminusers').findOne({ email: validatedData.email });
    if (existingAdmin) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const saltRounds = 10; // Define salt rounds
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Insert transport admin data into the MongoDB collection with hashed password
    const result = await db.collection('adminusers').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Transport admin created successfully:', result.insertedId);
      revalidatePath('/system-admin-dashboard/transport-admins');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create transport admin.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating transport admin:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}



const updateTransportAdminSchema = transportAdminSchema.omit({password: true})

export async function updateTransportAdmin(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = updateTransportAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      company_name: formData.get('company_name'),
      school_name: 'NA',
      role: 'transport admin',
    });

    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here

    // Update transport admin data in the MongoDB collection
    const result = await db.collection('adminusers').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Transport admin updated successfully:', id);
      revalidatePath('/system-admin-dashboard/transport-admins')
      return { success: true };
    } else {
      console.error('Failed to update transport admin.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating transport admin:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}
