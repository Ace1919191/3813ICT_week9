import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

function normaliseProduct(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) return null;

  const id = product.id;
  const name = typeof product.name === 'string' ? product.name.trim() : '';
  const type = product.type === undefined
    ? ''
    : typeof product.type === 'string' ? product.type.trim() : null;
  const description = product.description === undefined
    ? ''
    : typeof product.description === 'string' ? product.description.trim() : null;
  const price = product.price;
  const units = product.units;

  if (
    typeof id !== 'number' || !Number.isSafeInteger(id) || id < 1 ||
    !name || name.length > 50 ||
    type === null || type.length > 50 ||
    description === null || description.length > 255 ||
    typeof price !== 'number' || !Number.isFinite(price) || price < 0 || Number(price.toFixed(2)) !== price ||
    typeof units !== 'number' || !Number.isSafeInteger(units) || units < 0
  ) {
    return null;
  }

  return { id, name, type, description, price, units };
}

function getProductList(app) {
  app.get('/api/getProdlist', async function (_req, res) {
    try {
      const db = getDB();
      const collection = db.collection('products');
      const data = await collection.find({}).toArray();
      return res.send(data);
    } catch (error) {
      console.error('Could not fetch products:', error);
      return res.status(500).send({ error: 'Could not fetch products' });
    }
  });
}

function updateProduct(app) {
  app.put('/api/prod', async function (req, res) {
    if (!req.body || !ObjectId.isValid(req.body._id)) {
      return res.status(400).send({ error: 'A valid product _id is required' });
    }

    const product = normaliseProduct(req.body);
    if (!product) return res.status(400).send({ error: 'Invalid product data' });

    try {
      const db = getDB();
      const collection = db.collection('products');
      const query = { _id: new ObjectId(req.body._id) };
      const result = await collection.updateOne(query, { $set: product });
      if (!result.matchedCount) return res.status(404).send({ error: 'Product not found' });
      return res.send({ ok: req.body._id });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).send({ error: 'duplicate' });
      }
      console.error('Could not update product:', error);
      return res.status(500).send({ error: 'Could not update product' });
    }
  });
}

function addProduct(app) {
  app.post('/api/prod', async function (req, res) {
    const product = normaliseProduct(req.body);
    if (!product) return res.status(400).send({ error: 'Invalid product data' });

    try {
      const db = getDB();
      const collection = db.collection('products');

      const existing = await collection.findOne({ id: product.id });
      if (existing) {
        return res.status(409).send({ error: 'duplicate' });
      }

      const result = await collection.insertOne(product);
      return res.status(201).send({ error: false, id: result.insertedId, product: { ...product, _id: result.insertedId } });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).send({ error: 'duplicate' });
      }
      console.error('Could not add product:', error);
      return res.status(500).send({ error: 'Could not add product' });
    }
  });
}

function deleteProduct(app) {
  app.delete('/api/prod', async function (req, res) {
    if (!req.body || !ObjectId.isValid(req.body._id)) {
      return res.status(400).send({ error: 'A valid product _id is required' });
    }

    try {
      const db = getDB();
      const collection = db.collection('products');
      const result = await collection.deleteOne({ _id: new ObjectId(req.body._id) });
      return res.send({ deleted: result.deletedCount > 0, _id: req.body._id });
    } catch (error) {
      console.error('Could not delete product:', error);
      return res.status(500).send({ error: 'Could not delete product' });
    }
  });
}

export { getProductList, updateProduct, addProduct, deleteProduct };