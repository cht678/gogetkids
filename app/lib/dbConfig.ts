import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri || '', {});

export async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client; // Return the client instance after connecting
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Rethrow the error to handle it elsewhere if needed
    }
}

export async function disconnect() {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
        throw err; // Rethrow the error to handle it elsewhere if needed
    }
}

export default client;
