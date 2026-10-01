import { closeDB } from '../db.js';
import { addProducts } from './add.js';
import { readProducts } from './read.js';
import { updateProductById } from './update.js';
import { removeProductById } from './remove.js';

async function main() {
  await addProducts();
  await readProducts();
  await updateProductById(1, {
    name: 'Laptop Pro',
    price: 1299.99,
    type: 'Electronics',
    description: 'Updated model with more memory and SSD',
    units: 8
  });
  await readProducts();
  await removeProductById(1);
  await readProducts();
}

main().catch((error) => {
  console.error('Workshop database demo failed:', error);
  process.exitCode = 1;
}).finally(async () => {
  await closeDB();
});