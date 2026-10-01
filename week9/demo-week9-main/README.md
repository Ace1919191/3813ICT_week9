# Week 9: MongoDB, Express, and Angular

The Angular frontend is in `week9/`; the Express API and MongoDB scripts are in `server/`.

## Run the application

1. Start MongoDB locally on port `27017`, or configure `mongo_url`, `mongo_port`, and `mongo_name` in `server/.env`.
2. Start the API from one terminal:

   ```powershell
   cd server
   npm start
   ```

   It listens on `http://localhost:3001`. If MongoDB is unavailable, the server uses an in-memory MongoDB for local development unless `MONGO_MEMORY=false`.
3. Start Angular from a second terminal:

   ```powershell
   cd week9
   npm start
   ```

   Open `http://localhost:4200`.

The API supports listing (`GET /api/getProdlist`), adding (`POST /api/prod`), updating by MongoDB `_id` (`PUT /api/prod`), and deleting by `_id` (`DELETE /api/prod`). Product IDs are unique. Products have a numeric ID, name, optional type and description, price to two decimal places, and units in stock.

On API startup, three starter products (Laptop, Phone, and Headphones) are added if and only if the `products` collection is empty. Open the Products page at `http://localhost:4200/products` to view and manage them. Existing products are left unchanged.

## Standalone MongoDB CRUD demo

From `server/`, run `npm run workshop-demo` to clear the `products` collection, insert three sample products, read them, update one, and delete it. **This demonstration clears existing products before inserting its samples.**

## Verify

```powershell
cd server
npm test
cd ..\week9
npm run build
```
