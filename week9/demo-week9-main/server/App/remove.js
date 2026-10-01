import { connectDB, closeDB } from '../db.js';

async function removeProductById(productId) {
  const db = await connectDB();
  const products = db.collection('products');

  const result = await products.deleteOne({ id: Number(productId) });
  console.log(`Deleted ${result.deletedCount} product`);
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('remove.js')) {
  const productId = process.argv[2] || 1;
  removeProductById(productId).catch((error) => {
    console.error('Error removing product:', error);
    process.exitCode = 1;
  }).finally(async () => {
    await closeDB();
  });
}

export { removeProductById };