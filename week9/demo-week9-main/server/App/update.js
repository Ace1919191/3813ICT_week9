import { connectDB, closeDB } from '../db.js';

async function updateProductById(productId, changes) {
  const db = await connectDB();
  const products = db.collection('products');

  const result = await products.updateOne(
    { id: Number(productId) },
    { $set: changes }
  );

  console.log(`Matched ${result.matchedCount}, updated ${result.modifiedCount}`);
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('update.js')) {
  const productId = process.argv[2] || 1;
  const newName = process.argv[3] || 'Laptop Pro';
  const newPrice = Number(process.argv[4] || 1299.99);
  const newDescription = process.argv.slice(5).join(' ') || 'Updated model with more memory and SSD';

  console.log(`Updating product with ID ${productId}...`);

  const changes = {
    name: newName,
    price: newPrice,
    type: 'Electronics',
    description: newDescription,
    units: 10
  };

  updateProductById(productId, changes).catch((error) => {
    console.error('Error updating product:', error);
    process.exitCode = 1;
  }).finally(async () => {
    await closeDB();
  });
}

export { updateProductById };