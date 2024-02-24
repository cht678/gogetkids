'use server'

import { Db, ObjectId } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { fetchSessionToken } from "@/app/lib/data";

// For password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
// For token grabbing
const sessionName = 'currentSession';

// ---------------------------------------------- STUDENTS ----------------------------------------------
// Define the schema for form data validation using Zod
const studentSchema = z.object({
  studentid: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  dob: z.string(),
  address: z.string(),
  postcode: z.string(),
  zone: z.string().optional(),
  class_name: z.string().optional(),
  parent_id: z.string().optional(),
  status: z.enum(["At Home", "In School", "In Bus", "New", ""]),
  school_name: z.string()
});

function generateStudentId() {
  // Generate a random number between 100000 and 999999 and convert it to a number
  return +Math.floor(Math.random() * 900000) + 100000;
}

// Function to check if the generated student ID is unique
async function isStudentIdUnique(db: Db, studentid: number) {
  const existingStudent = await db.collection('students').findOne({ studentid });
  return !existingStudent;
}

export async function createStudent(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const schoolName = decodedToken.school_name;

    // Generate a unique student ID
    let studentid;
    client = await connect();
    const db = client.db('GoGetKids');
    let isUnique = false;
    while (!isUnique) {
      studentid = generateStudentId();
      isUnique = await isStudentIdUnique(db, studentid);
    }

    // Validate form data using Zod schema
    const validatedData = {
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      gender: formData.get('gender'),
      dob: formData.get('dob'),
      address: formData.get('address'),
      postcode: formData.get('postcode'),
      zone: formData.get('zone') || '',
      class_name: formData.get('class_name') || '',
      parent_id: formData.get('parent_id') || '',
      status: 'New',
      school_name: schoolName, // Pass school_name extracted from token
    };

    // Manually add studentid to the data object
    const studentData = {
      studentid,
      ...validatedData,
    };

    // Insert student data into the MongoDB collection
    const result = await db.collection('students').insertOne(studentData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Student created successfully:', result.insertedId);
      revalidatePath('/dashboard/students')
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create student.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating student:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export async function updateStudent(id: string, formData: FormData) {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const schoolName = decodedToken.school_name;
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Explicitly convert studentid to a number
    const studentId = Number(formData.get('studentid'));

    // Validate form data using Zod schema
    const validatedData = studentSchema.parse({
      studentid: studentId,
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      gender: formData.get('gender'),
      dob: formData.get('dob'),
      address: formData.get('address'),
      postcode: formData.get('postcode'),
      zone: formData.get('zone') || '',
      class_name: formData.get('class_name') || '',
      parent_id: formData.get('parent_id') || '',
      status: formData.get('status'),
      school_name: schoolName
    });

    console.log('Validated Data:', validatedData); // Log validated data

    client = await connect();
    console.log('Connected to MongoDB'); // Log successful connection

    const db = client.db('GoGetKids'); // Specify the database name here

    // Update student data in the MongoDB collection
    const result = await db.collection('students').updateOne(
      { _id: objectId }, // Use the ObjectId here
      { $set: validatedData }
    );

    console.log('Update Result:', result); // Log update result

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      // Data updated successfully
      console.log('Student updated successfully:', id);
      revalidatePath('/dashboard/students');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during update
      console.error('Failed to update student.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating student:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed'); // Log when the connection is closed
    }
  }
}

export async function deleteStudent(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the student from the MongoDB collection
    const result = await db.collection('students').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Student deleted successfully:', id);
      revalidatePath('/dashboard/students');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Student not found:', id);
      return { success: false, errorMessage: 'Student not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting student:', error.message);
    toast.error('Failed to delete student. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- PARENTS -----------------------------------------------
// Define the schema for parent data validation using Zod
const parentSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(), // Password is required
  phoneNum: z.string(),
  role: z.enum(["parent"]), // Role must be "parent"
});


export async function createParent(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Validate form data using Zod schema
    const validatedData = parentSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      password: formData.get('password'),
      phoneNum: formData.get('phoneNum'),
      role: 'parent', // Hardcoded role as "parent"
    });

    // Check if the email is unique
    client = await connect();
    const db: Db = client.db('GoGetKids'); // Specify the database name here
    const existingParent = await db.collection('users').findOne({ email: validatedData.email });
    if (existingParent) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const saltRounds = 10; // Define salt rounds
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Insert parent data into the MongoDB collection with hashed password
    const result = await db.collection('users').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Parent created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create parent.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating parent:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

const updateParentSchema = parentSchema.omit({password: true})

export async function updateParent(id: string, formData: FormData) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = updateParentSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phoneNum: formData.get('phoneNum'),
      role: 'parent',
    });

    console.log('Validated Data:', validatedData); // Log validated data

    client = await connect();
    console.log('Connected to MongoDB'); // Log successful connection

    const db = client.db('GoGetKids'); // Specify the database name here

    // Update parent data in the MongoDB collection
    const result = await db.collection('users').updateOne(
      { _id: objectId }, // Use the ObjectId here
      { $set: validatedData }
    );

    console.log('Update Result:', result); // Log update result

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      // Data updated successfully
      console.log('Parent updated successfully:', id);
      revalidatePath('/dashboard/parents');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during update
      console.error('Failed to update parent.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating parent:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed'); // Log when the connection is closed
    }
  }
}

export async function deleteParent(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the parent from the MongoDB collection
    const result = await db.collection('users').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Parent deleted successfully:', id);
      revalidatePath('/dashboard/parents');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Parent not found:', id);
      return { success: false, errorMessage: 'Parent not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting parent:', error.message);
    toast.error('Failed to delete parent. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- TEACHERS ----------------------------------------------
// Define the schema for teacher data validation using Zod
const teacherSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(), // Password is required
  phoneNum: z.string(),
  role: z.enum(["teacher"]), // Role must be "teacher"
  school_name: z.string(),
});

export async function createTeacher(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const school_name = decodedToken.school_name;

    // Validate form data using Zod schema
    const validatedData = teacherSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      password: formData.get('password'),
      phoneNum: formData.get('phoneNum'),
      role: 'teacher', // Hardcoded role as "teacher"
      school_name: school_name, // Pass school_name extracted from token
    });

    // Check if the email is unique
    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here
    const existingTeacher = await db.collection('users').findOne({ email: validatedData.email });
    if (existingTeacher) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds); // Use bcrypt to hash the password with 10 salt rounds

    // Insert teacher data into the MongoDB collection with hashed password
    const result = await db.collection('users').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Teacher created successfully:', result.insertedId);
      revalidatePath('/dashboard/teachers');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create teacher.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating teacher:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

const updateTeacherSchema = teacherSchema.omit({password: true})

export async function updateTeacher(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const school_name = decodedToken.school_name;

    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = updateTeacherSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phoneNum: formData.get('phoneNum'),
      role: 'teacher', // Change role to "teacher"
      school_name: school_name, // Pass school_name extracted from token
    });

    client = await connect();
    const db = client.db('GoGetKids');

    // Update teacher data in the MongoDB collection
    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Teacher updated successfully:', id);
      revalidatePath('/dashboard/teachers');
      return { success: true };
    } else {
      console.error('Failed to update teacher.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating teacher:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export async function deleteTeacher(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the teacher from the MongoDB collection
    const result = await db.collection('users').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Teacher deleted successfully:', id);
      revalidatePath('/dashboard/teachers');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Teacher not found:', id);
      return { success: false, errorMessage: 'Teacher not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting teacher:', error.message);
    toast.error('Failed to delete teacher. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- CLASSES ----------------------------------------------
// Define the schema for class data validation using Zod
const classSchema = z.object({
  class_name: z.string(), // Class name is required
  class_level: z.string(), // Class level is required
  teacherid: z.string().email().optional(), // Teacher ID is required
  school_name: z.string(), // School name is required
});

export async function createClass(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Fetch session token
    const sessionName = 'currentSession'; // Adjust session name according to your setup
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const school_name = decodedToken.school_name;

    // Validate form data using Zod schema
    const validatedData = classSchema.parse({
      class_name: formData.get('class_name'),
      class_level: formData.get('class_level'),
      teacherid: formData.get('teacher_email') || '',
      school_name: school_name, // Pass school_name extracted from token
    });

    // Connect to the MongoDB database
    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here

    // Insert class data into the MongoDB collection
    const result = await db.collection('classes').insertOne(validatedData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Class created successfully:', result.insertedId);
      revalidatePath('/classes');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create class.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating class:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export async function updateClass(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    const sessionName = 'currentSession'; // Adjust session name according to your setup

    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const schoolName = decodedToken.school_name;

    const objectId = new ObjectId(id); // Convert id to ObjectId

    // Validate form data using Zod schema
    const validatedData = classSchema.parse({
      class_name: formData.get('class_name'),
      class_level: formData.get('class_level'),
      teacherid: formData.get('teacherid'),
      school_name: schoolName, // Include schoolName
    });

    console.log('Validated Data:', validatedData);

    client = await connect();
    console.log('Connected to MongoDB');

    const db = client.db('GoGetKids'); // Specify the database name

    // Update class data in the MongoDB collection
    const result = await db.collection('classes').updateOne(
      { _id: objectId }, // Use the ObjectId here
      { $set: validatedData }
    );

    console.log('Update Result:', result);

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Class updated successfully:', id);
      revalidatePath('/classes');
      return { success: true };
    } else {
      console.error('Failed to update class.');
      return { success: false };
    }
  } catch (error: any) {
    console.error('Error updating class:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

export async function deleteClass(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the class from the MongoDB collection
    const result = await db.collection('classes').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Class deleted successfully:', id);
      revalidatePath('/dashboard/class');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Class not found:', id);
      return { success: false, errorMessage: 'Class not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting class:', error.message);
    toast.error('Failed to delete class. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

const scheduleSchema = z.object({
  studentid: z.string(),
  date: z.string(), // Assuming date is in string format, adjust as necessary
  transport_type: z.string(),
  pickup_time: z.string(),
  dismissal_time: z.string(),
  school_name: z.string(),
});

// Function to create a schedule
export async function createSchedule(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {

    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const schoolName = decodedToken.school_name;


    // Validate form data using Zod schema
    const validatedData = scheduleSchema.parse({
      studentid: formData.get('studentid'),
      date: formData.get('date'),
      transport_type: formData.get('transport_type'),
      pickup_time: formData.get('pickup_time'),
      dismissal_time: formData.get('dismissal_time'),
      school_name: schoolName,
    });

    // Check if the combination of studentid and date already exists
    client = await connect();
    const db: Db = client.db('GoGetKids');
    const existingSchedule = await db.collection('schedules').findOne({
      studentid: validatedData.studentid,
      date: validatedData.date,
    });
    if (existingSchedule) {
      throw new Error('A schedule with the same student ID and date already exists.');
    }

    // Insert schedule data into the MongoDB collection
    const result = await db.collection('schedules').insertOne(validatedData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Schedule created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create schedule.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating schedule:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}


export async function updateSchedule(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Fetch session token
    const sessionName = 'currentSession'; // Adjust session name according to your setup
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const schoolName = decodedToken.school_name;

    // Validate form data using Zod schema
    const validatedData = scheduleSchema.parse({
      studentid: formData.get('studentid'),
      date: formData.get('date'),
      transport_type: formData.get('transport_type'),
      pickup_time: formData.get('pickup_time'),
      dismissal_time: formData.get('dismissal_time'),
      school_name: schoolName,
    });

    client = await connect();
    const db = client.db('GoGetKids');

    // Update schedule data in the MongoDB collection
    const result = await db.collection('schedules').updateOne(
      { _id: objectId }, // Use the ObjectId here
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('Schedule updated successfully:', id);
      revalidatePath('/dashboard/schedules');
      return { success: true };
    } else {
      console.error('Failed to update schedule.');
      return { success: false };
    }
  } catch (error: any) {
    console.error('Error updating schedule:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}


export async function deleteSchedule(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the schedule from the MongoDB collection
    const result = await db.collection('schedules').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Schedule deleted successfully:', id);
      revalidatePath('/dashboard/schedules');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Schedule not found:', id);
      return { success: false, errorMessage: 'Schedule not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting schedule:', error.message);
    toast.error('Failed to delete schedule. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}
