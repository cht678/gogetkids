const { connect } = require('C:/Users/65861/Desktop/gogetkids/gogetkids-dashboard/app/lib/dbConfig');
const bcrypt = require('bcrypt');

async function seedUsers() {
  const client = await connect();
  try {
    const db = client.db('GoGetKids'); // Specify the database
    const collection = db.collection('users'); // Specify the collection

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create a user object
    const user = {
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: hashedPassword,
      phoneNum: '1234567890',
      role: 'school admin',
      school_name: 'Example High School',
    };

    // Insert the user into the collection
    const result = await collection.insertOne(user);

    console.log(`Successfully seeded user with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    await client.close(); // Close the client connection
  }
}

async function main() {
  try {
    await seedUsers();
  } catch (err) {
    console.error('An error occurred while attempting to seed the database:', err);
  }
}

main();
