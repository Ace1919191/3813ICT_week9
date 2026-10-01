import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { connectDB, health, seedProductsIfEmpty } from './db.js';
import { getProductList, updateProduct, addProduct, deleteProduct } from './routes/productRoutes.js';
import { onMessage } from './sockets.js';

dotenv.config();

const app = express();
const ALLOWED_ORIGINS = (process.env.allowed_origins || 'http://localhost:4200 http://127.0.0.1:4200')
  .split(/\s+/)
  .filter(Boolean);
const HTTP_PORT = Number(process.env.http_port || 3001);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

app.use(express.json());

app.get('/', (_req, res) => res.send({ ok: true }));
getProductList(app);
updateProduct(app);
addProduct(app);
deleteProduct(app);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE']
  }
});

async function sockets() {
  io.on('connect', (socket) => {
    onMessage(io, socket);
  });
}

sockets();

async function startServer() {
  await connectDB();
  await seedProductsIfEmpty();
  await health();
  httpServer.listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}`);
  });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  startServer().catch((error) => {
    console.error('Mongo setup failed:', error);
    process.exitCode = 1;
  });
}

export { app, httpServer };
