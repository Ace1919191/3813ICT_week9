import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = (process.env.mongo_url || 'mongodb://localhost').replace(/\/$/, '');
const MONGO_PORT = process.env.mongo_port || 27017;
const MONGO_DB_NAME = process.env.mongo_name || 'mydb';
const mongoUrl = `${MONGO_URL}:${MONGO_PORT}`;

const starterProducts = [
  {
    id: 1,
    name: 'Laptop',
    type: 'Electronics',
    description: 'Lightweight laptop for study and work',
    price: 999.99,
    units: 8
  },
  {
    id: 2,
    name: 'Phone',
    type: 'Electronics',
    description: 'Smartphone with 128GB storage',
    price: 699.5,
    units: 12
  },
  {
    id: 3,
    name: 'Headphones',
    type: 'Accessories',
    description: 'Wireless over-ear headphones',
    price: 149.99,
    units: 20
  }
];

let client = new MongoClient(mongoUrl);
let db;
let memoryServer;
let connectionPromise;

function connectDB() {
  if (db) return db;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    let connectedDb;

    try {
      await client.connect();
      connectedDb = client.db(MONGO_DB_NAME);
    } catch (error) {
      if (process.env.MONGO_MEMORY === 'false') {
        throw error;
      }

      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      client = new MongoClient(memoryUri);
      await client.connect();
      connectedDb = client.db(MONGO_DB_NAME);
      console.log('Using in-memory MongoDB for local workshop demo.');
    }

    await connectedDb.collection('products').createIndex({ id: 1 }, { unique: true });
    db = connectedDb;
    return db;
  })();

  return connectionPromise.finally(() => {
    connectionPromise = undefined;
  });
}

function getDB() {
  if (!db) throw new Error('DB not initialized. Call connectDB() first.');
  return db;
}

async function resetProductsCollection() {
  const database = await connectDB();

  try {
    await database.dropCollection('products');
  } catch (error) {
    if (error?.code !== 26) throw error;
  }

  const products = database.collection('products');
  await products.createIndex({ id: 1 }, { unique: true });
  return products;
}

async function seedProductsIfEmpty() {
  const database = await connectDB();
  const products = database.collection('products');
  const count = await products.countDocuments({}, { limit: 1 });
  if (count > 0) return false;

  await products.insertMany(starterProducts);
  console.log('Added three starter products to the empty products collection.');
  return true;
}

async function health() {
  if (!db) await connectDB();
  const result = await db.command({ ping: 1 });
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
  return result;
}

async function closeDB() {
  if (client) {
    await client.close();
  }
  if (memoryServer) {
    await memoryServer.stop();
  }
  db = null;
  connectionPromise = undefined;
  client = new MongoClient(mongoUrl);
  memoryServer = null;
  console.log('Database connection closed');
}

export { connectDB, getDB, resetProductsCollection, seedProductsIfEmpty, health, closeDB, db };