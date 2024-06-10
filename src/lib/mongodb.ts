import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGODB_URI || '');

export const db = client.db(process.env.MONGODB_NAME);
