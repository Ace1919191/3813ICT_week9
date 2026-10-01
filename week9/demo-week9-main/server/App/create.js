import { resetProductsCollection, closeDB } from '../db.js';

async function createProducts() {
  const products = await resetProductsCollection();
  console.log('Products collection dropped and recreated before creation.');

  const items = [
      {
        id: 1,
        name: 'Laptop',
        price: 999.99,
        type: 'Electronics',
        description: 'Lightweight laptop for study and work',
        units: 8
      },
      {
        id: 2,
        name: 'Phone',
        price: 699.5,
        type: 'Electronics',
        description: 'Smartphone with 128GB storage',
        units: 12
      },
      {
        id: 3,
        name: 'Headphones',
        price: 149.99,
        type: 'Accessories',
        description: 'Wireless over-ear headphones',
        units: 20
      }
  ];

  const result = await products.insertMany(items);
  console.log(`${result.insertedCount} products created`);
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('create.js')) {
  createProducts().catch((error) => {
    console.error('Error creating products:', error);
    process.exitCode = 1;
  }).finally(async () => {
    await closeDB();
  });
}

export { createProducts };
