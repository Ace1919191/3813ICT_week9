import { expect } from 'chai';
import request from 'supertest';

process.env.mongo_name = `week9_test_${process.pid}`;

const { app, httpServer } = await import('../server.js');
const { connectDB, health, closeDB, seedProductsIfEmpty } = await import('../db.js');
const { addProducts } = await import('../App/add.js');
const { readProducts } = await import('../App/read.js');
const { updateProductById } = await import('../App/update.js');
const { removeProductById } = await import('../App/remove.js');

describe('Server Integration Tests', function () {
  let db;

  before(async function () {
    db = await connectDB();
    await db.collection('products').deleteMany({});
  });

  beforeEach(async function () {
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany([
      { id: 101, name: 'Laptop', description: 'Gaming laptop', price: 1200, units: 5 },
      { id: 102, name: 'Mouse', description: 'Wireless mouse', price: 25, units: 20 }
    ]);
  });

  after(async function () {
    await db.dropDatabase();
    await closeDB();
    if (httpServer.listening) {
      await new Promise((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
      });
    }
  });

  describe('Basic health check', function () {
    it('should respond with {ok:true} on GET /', async function () {
      const res = await request(app).get('/');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ ok: true });
    });

    it('should keep the database reachable', async function () {
      const conn = await connectDB();
      expect(conn).to.be.an('object');
      const status = await health();
      expect(status).to.be.ok;
    });
  });

  describe('GET /api/getProdlist', function () {
    it('should return an array of products', async function () {
      const res = await request(app).get('/api/getProdlist');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
      expect(res.body[0]).to.have.property('name');
      expect(res.body[0]).to.have.property('price');
    });

    it('should return an empty array when there are no products', async function () {
      await db.collection('products').deleteMany({});
      const res = await request(app).get('/api/getProdlist');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
    });
  });

  describe('POST /api/prod', function () {
    it('should add a new product when data is valid', async function () {
      const newProduct = { id: 103, name: 'Keyboard', description: 'Mechanical keyboard', price: 90, units: 12 };
      const res = await request(app).post('/api/prod').send(newProduct);
      expect(res.status).to.equal(201);
      expect(res.body.error).to.equal(false);
      expect(res.body).to.have.property('id');
      const savedProduct = await db.collection('products').findOne({ id: 103 });
      expect(savedProduct.name).to.equal('Keyboard');
    });

    it('should reject a duplicate product id', async function () {
      const duplicate = { id: 101, name: 'Duplicate Laptop', description: 'Same product id', price: 1000, units: 3 };
      const res = await request(app).post('/api/prod').send(duplicate);
      expect(res.status).to.equal(409);
      expect(res.body.error).to.equal('duplicate');
    });

    it('should reject invalid product data', async function () {
      const invalid = { id: 103, name: 'x'.repeat(51), description: '', price: 5.999, units: -1 };
      const res = await request(app).post('/api/prod').send(invalid);
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/prod', function () {
    it('should update an existing product', async function () {
      const updatedProduct = {
        _id: (await db.collection('products').findOne({ id: 101 }))._id.toString(),
        id: 101,
        name: 'Laptop Pro',
        description: 'Updated description',
        price: 1350,
        units: 7
      };

      const res = await request(app).put('/api/prod').send(updatedProduct);
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.equal(updatedProduct._id);

      const savedProduct = await db.collection('products').findOne({ id: 101 });
      expect(savedProduct.name).to.equal('Laptop Pro');
      expect(savedProduct.price).to.equal(1350);
    });

    it('should return 400 if product id is missing', async function () {
      const res = await request(app).put('/api/prod').send({ name: 'No ID', price: 10 });
      expect(res.status).to.equal(400);
    });

    it('should return 404 if the product does not exist', async function () {
      const res = await request(app).put('/api/prod').send({
        _id: '507f1f77bcf86cd799439011',
        id: 103,
        name: 'Missing',
        description: '',
        price: 10,
        units: 1
      });
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/prod', function () {
    it('should delete an existing product by _id', async function () {
      const target = await db.collection('products').findOne({ id: 101 });
      const res = await request(app).delete('/api/prod').send({ _id: target._id.toString() });
      expect(res.status).to.equal(200);
      expect(res.body.deleted).to.equal(true);
      const remaining = await db.collection('products').findOne({ id: 101 });
      expect(remaining).to.equal(null);
    });

    it('should return deleted false when the product is not found', async function () {
      const res = await request(app).delete('/api/prod').send({ _id: '507f1f77bcf86cd799439011' });
      expect(res.status).to.equal(200);
      expect(res.body.deleted).to.equal(false);
    });

    it('should require a MongoDB _id', async function () {
      const res = await request(app).delete('/api/prod').send({ id: 101 });
      expect(res.status).to.equal(400);
    });
  });

  describe('Standalone MongoDB CRUD demo', function () {
    it('should seed, read, update, and remove products using the shared database connection', async function () {
      await addProducts();
      const products = await readProducts();
      expect(products).to.have.length(3);
      expect(products[0]).to.have.property('units');

      await updateProductById(1, { name: 'Laptop Pro' });
      expect((await db.collection('products').findOne({ id: 1 })).name).to.equal('Laptop Pro');

      await removeProductById(1);
      expect(await db.collection('products').findOne({ id: 1 })).to.equal(null);
    });

    describe('Starter products', function () {
      it('should add three starter products to an empty collection without overwriting existing products', async function () {
        await db.collection('products').deleteMany({});
        expect(await seedProductsIfEmpty()).to.equal(true);
        expect(await db.collection('products').countDocuments({})).to.equal(3);

        expect(await seedProductsIfEmpty()).to.equal(false);
        expect(await db.collection('products').countDocuments({})).to.equal(3);
      });
    });
  });
});
