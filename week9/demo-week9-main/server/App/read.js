import { connectDB, closeDB } from '../db.js';

async function readProducts() {
  const db = await connectDB();
  const products = db.collection('products');
  const items = await products.find({}).toArray();

  console.log('Products in database:');
  console.log(items);
  return items;
}

if (process.argv[1] && process.argv[1].endsWith('read.js')) {
  readProducts().catch((error) => {
    console.error('Error reading products:', error);
    process.exitCode = 1;
  }).finally(async () => {
    await closeDB();
  });
}

export { readProducts };